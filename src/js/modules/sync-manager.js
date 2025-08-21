/**
 * SyncManager - Gerenciador de Sincronização
 * Responsável pela sincronização entre localStorage, SQLite e servidor
 */
class SyncManager {
    constructor() {
        this.storageKey = 'ecommerce_recantofeliz_data';
        this.syncLogKey = 'ecommerce_sync_log';
        this.maxSyncRetries = 3;
        this.syncInterval = 30000; // 30 segundos
        this.isAutoSyncEnabled = true;
    }

    // Inicializar sincronização automática
    initAutoSync() {
        if (this.isAutoSyncEnabled) {
            this.autoSyncInterval = setInterval(() => {
                this.performSync();
            }, this.syncInterval);
            
            console.log('✅ Sincronização automática iniciada');
        }
    }

    // Parar sincronização automática
    stopAutoSync() {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
            this.autoSyncInterval = null;
            console.log('⏹️ Sincronização automática parada');
        }
    }

    // Realizar sincronização completa
    async performSync() {
        try {
            console.log('🔄 Iniciando sincronização...');
            
            const results = {
                localStorage: true,
                sqlite: false,
                server: false,
                timestamp: new Date().toISOString()
            };

            // 1. Sincronizar com SQLite (se disponível)
            if (window.sqliteManager && window.sqliteManager.db) {
                results.sqlite = await this.syncWithSQLite();
            }

            // 2. Sincronizar com servidor (se disponível)
            results.server = await this.syncWithServer();

            // 3. Registrar log de sincronização
            this.logSync(results);

            console.log('✅ Sincronização concluída:', results);
            return results;
        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            this.logSync({ error: error.message, timestamp: new Date().toISOString() });
            return false;
        }
    }

    // Sincronizar com SQLite
    async syncWithSQLite() {
        try {
            console.log('🗄️ Sincronizando com SQLite...');
            
            const localData = this.getLocalStorageData();
            const sqliteData = window.sqliteManager.getProducts();

            // Comparar timestamps e determinar direção da sync
            if (localData.products && localData.products.length > 0) {
                if (sqliteData.length === 0 || this.isLocalDataNewer(localData, sqliteData)) {
                    // localStorage -> SQLite
                    return await this.pushToSQLite(localData.products);
                } else if (sqliteData.length > localData.products.length) {
                    // SQLite -> localStorage
                    return this.pullFromSQLite(sqliteData);
                }
            }

            return true;
        } catch (error) {
            console.error('❌ Erro na sincronização com SQLite:', error);
            return false;
        }
    }

    // Sincronizar com servidor
    async syncWithServer() {
        try {
            console.log('🌐 Sincronizando com servidor...');
            
            // Tentar buscar dados do servidor
            const response = await fetch('data/produtos.json', { 
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (response.ok) {
                const serverData = await response.json();
                const localData = this.getLocalStorageData();

                if (serverData.products && serverData.products.length > 0) {
                    // Verificar se dados do servidor são mais recentes
                    if (this.isServerDataNewer(localData, serverData)) {
                        return this.pullFromServer(serverData);
                    }
                }
            }

            return true;
        } catch (error) {
            console.warn('⚠️ Sincronização com servidor falhou (normal se offline):', error.message);
            return false;
        }
    }

    // Empurrar dados para SQLite
    async pushToSQLite(products) {
        try {
            let successCount = 0;
            
            for (const product of products) {
                try {
                    const exists = window.sqliteManager.getProducts().find(p => p.id === product.id);
                    
                    if (exists) {
                        const updated = window.sqliteManager.updateProduct(product.id, product);
                        if (updated) successCount++;
                    } else {
                        const added = window.sqliteManager.addProduct(product);
                        if (added) successCount++;
                    }
                } catch (productError) {
                    console.warn(`⚠️ Erro ao sincronizar produto ${product.id}:`, productError);
                }
            }

            console.log(`✅ SQLite: ${successCount}/${products.length} produtos sincronizados`);
            return successCount > 0;
        } catch (error) {
            console.error('❌ Erro ao empurrar para SQLite:', error);
            return false;
        }
    }

    // Puxar dados do SQLite
    pullFromSQLite(sqliteData) {
        try {
            const syncData = {
                products: sqliteData,
                lastUpdate: new Date().toISOString(),
                syncedFromSQLite: true,
                syncTimestamp: new Date().toISOString()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(syncData));
            
            // Disparar evento de atualização
            window.dispatchEvent(new CustomEvent('productsUpdated', { 
                detail: { source: 'sqliteSync', products: sqliteData }
            }));

            console.log(`✅ localStorage atualizado com ${sqliteData.length} produtos do SQLite`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao puxar do SQLite:', error);
            return false;
        }
    }

    // Puxar dados do servidor
    pullFromServer(serverData) {
        try {
            const syncData = {
                products: serverData.products,
                lastUpdate: new Date().toISOString(),
                syncedFromServer: true,
                syncTimestamp: new Date().toISOString()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(syncData));
            
            // Disparar evento de atualização
            window.dispatchEvent(new CustomEvent('productsUpdated', { 
                detail: { source: 'serverSync', products: serverData.products }
            }));

            console.log(`✅ localStorage atualizado com ${serverData.products.length} produtos do servidor`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao puxar do servidor:', error);
            return false;
        }
    }

    // Obter dados do localStorage
    getLocalStorageData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('❌ Erro ao obter dados do localStorage:', error);
            return {};
        }
    }

    // Verificar se dados locais são mais recentes
    isLocalDataNewer(localData, sqliteData) {
        if (!localData.lastUpdate) return false;
        if (!sqliteData.lastUpdate) return true;
        
        return new Date(localData.lastUpdate) > new Date(sqliteData.lastUpdate);
    }

    // Verificar se dados do servidor são mais recentes
    isServerDataNewer(localData, serverData) {
        if (!serverData.lastUpdate) return false;
        if (!localData.lastUpdate) return true;
        
        return new Date(serverData.lastUpdate) > new Date(localData.lastUpdate);
    }

    // Registrar log de sincronização
    logSync(syncResult) {
        try {
            const logs = this.getSyncLogs();
            logs.unshift(syncResult); // Adicionar no início
            
            // Manter apenas os últimos 50 logs
            if (logs.length > 50) {
                logs.splice(50);
            }
            
            localStorage.setItem(this.syncLogKey, JSON.stringify(logs));
        } catch (error) {
            console.error('❌ Erro ao registrar log:', error);
        }
    }

    // Obter logs de sincronização
    getSyncLogs() {
        try {
            const logs = localStorage.getItem(this.syncLogKey);
            return logs ? JSON.parse(logs) : [];
        } catch (error) {
            console.error('❌ Erro ao obter logs:', error);
            return [];
        }
    }

    // Forçar sincronização manual
    async forcSync() {
        console.log('🔄 Sincronização manual forçada...');
        return await this.performSync();
    }

    // Limpar logs de sincronização
    clearSyncLogs() {
        try {
            localStorage.removeItem(this.syncLogKey);
            console.log('✅ Logs de sincronização limpos');
            return true;
        } catch (error) {
            console.error('❌ Erro ao limpar logs:', error);
            return false;
        }
    }

    // Configurar intervalo de sincronização
    setSyncInterval(intervalMs) {
        this.syncInterval = intervalMs;
        
        if (this.autoSyncInterval) {
            this.stopAutoSync();
            this.initAutoSync();
        }
        
        console.log(`✅ Intervalo de sincronização definido para ${intervalMs}ms`);
    }

    // Habilitar/desabilitar sincronização automática
    setAutoSync(enabled) {
        this.isAutoSyncEnabled = enabled;
        
        if (enabled) {
            this.initAutoSync();
        } else {
            this.stopAutoSync();
        }
        
        console.log(`✅ Sincronização automática ${enabled ? 'habilitada' : 'desabilitada'}`);
    }

    // Obter status da sincronização
    getSyncStatus() {
        return {
            autoSyncEnabled: this.isAutoSyncEnabled,
            syncInterval: this.syncInterval,
            lastSync: this.getSyncLogs()[0]?.timestamp || null,
            sqliteAvailable: !!(window.sqliteManager && window.sqliteManager.db),
            recentLogs: this.getSyncLogs().slice(0, 5)
        };
    }
}

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
    window.SyncManager = SyncManager;
}
