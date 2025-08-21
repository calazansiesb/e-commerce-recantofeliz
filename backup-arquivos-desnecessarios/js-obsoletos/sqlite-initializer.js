/**
 * Correção de Inicialização SQLite
 * 
 * Este script garante que o SQLiteManager seja inicializado corretamente
 * antes de qualquer operação de UPDATE.
 */

class SQLiteInitializer {
    constructor() {
        this.initialized = false;
        this.retryCount = 0;
        this.maxRetries = 10;
        
        console.log('🔧 SQLite Initializer iniciado');
        this.initializeWithRetry();
    }
    
    async initializeWithRetry() {
        while (!this.initialized && this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`🔄 Tentativa ${this.retryCount}: Inicializando SQLiteManager...`);
            
            try {
                await this.initializeSQLite();
                if (window.sqliteManager && window.sqliteManager.db) {
                    this.initialized = true;
                    console.log('✅ SQLiteManager inicializado com sucesso!');
                    
                    // Testar se funciona
                    const products = window.sqliteManager.getProducts();
                    console.log(`📊 SQLite operacional: ${products.length} produtos`);
                    
                    // Notificar que está pronto
                    window.dispatchEvent(new CustomEvent('sqliteReady', {
                        detail: { productsCount: products.length }
                    }));
                    
                    break;
                } else {
                    throw new Error('SQLiteManager não criado corretamente');
                }
            } catch (error) {
                console.warn(`⚠️ Tentativa ${this.retryCount} falhou: ${error.message}`);
                
                if (this.retryCount < this.maxRetries) {
                    await this.delay(1000 * this.retryCount); // Delay crescente
                } else {
                    console.error('❌ Falha ao inicializar SQLite após todas as tentativas');
                    this.fallbackToDataManagerOnly();
                }
            }
        }
    }
    
    async initializeSQLite() {
        // Verificar se SQL.js está carregado
        if (typeof initSqlJs === 'undefined') {
            throw new Error('SQL.js não carregado');
        }
        
        // Verificar se SQLiteManager existe
        if (typeof SQLiteManager === 'undefined') {
            throw new Error('SQLiteManager class não encontrada');
        }
        
        // Criar instância se não existir
        if (!window.sqliteManager) {
            console.log('🔧 Criando nova instância do SQLiteManager...');
            window.sqliteManager = new SQLiteManager();
        }
        
        // Aguardar inicialização
        await this.waitForInitialization();
    }
    
    async waitForInitialization() {
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                if (window.sqliteManager && window.sqliteManager.db) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            
            // Timeout após 5 segundos
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error('Timeout na inicialização do SQLite'));
            }, 5000);
        });
    }
    
    fallbackToDataManagerOnly() {
        console.warn('⚠️ Usando apenas DataManager - SQLite não disponível');
        
        // Modificar admin.js para usar apenas DataManager
        if (window.handleProductSubmit) {
            const originalSubmit = window.handleProductSubmit;
            window.handleProductSubmit = function(e) {
                console.log('⚠️ Modo fallback: usando apenas DataManager');
                return originalSubmit.call(this, e);
            };
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar assim que possível
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar outros scripts carregarem
    setTimeout(() => {
        window.sqliteInitializer = new SQLiteInitializer();
    }, 500);
});

console.log('📦 SQLite Initializer carregado');
