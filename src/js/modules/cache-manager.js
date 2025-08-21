// Cache Manager - Sistema de cache inteligente com TTL e debounce
// Otimiza operações de dados e reduz chamadas desnecessárias

class CacheManager {
    constructor() {
        this.cache = new Map();
        this.debounceTimers = new Map();
        this.batchQueue = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutos
        
        this.init();
    }
    
    init() {
        console.log('💾 Cache Manager inicializado');
        this.setupPeriodicCleanup();
        this.setupBatchProcessor();
    }
    
    // Cache com TTL (Time To Live)
    set(key, value, ttl = this.defaultTTL) {
        const expiresAt = Date.now() + ttl;
        this.cache.set(key, {
            value,
            expiresAt,
            accessCount: 0,
            lastAccess: Date.now()
        });
        
        console.log(`💾 Cache set: ${key} (TTL: ${ttl}ms)`);
    }
    
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }
        
        // Verificar se expirou
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            console.log(`⏰ Cache expirado: ${key}`);
            return null;
        }
        
        // Atualizar estatísticas de acesso
        item.accessCount++;
        item.lastAccess = Date.now();
        
        return item.value;
    }
    
    // Cache de produtos com invalidação inteligente
    cacheProducts(products) {
        const key = 'products';
        this.set(key, products, 10 * 60 * 1000); // 10 minutos para produtos
        
        // Cache individual por produto para acesso rápido
        products.forEach(product => {
            this.set(`product_${product.id}`, product, 15 * 60 * 1000);
        });
    }
    
    getProducts() {
        return this.get('products');
    }
    
    getProduct(id) {
        return this.get(`product_${id}`);
    }
    
    // Debounce para operações de salvamento
    debouncedSave(key, saveFunction, delay = 1000) {
        // Cancelar timer anterior se existir
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key));
        }
        
        // Criar novo timer
        const timer = setTimeout(() => {
            saveFunction();
            this.debounceTimers.delete(key);
            console.log(`💾 Debounced save executado: ${key}`);
        }, delay);
        
        this.debounceTimers.set(key, timer);
        console.log(`⏳ Debounced save agendado: ${key} (${delay}ms)`);
    }
    
    // Batch updates para múltiplas alterações
    addToBatch(operation, data) {
        const batchKey = operation;\n        \n        if (!this.batchQueue.has(batchKey)) {\n            this.batchQueue.set(batchKey, []);\n        }\n        \n        this.batchQueue.get(batchKey).push(data);\n        \n        // Processar batch após delay\n        this.debouncedSave(`batch_${batchKey}`, () => {\n            this.processBatch(batchKey);\n        }, 2000);\n    }\n    \n    processBatch(batchKey) {\n        const items = this.batchQueue.get(batchKey);\n        if (!items || items.length === 0) return;\n        \n        console.log(`📦 Processando batch: ${batchKey} (${items.length} itens)`);\n        \n        switch (batchKey) {\n            case 'product_updates':\n                this.batchUpdateProducts(items);\n                break;\n            case 'cart_updates':\n                this.batchUpdateCart(items);\n                break;\n            case 'analytics':\n                this.batchSendAnalytics(items);\n                break;\n        }\n        \n        // Limpar batch processado\n        this.batchQueue.delete(batchKey);\n    }\n    \n    batchUpdateProducts(updates) {\n        // Agrupar updates por produto\n        const productUpdates = new Map();\n        \n        updates.forEach(update => {\n            const productId = update.productId;\n            if (!productUpdates.has(productId)) {\n                productUpdates.set(productId, {});\n            }\n            Object.assign(productUpdates.get(productId), update.changes);\n        });\n        \n        // Aplicar updates agrupados\n        productUpdates.forEach((changes, productId) => {\n            this.updateProductCache(productId, changes);\n        });\n        \n        // Salvar no localStorage uma única vez\n        this.saveProductsToStorage();\n    }\n    \n    batchUpdateCart(updates) {\n        // Processar todas as alterações do carrinho de uma vez\n        const finalCart = this.get('cart') || [];\n        \n        updates.forEach(update => {\n            switch (update.action) {\n                case 'add':\n                    finalCart.push(update.item);\n                    break;\n                case 'remove':\n                    const index = finalCart.findIndex(item => item.id === update.itemId);\n                    if (index > -1) finalCart.splice(index, 1);\n                    break;\n                case 'update':\n                    const item = finalCart.find(item => item.id === update.itemId);\n                    if (item) Object.assign(item, update.changes);\n                    break;\n            }\n        });\n        \n        this.set('cart', finalCart);\n        this.saveCartToStorage(finalCart);\n    }\n    \n    batchSendAnalytics(events) {\n        // Enviar eventos de analytics em batch\n        if (typeof gtag !== 'undefined') {\n            events.forEach(event => {\n                gtag('event', event.action, event.data);\n            });\n        }\n        \n        console.log(`📊 ${events.length} eventos de analytics enviados`);\n    }\n    \n    // Cache de imagens com lazy loading\n    cacheImage(src) {\n        const key = `image_${src}`;\n        \n        if (this.get(key)) {\n            return Promise.resolve(this.get(key));\n        }\n        \n        return new Promise((resolve, reject) => {\n            const img = new Image();\n            img.onload = () => {\n                this.set(key, src, 30 * 60 * 1000); // 30 minutos para imagens\n                resolve(src);\n            };\n            img.onerror = reject;\n            img.src = src;\n        });\n    }\n    \n    // Limpeza periódica do cache\n    setupPeriodicCleanup() {\n        setInterval(() => {\n            this.cleanup();\n        }, 5 * 60 * 1000); // Limpar a cada 5 minutos\n    }\n    \n    cleanup() {\n        const now = Date.now();\n        let removedCount = 0;\n        \n        for (const [key, item] of this.cache.entries()) {\n            if (now > item.expiresAt) {\n                this.cache.delete(key);\n                removedCount++;\n            }\n        }\n        \n        if (removedCount > 0) {\n            console.log(`🧹 Cache cleanup: ${removedCount} itens removidos`);\n        }\n    }\n    \n    // Configurar processamento de batch\n    setupBatchProcessor() {\n        // Processar batches pendentes a cada 5 segundos\n        setInterval(() => {\n            for (const [batchKey] of this.batchQueue.entries()) {\n                const items = this.batchQueue.get(batchKey);\n                if (items && items.length > 0) {\n                    // Processar se há muitos itens acumulados\n                    if (items.length >= 10) {\n                        this.processBatch(batchKey);\n                    }\n                }\n            }\n        }, 5000);\n    }\n    \n    // Métodos auxiliares\n    updateProductCache(productId, changes) {\n        const product = this.getProduct(productId);\n        if (product) {\n            Object.assign(product, changes);\n            this.set(`product_${productId}`, product);\n        }\n    }\n    \n    saveProductsToStorage() {\n        const products = this.getProducts();\n        if (products) {\n            localStorage.setItem('granjaRecantoFelizData', JSON.stringify({\n                products,\n                lastUpdate: new Date().toISOString()\n            }));\n        }\n    }\n    \n    saveCartToStorage(cart) {\n        localStorage.setItem('carrinho', JSON.stringify(cart));\n    }\n    \n    // Estatísticas do cache\n    getStats() {\n        const stats = {\n            totalItems: this.cache.size,\n            totalBatches: this.batchQueue.size,\n            pendingDebounces: this.debounceTimers.size,\n            memoryUsage: this.estimateMemoryUsage()\n        };\n        \n        console.log('📊 Cache Stats:', stats);\n        return stats;\n    }\n    \n    estimateMemoryUsage() {\n        let size = 0;\n        for (const [key, item] of this.cache.entries()) {\n            size += key.length * 2; // chars são 2 bytes\n            size += JSON.stringify(item.value).length * 2;\n        }\n        return `${(size / 1024).toFixed(2)} KB`;\n    }\n}\n\n// Inicializar cache manager\ndocument.addEventListener('DOMContentLoaded', () => {\n    window.cacheManager = new CacheManager();\n    \n    // Integrar com sistema existente\n    if (window.dataManager) {\n        // Interceptar operações de produtos\n        const originalGetProducts = window.dataManager.getActiveProducts;\n        window.dataManager.getActiveProducts = function() {\n            const cached = window.cacheManager.getProducts();\n            if (cached) {\n                return Promise.resolve(cached);\n            }\n            \n            return originalGetProducts.call(this).then(products => {\n                window.cacheManager.cacheProducts(products);\n                return products;\n            });\n        };\n    }\n});\n\nexport default CacheManager;