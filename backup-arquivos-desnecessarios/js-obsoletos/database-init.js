// Inicialização do Sistema de Banco de Dados
// Arquivo: database-init.js

// Variável global para o gerenciador de banco
window.dbManager = null;

/**
 * Inicializa o sistema de banco de dados
 * @returns {Promise<boolean>} Sucesso da inicialização
 */
async function initializeDatabase() {
    try {
        console.log('🚀 Inicializando sistema de banco de dados...');
        
        // Criar instância do DatabaseManager
        window.dbManager = new DatabaseManager();
        
        // Inicializar banco
        const success = await window.dbManager.init();
        
        if (success) {
            console.log('✅ Sistema de banco de dados inicializado com sucesso!');
            
            // Disponibilizar métodos globais para compatibilidade
            window.getProducts = () => window.dbManager.getProducts(true);
            window.addProduct = (data) => window.dbManager.addProduct(data);
            window.updateProduct = (id, data) => window.dbManager.updateProduct(id, data);
            window.deleteProduct = (id) => window.dbManager.deleteProduct(id);
            
            // Notificar outras páginas sobre a inicialização
            window.dispatchEvent(new CustomEvent('databaseInitialized', {
                detail: { success: true, manager: window.dbManager }
            }));
            
            return true;
        } else {
            console.error('❌ Falha ao inicializar banco de dados');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro crítico na inicialização do banco:', error);
        
        // Fallback para sistema anterior se disponível
        if (window.DataManager) {
            console.log('⚠️ Usando fallback para DataManager...');
            try {
                window.dataManager = new DataManager();
                return true;
            } catch (fallbackError) {
                console.error('❌ Fallback também falhou:', fallbackError);
            }
        }
        
        return false;
    }
}

/**
 * Verifica se o banco está pronto
 * @returns {boolean} Se o banco está inicializado
 */
function isDatabaseReady() {
    return window.dbManager && window.dbManager.isInitialized;
}

/**
 * Aguarda o banco estar pronto
 * @param {number} timeout Timeout em ms
 * @returns {Promise<boolean>} Se conseguiu aguardar com sucesso
 */
function waitForDatabase(timeout = 10000) {
    return new Promise((resolve) => {
        if (isDatabaseReady()) {
            resolve(true);
            return;
        }
        
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            if (isDatabaseReady()) {
                clearInterval(checkInterval);
                resolve(true);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                resolve(false);
            }
        }, 100);
    });
}

/**
 * Obtém produtos do banco com cache
 */
let productsCache = null;
let cacheTime = 0;
const CACHE_DURATION = 5000; // 5 segundos

function getProductsWithCache() {
    const now = Date.now();
    
    if (productsCache && (now - cacheTime) < CACHE_DURATION) {
        return productsCache;
    }
    
    if (isDatabaseReady()) {
        productsCache = window.dbManager.getProducts(true);
        cacheTime = now;
        return productsCache;
    }
    
    return [];
}

/**
 * Invalida cache de produtos
 */
function invalidateProductsCache() {
    productsCache = null;
    cacheTime = 0;
}

/**
 * Wrapper para adicionar produto com cache invalidation
 */
function addProductWithCache(productData) {
    if (!isDatabaseReady()) {
        throw new Error('Banco de dados não está pronto');
    }
    
    const result = window.dbManager.addProduct(productData);
    invalidateProductsCache();
    
    // Notificar outras páginas
    window.dispatchEvent(new CustomEvent('productAdded', {
        detail: { productId: result, productData }
    }));
    
    return result;
}

/**
 * Wrapper para atualizar produto com cache invalidation
 */
function updateProductWithCache(id, productData) {
    if (!isDatabaseReady()) {
        throw new Error('Banco de dados não está pronto');
    }
    
    const result = window.dbManager.updateProduct(id, productData);
    invalidateProductsCache();
    
    // Notificar outras páginas
    window.dispatchEvent(new CustomEvent('productUpdated', {
        detail: { productId: id, productData }
    }));
    
    return result;
}

/**
 * Wrapper para deletar produto com cache invalidation
 */
function deleteProductWithCache(id) {
    if (!isDatabaseReady()) {
        throw new Error('Banco de dados não está pronto');
    }
    
    const result = window.dbManager.deleteProduct(id);
    invalidateProductsCache();
    
    // Notificar outras páginas
    window.dispatchEvent(new CustomEvent('productDeleted', {
        detail: { productId: id }
    }));
    
    return result;
}

// Auto-inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 DOM carregado, aguardando inicialização do banco...');
    
    // Aguardar um pouco para garantir que todos os scripts foram carregados
    setTimeout(async () => {
        await initializeDatabase();
    }, 100);
});

// Event listeners para notificações entre páginas
window.addEventListener('productAdded', (event) => {
    console.log('📦 Produto adicionado:', event.detail);
});

window.addEventListener('productUpdated', (event) => {
    console.log('✏️ Produto atualizado:', event.detail);
});

window.addEventListener('productDeleted', (event) => {
    console.log('🗑️ Produto deletado:', event.detail);
});

// Exportar funções úteis
window.databaseUtils = {
    init: initializeDatabase,
    isReady: isDatabaseReady,
    waitFor: waitForDatabase,
    getProducts: getProductsWithCache,
    addProduct: addProductWithCache,
    updateProduct: updateProductWithCache,
    deleteProduct: deleteProductWithCache,
    invalidateCache: invalidateProductsCache
};
