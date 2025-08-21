/**
 * Sistema Robusto de Inicialização SQLite - Granja Recanto Feliz
 * 
 * Esta é a solução definitiva para o problema de inicialização do SQLiteManager.
 * 
 * PROBLEMAS IDENTIFICADOS:
 * 1. SQL.js carregando de forma assíncrona sem aguardar
 * 2. SQLiteManager tentando inicializar antes do SQL.js estar pronto
 * 3. Múltiplas tentativas de inicialização simultâneas
 * 4. Falta de sequenciamento adequado na carga dos scripts
 * 
 * SOLUÇÃO:
 * - Inicialização sequencial garantida
 * - Aguardar carregamento completo do SQL.js
 * - Verificação de dependências antes de cada etapa
 * - Sistema de retry inteligente com backoff exponencial
 * - Fallback robusto para DataManager apenas
 */

class SQLiteRobustInitializer {
    constructor() {
        this.isInitialized = false;
        this.isInitializing = false;
        this.retryCount = 0;
        this.maxRetries = 5;
        this.sqliteManager = null;
        
        console.log('🚀 Sistema Robusto SQLite iniciado');
        console.log('🔍 Diagnóstico inicial...');
        this.diagnoseEnvironment();
        
        // Aguardar DOM e depois inicializar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startInitialization());
        } else {
            this.startInitialization();
        }
    }
    
    diagnoseEnvironment() {
        console.log('📊 === DIAGNÓSTICO DO AMBIENTE ===');
        console.log(`🌐 SQL.js disponível: ${typeof initSqlJs !== 'undefined'}`);
        console.log(`🏗️ SQLiteManager class: ${typeof SQLiteManager !== 'undefined'}`);
        console.log(`📦 DataManager class: ${typeof DataManager !== 'undefined'}`);
        console.log(`🪟 window.sqliteManager: ${typeof window.sqliteManager}`);
        console.log(`📋 document.readyState: ${document.readyState}`);
        console.log('=====================================');
    }
    
    async startInitialization() {
        if (this.isInitializing || this.isInitialized) {
            console.log('⚠️ Inicialização já em andamento ou concluída');
            return;
        }
        
        this.isInitializing = true;
        console.log('🏁 Iniciando processo de inicialização SQLite...');
        
        try {
            // Etapa 1: Aguardar SQL.js estar completamente carregado
            await this.waitForSqlJs();
            
            // Etapa 2: Aguardar SQLiteManager class estar disponível
            await this.waitForSQLiteManagerClass();
            
            // Etapa 3: Inicializar SQLiteManager com retry
            await this.initializeSQLiteWithRetry();
            
            // Etapa 4: Verificar funcionamento
            await this.verifyOperation();
            
            // Etapa 5: Configurar eventos e finalizar
            this.setupEventHandlers();
            
            this.isInitialized = true;
            this.isInitializing = false;
            
            console.log('✅ SQLite inicializado com sucesso!');
            this.notifyReady();
            
        } catch (error) {
            console.error('❌ Falha na inicialização SQLite:', error);
            this.isInitializing = false;
            this.fallbackToDataManagerOnly();
        }
    }
    
    async waitForSqlJs() {
        console.log('⏳ Aguardando SQL.js...');
        
        return new Promise((resolve, reject) => {
            const checkSqlJs = () => {
                if (typeof initSqlJs !== 'undefined') {
                    console.log('✅ SQL.js detectado');
                    resolve();
                } else if (this.retryCount >= this.maxRetries) {
                    reject(new Error('SQL.js não carregou após ' + this.maxRetries + ' tentativas'));
                } else {
                    this.retryCount++;
                    console.log(`🔄 Aguardando SQL.js... tentativa ${this.retryCount}`);
                    setTimeout(checkSqlJs, 1000 * this.retryCount); // Backoff exponencial
                }
            };
            
            checkSqlJs();
        });
    }
    
    async waitForSQLiteManagerClass() {
        console.log('⏳ Aguardando SQLiteManager class...');
        
        return new Promise((resolve, reject) => {
            const checkClass = () => {
                if (typeof SQLiteManager !== 'undefined') {
                    console.log('✅ SQLiteManager class detectada');
                    resolve();
                } else if (this.retryCount >= this.maxRetries * 2) {
                    reject(new Error('SQLiteManager class não encontrada'));
                } else {
                    this.retryCount++;
                    console.log(`🔄 Aguardando SQLiteManager class... tentativa ${this.retryCount}`);
                    setTimeout(checkClass, 500);
                }
            };
            
            checkClass();
        });
    }
    
    async initializeSQLiteWithRetry() {
        console.log('🔧 Inicializando SQLiteManager...');
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`🎯 Tentativa ${attempt} de inicialização...`);
                
                // Limpar instância anterior se existir
                if (window.sqliteManager) {
                    console.log('🧹 Limpando instância anterior...');
                    delete window.sqliteManager;
                }
                
                // Criar nova instância
                console.log('🏗️ Criando nova instância SQLiteManager...');
                this.sqliteManager = new SQLiteManager();
                
                // Aguardar inicialização completa
                await this.waitForSQLiteInitialization(this.sqliteManager);
                
                // Atribuir à window
                window.sqliteManager = this.sqliteManager;
                
                console.log(`✅ SQLiteManager inicializado na tentativa ${attempt}`);
                return;
                
            } catch (error) {
                console.warn(`⚠️ Tentativa ${attempt} falhou: ${error.message}`);
                
                if (attempt === this.maxRetries) {
                    throw new Error(`Falha após ${this.maxRetries} tentativas: ${error.message}`);
                }
                
                // Aguardar antes da próxima tentativa
                await this.delay(1000 * attempt);
            }
        }
    }
    
    async waitForSQLiteInitialization(sqliteManager) {
        console.log('⏳ Aguardando inicialização interna do SQLite...');
        
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Timeout na inicialização do SQLite (15s)'));
            }, 15000);
            
            const checkInit = () => {
                if (sqliteManager.db && sqliteManager.db !== null) {
                    clearTimeout(timeout);
                    console.log('✅ Banco SQLite inicializado internamente');
                    resolve();
                } else {
                    setTimeout(checkInit, 200);
                }
            };
            
            checkInit();
        });
    }
    
    async verifyOperation() {
        console.log('🔍 Verificando operação do SQLite...');
        
        try {
            if (!window.sqliteManager || !window.sqliteManager.db) {
                throw new Error('SQLiteManager ou banco não disponível');
            }
            
            // Testar consulta básica
            const products = window.sqliteManager.getProducts();
            console.log(`📊 Teste de consulta: ${products.length} produtos encontrados`);
            
            // Testar que realmente está funcionando
            if (typeof products === 'object' && Array.isArray(products)) {
                console.log('✅ SQLite operacional - consultas funcionando');
            } else {
                throw new Error('Consulta retornou dados inválidos');
            }
            
        } catch (error) {
            console.error('❌ Verificação de operação falhou:', error);
            throw error;
        }
    }
    
    setupEventHandlers() {
        console.log('🔗 Configurando event handlers...');
        
        // Listener para aguardar SQLite antes de operações críticas
        window.addEventListener('beforeSQLiteOperation', async (event) => {
            if (!this.isInitialized) {
                console.log('⏳ Aguardando SQLite para operação...');
                await this.waitForReady();
            }
        });
        
        console.log('✅ Event handlers configurados');
    }
    
    async waitForReady() {
        return new Promise((resolve) => {
            const checkReady = () => {
                if (this.isInitialized && window.sqliteManager && window.sqliteManager.db) {
                    resolve();
                } else {
                    setTimeout(checkReady, 100);
                }
            };
            checkReady();
        });
    }
    
    notifyReady() {
        console.log('📡 Notificando que SQLite está pronto...');
        
        // Evento para aplicação saber que está pronto
        window.dispatchEvent(new CustomEvent('sqliteFullyReady', {
            detail: {
                manager: window.sqliteManager,
                productsCount: window.sqliteManager.getProducts().length,
                timestamp: new Date().toISOString()
            }
        }));
        
        // Flag global para verificação rápida
        window.sqliteReady = true;
        
        console.log('🎉 SQLite completamente operacional!');
    }
    
    fallbackToDataManagerOnly() {
        console.warn('🚨 === MODO FALLBACK ATIVADO ===');
        console.warn('⚠️ SQLite não disponível - usando apenas DataManager');
        
        // Garantir que DataManager funciona
        if (typeof DataManager !== 'undefined') {
            if (!window.dataManager) {
                window.dataManager = new DataManager();
                console.log('✅ DataManager inicializado como fallback');
            }
            
            // Marcar que estamos em modo fallback
            window.sqliteFallbackMode = true;
            
            // Notificar modo fallback
            window.dispatchEvent(new CustomEvent('sqliteFallbackActive', {
                detail: {
                    reason: 'SQLite initialization failed',
                    fallbackSystem: 'DataManager only'
                }
            }));
            
        } else {
            console.error('❌ DataManager também não disponível - erro crítico');
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Método público para verificar status
    getStatus() {
        return {
            initialized: this.isInitialized,
            initializing: this.isInitializing,
            sqliteManager: !!window.sqliteManager,
            database: !!(window.sqliteManager && window.sqliteManager.db),
            fallbackMode: !!window.sqliteFallbackMode,
            retryCount: this.retryCount
        };
    }
}

// === INICIALIZAÇÃO GLOBAL ===

// Garantir que só há uma instância
if (!window.sqliteRobustInitializer) {
    window.sqliteRobustInitializer = new SQLiteRobustInitializer();
} else {
    console.log('⚠️ SQLiteRobustInitializer já existe - usando instância existente');
}

console.log('📦 SQLite Robust Initializer carregado');
