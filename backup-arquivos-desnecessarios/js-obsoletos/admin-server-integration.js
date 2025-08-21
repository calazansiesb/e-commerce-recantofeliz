// Integração Admin com Servidor Flask
// Implementa o salvamento via endpoint conforme roadmap

class AdminServerIntegration {
    constructor() {
        this.serverUrl = 'http://localhost:5000'; // Ajustar para produção
        this.adminToken = this.getAdminToken();
        this.fallbackToLocalStorage = true;
    }

    // Obter token do admin (pode ser prompt ou configuração)
    getAdminToken() {
        let token = localStorage.getItem('adminToken');
        if (!token) {
            // Não solicitar token automaticamente - usar apenas se servidor estiver rodando
            console.log('ℹ️ Token não configurado - usando apenas localStorage');
            return null;
        }
        return token;
    }

    // Salvar produtos no servidor
    async saveProductsToServer(products) {
        if (!this.adminToken) {
            console.warn('⚠️ Token não configurado, usando localStorage');
            return this.saveToLocalStorageFallback(products);
        }

        try {
            console.log('📤 Enviando produtos para servidor...');
            
            const response = await fetch(`${this.serverUrl}/admin/save-products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Token': this.adminToken
                },
                body: JSON.stringify({
                    products: products,
                    lastUpdate: new Date().toISOString(),
                    version: '2.0.1'
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Produtos salvos no servidor:', result);
                
                // Também salvar localmente para cache
                this.saveToLocalStorageFallback(products);
                
                return {
                    success: true,
                    backup: result.backup,
                    source: 'server'
                };
            } else {
                const error = await response.json();
                console.error('❌ Erro do servidor:', error);
                
                if (this.fallbackToLocalStorage) {
                    console.log('🔄 Usando fallback localStorage...');
                    return this.saveToLocalStorageFallback(products);
                }
                
                return { success: false, error: error.error };
            }

        } catch (networkError) {
            console.error('❌ Erro de rede:', networkError);
            
            if (this.fallbackToLocalStorage) {
                console.log('🔄 Servidor indisponível, usando localStorage...');
                return this.saveToLocalStorageFallback(products);
            }
            
            return { success: false, error: 'Servidor indisponível' };
        }
    }

    // Fallback para localStorage
    saveToLocalStorageFallback(products) {
        try {
            const data = {
                products: products,
                lastUpdate: new Date().toISOString(),
                source: 'localStorage-fallback'
            };
            
            localStorage.setItem('granjaRecantoFelizData', JSON.stringify(data));
            console.log('💾 Produtos salvos no localStorage (fallback)');
            
            return {
                success: true,
                source: 'localStorage',
                fallback: true
            };
        } catch (error) {
            console.error('❌ Erro no fallback localStorage:', error);
            return { success: false, error: 'Falha no fallback' };
        }
    }

    // Carregar produtos do servidor
    async loadProductsFromServer() {
        try {
            console.log('📥 Carregando produtos do servidor...');
            
            const response = await fetch(`${this.serverUrl}/src/data/produtos.json`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Produtos carregados do servidor:', data.products?.length);
                return data;
            } else {
                console.warn('⚠️ Arquivo não encontrado no servidor, usando localStorage');
                return this.loadFromLocalStorageFallback();
            }
            
        } catch (error) {
            console.warn('⚠️ Servidor indisponível, usando localStorage');
            return this.loadFromLocalStorageFallback();
        }
    }

    // Fallback para carregar do localStorage
    loadFromLocalStorageFallback() {
        try {
            const data = localStorage.getItem('granjaRecantoFelizData');
            if (data) {
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            console.error('❌ Erro ao carregar do localStorage:', error);
            return null;
        }
    }

    // Testar conexão com servidor
    async testServerConnection() {
        try {
            const response = await fetch(`${this.serverUrl}/admin/save-products`, {
                method: 'OPTIONS'
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // Configurar token
    setAdminToken(token) {
        this.adminToken = token;
        localStorage.setItem('adminToken', token);
    }

    // Limpar token
    clearAdminToken() {
        this.adminToken = null;
        localStorage.removeItem('adminToken');
    }
}

// Integrar com DataManager existente
if (window.dataManager) {
    const serverIntegration = new AdminServerIntegration();
    
    // Sobrescrever método saveProducts do DataManager
    const originalSaveProducts = window.dataManager.saveProducts;
    
    window.dataManager.saveProducts = async function(products) {
        console.log('🔄 Salvamento integrado servidor + localStorage...');
        
        // Tentar salvar no servidor primeiro
        const serverResult = await serverIntegration.saveProductsToServer(products);
        
        if (serverResult.success) {
            console.log('✅ Salvamento concluído:', serverResult.source);
            
            if (serverResult.backup) {
                console.log('📦 Backup criado:', serverResult.backup);
            }
            
            // Disparar evento de atualização
            window.dispatchEvent(new CustomEvent('productsUpdated', {
                detail: { 
                    products: products, 
                    source: serverResult.source,
                    backup: serverResult.backup
                }
            }));
            
            return true;
        } else {
            console.error('❌ Falha no salvamento:', serverResult.error);
            return false;
        }
    };
    
    // Método para carregar do servidor
    window.dataManager.loadFromServer = async function() {
        const data = await serverIntegration.loadProductsFromServer();
        if (data && data.products) {
            this.data = data;
            return data.products;
        }
        return this.getProducts(); // Fallback para método original
    };
    
    // Expor integração globalmente
    window.adminServerIntegration = serverIntegration;
    
    console.log('✅ Integração servidor-admin configurada');
}

// Função para testar integração
async function testServerIntegration() {
    if (!window.adminServerIntegration) {
        console.error('❌ Integração não configurada');
        return false;
    }
    
    console.log('🧪 Testando integração com servidor...');
    
    const connected = await window.adminServerIntegration.testServerConnection();
    console.log('Conexão:', connected ? '✅ OK' : '❌ Falhou');
    
    if (connected) {
        // Testar salvamento
        const testProducts = window.dataManager.getProducts();
        const result = await window.adminServerIntegration.saveProductsToServer(testProducts);
        console.log('Teste de salvamento:', result.success ? '✅ OK' : '❌ Falhou');
        
        return result.success;
    }
    
    return false;
}

// Tornar função global
window.testServerIntegration = testServerIntegration;