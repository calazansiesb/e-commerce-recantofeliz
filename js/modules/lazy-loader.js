// Lazy Loader - Code Splitting Inteligente
// Carrega módulos apenas quando necessários

class LazyLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loadingPromises = new Map();
        this.init();
    }
    
    init() {
        console.log('⚡ LazyLoader inicializado');
        this.setupConditionalLoading();
    }
    
    setupConditionalLoading() {
        // Carregar admin.js apenas em páginas admin
        if (window.location.pathname.includes('admin')) {
            this.loadModule('admin-features');
        }
        
        // Carregar gestão de pedidos apenas quando necessário
        if (window.location.pathname.includes('gestao-pedidos')) {
            this.loadModule('order-management');
        }
        
        // Carregar funcionalidades de carrinho apenas quando usado
        this.setupCartLazyLoading();
    }
    
    async loadModule(moduleName) {
        if (this.loadedModules.has(moduleName)) {
            return Promise.resolve();
        }
        
        if (this.loadingPromises.has(moduleName)) {
            return this.loadingPromises.get(moduleName);
        }
        
        const loadPromise = this.dynamicImport(moduleName);
        this.loadingPromises.set(moduleName, loadPromise);
        
        try {
            await loadPromise;
            this.loadedModules.add(moduleName);
            console.log(`✅ Módulo ${moduleName} carregado`);
        } catch (error) {
            console.error(`❌ Erro ao carregar ${moduleName}:`, error);
            this.loadingPromises.delete(moduleName);
        }
        
        return loadPromise;
    }
    
    async dynamicImport(moduleName) {
        switch (moduleName) {
            case 'admin-features':
                return this.loadScript('js/admin.js');
                
            case 'order-management':
                return this.loadScript('js/pedidos-manager.js');
                
            case 'cart-advanced':
                return this.loadScript('js/modules/cart-manager.js');
                
            case 'image-gallery':
                return this.loadScript('js/modules/gallery-manager.js');
                
            default:
                throw new Error(`Módulo ${moduleName} não encontrado`);
        }
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    setupCartLazyLoading() {
        // Carregar funcionalidades avançadas do carrinho apenas quando necessário
        const cartButton = document.getElementById('cart-button');
        if (cartButton) {
            cartButton.addEventListener('click', () => {
                this.loadModule('cart-advanced');
            }, { once: true });
        }
    }
    
    // Lazy loading para modais de produtos
    setupProductModalLazyLoading() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.detail-btn')) {
                this.loadModule('image-gallery');
            }
        }, { once: true });
    }
    
    // Preload crítico baseado em interação do usuário
    preloadOnHover(selector, moduleName) {
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches(selector)) {
                this.loadModule(moduleName);
            }
        }, { once: true });
    }
    
    // Preload baseado em scroll
    preloadOnScroll(threshold, moduleName) {
        let loaded = false;
        
        window.addEventListener('scroll', () => {
            if (loaded) return;
            
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > threshold) {
                this.loadModule(moduleName);
                loaded = true;
            }
        });
    }
}

// Inicializar lazy loader
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyLoader();
    
    // Configurar preloads inteligentes
    window.lazyLoader.preloadOnHover('.nav-button', 'navigation-advanced');
    window.lazyLoader.preloadOnScroll(50, 'footer-features');
});

export default LazyLoader;