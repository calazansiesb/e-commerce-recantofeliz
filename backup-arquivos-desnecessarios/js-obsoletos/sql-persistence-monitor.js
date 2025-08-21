/**
 * Monitor SQL de Persistência - Rastreamento Completo de Operações de Banco
 * 
 * Este sistema monitora TODAS as operações SQL, especialmente UPDATEs,
 * e registra logs detalhados no terminal para identificar problemas de persistência.
 */

class SQLPersistenceMonitor {
    constructor() {
        this.logs = [];
        this.logEndpoint = '/sql-log';
        this.sessionId = 'sql_session_' + Date.now();
        this.isActive = true;
        
        console.log('🔍 SQL Persistence Monitor iniciado');
        this.init();
    }
    
    init() {
        this.interceptSQLiteManager();
        this.interceptDataManager();
        this.interceptLocalStorage();
        this.startSQLMonitoring();
        this.setupErrorCatching();
        
        this.logSQL('🚀 Monitor SQL iniciado - Rastreando operações de persistência', 'INIT');
    }
    
    // Interceptar SQLiteManager para monitorar operações SQL
    interceptSQLiteManager() {
        if (window.sqliteManager) {
            const originalAddProduct = window.sqliteManager.addProduct;
            const originalUpdateProduct = window.sqliteManager.updateProduct;
            const originalDeleteProduct = window.sqliteManager.deleteProduct;
            
            // Interceptar addProduct
            window.sqliteManager.addProduct = (productData) => {
                const startTime = Date.now();
                this.logSQL(`📝 INICIANDO addProduct: ${JSON.stringify(productData)}`, 'SQL_START');
                
                try {
                    const result = originalAddProduct.call(window.sqliteManager, productData);
                    const endTime = Date.now();
                    
                    this.logSQL(`✅ addProduct SUCESSO em ${endTime - startTime}ms - Resultado: ${result}`, 'SQL_SUCCESS');
                    this.logSQL(`📊 Produto adicionado: ID=${productData.id || 'auto'}, Nome=${productData.name}, Preço=R$${productData.price}`, 'SQL_DETAIL');
                    
                    return result;
                } catch (error) {
                    this.logSQL(`❌ addProduct ERRO: ${error.message}`, 'SQL_ERROR');
                    this.logSQL(`🔍 Stack trace: ${error.stack}`, 'SQL_ERROR');
                    throw error;
                }
            };
            
            // Interceptar updateProduct (CRÍTICO para nosso problema)
            window.sqliteManager.updateProduct = (productId, productData) => {
                const startTime = Date.now();
                this.logSQL(`🔄 INICIANDO updateProduct: ID=${productId}`, 'SQL_START');
                this.logSQL(`📋 Dados para update: ${JSON.stringify(productData)}`, 'SQL_DETAIL');
                
                try {
                    // Verificar estado antes do update
                    const beforeUpdate = window.sqliteManager.getProducts();
                    const productBefore = beforeUpdate.find(p => p.id === productId);
                    
                    this.logSQL(`📋 ANTES UPDATE: ${productBefore ? `${productBefore.name} - R$${productBefore.price}` : 'Produto não encontrado'}`, 'SQL_BEFORE');
                    
                    const result = originalUpdateProduct.call(window.sqliteManager, productId, productData);
                    const endTime = Date.now();
                    
                    // Verificar estado depois do update
                    const afterUpdate = window.sqliteManager.getProducts();
                    const productAfter = afterUpdate.find(p => p.id === productId);
                    
                    this.logSQL(`📋 DEPOIS UPDATE: ${productAfter ? `${productAfter.name} - R$${productAfter.price}` : 'Produto não encontrado'}`, 'SQL_AFTER');
                    this.logSQL(`✅ updateProduct SUCESSO em ${endTime - startTime}ms - Resultado: ${result}`, 'SQL_SUCCESS');
                    
                    // Verificar se realmente mudou
                    if (productBefore && productAfter) {
                        const changed = productBefore.price !== productAfter.price || productBefore.name !== productAfter.name;
                        this.logSQL(`🔍 Mudança detectada: ${changed ? 'SIM' : 'NÃO'}`, changed ? 'SQL_SUCCESS' : 'SQL_WARNING');
                    }
                    
                    return result;
                } catch (error) {
                    this.logSQL(`❌ updateProduct ERRO: ${error.message}`, 'SQL_ERROR');
                    this.logSQL(`🔍 Stack trace: ${error.stack}`, 'SQL_ERROR');
                    throw error;
                }
            };
            
            // Interceptar deleteProduct
            window.sqliteManager.deleteProduct = (productId) => {
                const startTime = Date.now();
                this.logSQL(`🗑️ INICIANDO deleteProduct: ID=${productId}`, 'SQL_START');
                
                try {
                    const result = originalDeleteProduct.call(window.sqliteManager, productId);
                    const endTime = Date.now();
                    
                    this.logSQL(`✅ deleteProduct SUCESSO em ${endTime - startTime}ms - Resultado: ${result}`, 'SQL_SUCCESS');
                    
                    return result;
                } catch (error) {
                    this.logSQL(`❌ deleteProduct ERRO: ${error.message}`, 'SQL_ERROR');
                    throw error;
                }
            };
            
            this.logSQL('🔧 SQLiteManager interceptado com sucesso', 'SETUP');
        } else {
            this.logSQL('⚠️ SQLiteManager não encontrado para interceptação', 'WARNING');
        }
    }
    
    // Interceptar DataManager para operações de sincronização
    interceptDataManager() {
        if (window.dataManager) {
            const originalUpdateProduct = window.dataManager.updateProduct;
            const originalSaveProducts = window.dataManager.saveProducts;
            
            window.dataManager.updateProduct = function(productId, productData) {
                const monitor = window.sqlMonitor;
                monitor.logSQL(`📊 DataManager.updateProduct: ID=${productId}`, 'DATAMANAGER_START');
                monitor.logSQL(`📋 DataManager dados: ${JSON.stringify(productData)}`, 'DATAMANAGER_DETAIL');
                
                try {
                    const result = originalUpdateProduct.call(this, productId, productData);
                    monitor.logSQL(`✅ DataManager.updateProduct resultado: ${result}`, 'DATAMANAGER_SUCCESS');
                    return result;
                } catch (error) {
                    monitor.logSQL(`❌ DataManager.updateProduct erro: ${error.message}`, 'DATAMANAGER_ERROR');
                    throw error;
                }
            };
            
            window.dataManager.saveProducts = function(products) {
                const monitor = window.sqlMonitor;
                monitor.logSQL(`💾 DataManager.saveProducts: ${products.length} produtos`, 'DATAMANAGER_SAVE');
                
                try {
                    const result = originalSaveProducts.call(this, products);
                    monitor.logSQL(`✅ DataManager.saveProducts sucesso`, 'DATAMANAGER_SUCCESS');
                    return result;
                } catch (error) {
                    monitor.logSQL(`❌ DataManager.saveProducts erro: ${error.message}`, 'DATAMANAGER_ERROR');
                    throw error;
                }
            };
            
            this.logSQL('🔧 DataManager interceptado com sucesso', 'SETUP');
        } else {
            this.logSQL('⚠️ DataManager não encontrado para interceptação', 'WARNING');
        }
    }
    
    // Interceptar localStorage para monitorar persistência
    interceptLocalStorage() {
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;
        const originalClear = localStorage.clear;
        
        localStorage.setItem = (key, value) => {
            if (key.includes('granja') || key.includes('Recanto')) {
                try {
                    const data = JSON.parse(value);
                    if (data.products) {
                        this.logSQL(`💾 localStorage.setItem('${key}'): ${data.products.length} produtos salvos`, 'STORAGE_SAVE');
                        
                        // Log do primeiro produto para verificação
                        if (data.products.length > 0) {
                            const first = data.products[0];
                            this.logSQL(`📋 Primeiro produto salvo: ${first.name} - R$${first.price}`, 'STORAGE_DETAIL');
                        }
                    }
                } catch (e) {
                    this.logSQL(`💾 localStorage.setItem('${key}'): dados não-JSON salvos`, 'STORAGE_SAVE');
                }
            }
            
            return originalSetItem.call(localStorage, key, value);
        };
        
        localStorage.clear = () => {
            this.logSQL(`💥 localStorage.clear() - TODOS OS DADOS REMOVIDOS!`, 'STORAGE_CLEAR');
            return originalClear.call(localStorage);
        };
        
        this.logSQL('🔧 localStorage interceptado com sucesso', 'SETUP');
    }
    
    // Monitoramento contínuo de estado SQL
    startSQLMonitoring() {
        // Verificar estado a cada 3 segundos
        setInterval(() => {
            if (window.sqliteManager && window.dataManager) {
                try {
                    const sqliteProducts = window.sqliteManager.getProducts();
                    const dataManagerProducts = window.dataManager.getProducts();
                    
                    this.logSQL(`💓 HEARTBEAT: SQLite=${sqliteProducts.length}, DataManager=${dataManagerProducts.length}`, 'HEARTBEAT');
                    
                    // Verificar sincronização
                    if (sqliteProducts.length > 0 && dataManagerProducts.length > 0) {
                        const sqliteFirst = sqliteProducts[0];
                        const dataManagerFirst = dataManagerProducts[0];
                        
                        if (sqliteFirst.price !== dataManagerFirst.price) {
                            this.logSQL(`⚠️ DESSINCRONIZAÇÃO DETECTADA! SQLite: R$${sqliteFirst.price}, DataManager: R$${dataManagerFirst.price}`, 'SYNC_WARNING');
                        }
                    }
                } catch (error) {
                    this.logSQL(`❌ Erro no monitoramento: ${error.message}`, 'MONITOR_ERROR');
                }
            }
        }, 3000);
    }
    
    // Capturar erros globais
    setupErrorCatching() {
        window.addEventListener('error', (event) => {
            if (event.error && event.error.stack && 
                (event.error.stack.includes('sqlite') || event.error.stack.includes('sql'))) {
                this.logSQL(`🚨 ERRO GLOBAL SQL: ${event.error.message}`, 'GLOBAL_ERROR');
                this.logSQL(`📍 Local: ${event.filename}:${event.lineno}`, 'GLOBAL_ERROR');
            }
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.toString().includes('sql')) {
                this.logSQL(`🚨 PROMISE REJEITADA SQL: ${event.reason}`, 'PROMISE_ERROR');
            }
        });
    }
    
    // Método principal de log
    logSQL(message, type = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            sessionId: this.sessionId,
            type,
            message,
            url: window.location.href,
            stackTrace: new Error().stack
        };
        
        // Console local
        console.log(`[SQL-MONITOR] ${type}: ${message}`);
        
        // Enviar para terminal
        this.sendToTerminal(logEntry);
        
        // Guardar local
        this.logs.push(logEntry);
        if (this.logs.length > 200) {
            this.logs.shift(); // Manter só os últimos 200
        }
    }
    
    sendToTerminal(logEntry) {
        // Desabilitado para evitar erros 501 no terminal
        // fetch('/sql-log', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(logEntry)
        // }).catch(() => {
            // Fallback para sessionStorage
            const logs = JSON.parse(sessionStorage.getItem('sql_monitor_logs') || '[]');
            logs.push(logEntry);
            if (logs.length > 50) logs.shift();
            sessionStorage.setItem('sql_monitor_logs', JSON.stringify(logs));
        // });
    }
    
    // Métodos utilitários
    getLogs() {
        return this.logs;
    }
    
    clearLogs() {
        this.logs = [];
        this.logSQL('🧹 Logs limpos', 'SYSTEM');
    }
    
    // Método para forçar teste de UPDATE
    testUpdate(productId, newPrice) {
        this.logSQL(`🧪 TESTE MANUAL: Forçando update do produto ${productId} para R$${newPrice}`, 'TEST');
        
        if (window.sqliteManager) {
            try {
                const result = window.sqliteManager.updateProduct(productId, { price: newPrice });
                this.logSQL(`🧪 RESULTADO TESTE: ${result}`, 'TEST');
                return result;
            } catch (error) {
                this.logSQL(`🧪 ERRO NO TESTE: ${error.message}`, 'TEST_ERROR');
                return false;
            }
        } else {
            this.logSQL(`🧪 TESTE FALHOU: SQLiteManager não disponível`, 'TEST_ERROR');
            return false;
        }
    }
}

// Inicializar monitor global
window.addEventListener('DOMContentLoaded', () => {
    // Aguardar outros scripts carregarem
    setTimeout(() => {
        window.sqlMonitor = new SQLPersistenceMonitor();
        
        // Função global para testes manuais
        window.testSQLUpdate = (productId, newPrice) => {
            if (window.sqlMonitor) {
                return window.sqlMonitor.testUpdate(productId, newPrice);
            }
        };
        
        console.log('🔍 SQL Persistence Monitor ativo!');
        console.log('📋 Use testSQLUpdate(id, preço) para testes manuais');
        
    }, 1000);
});

console.log('📦 SQL Persistence Monitor carregado e aguardando inicialização...');
