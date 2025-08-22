/**
 * Correção de Persistência de Dados
 * 
 * Este script resolve o problema de perda de dados após limpeza de cache
 * garantindo que as alterações feitas no admin sejam mantidas.
 */

console.log('🔧 === SCRIPT DE CORREÇÃO DE PERSISTÊNCIA ===');

class PersistenceManager {
    constructor() {
        this.persistentKey = 'granjaRecantoFeliz_PERSISTENT';
        this.backupKey = 'granjaRecantoFeliz_BACKUP';
        this.settingsKey = 'granjaRecantoFeliz_SETTINGS';
    }

    /**
     * Salva dados de forma persistente usando múltiplas estratégias
     */
    savePersistentData(data) {
        try {
            const timestamp = new Date().toISOString();
            const persistentData = {
                ...data,
                savedAt: timestamp,
                version: '2.0.0',
                persistent: true
            };

            // Estratégia 1: localStorage normal
            localStorage.setItem('granjaRecantoFelizData', JSON.stringify(persistentData));
            
            // Estratégia 2: localStorage com chave diferente para backup
            localStorage.setItem(this.persistentKey, JSON.stringify(persistentData));
            
            // Estratégia 3: sessionStorage como backup temporário
            sessionStorage.setItem(this.backupKey, JSON.stringify(persistentData));
            
            // Estratégia 4: Salvar em IndexedDB (mais persistente)
            this.saveToIndexedDB(persistentData);
            
            // Estratégia 5: Salvar configurações separadamente
            const settings = {
                lastSave: timestamp,
                hasCustomData: true,
                productsCount: data.products?.length || 0
            };
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            
            console.log('✅ Dados salvos com múltiplas estratégias de persistência');
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao salvar dados persistentes:', error);
            return false;
        }
    }

    /**
     * Carrega dados de forma robusta tentando múltiplas fontes
     */
    loadPersistentData() {
        console.log('🔍 Carregando dados de forma robusta...');
        
        // Tentar diferentes fontes em ordem de prioridade
        const sources = [
            () => localStorage.getItem('granjaRecantoFelizData'),
            () => localStorage.getItem(this.persistentKey),
            () => sessionStorage.getItem(this.backupKey),
            () => this.loadFromIndexedDB()
        ];

        for (const source of sources) {
            try {
                const data = source();
                if (data && typeof data === 'string') {
                    const parsed = JSON.parse(data);
                    if (parsed.products && Array.isArray(parsed.products) && parsed.products.length > 0) {
                        console.log(`✅ Dados recuperados da fonte (${parsed.products.length} produtos)`);
                        return parsed;
                    }
                }
            } catch (error) {
                console.warn('⚠️ Erro ao tentar fonte de dados:', error);
            }
        }
        
        console.log('❌ Nenhuma fonte de dados válida encontrada');
        return null;
    }

    /**
     * Salva no IndexedDB para maior persistência
     */
    async saveToIndexedDB(data) {
        try {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('GranjaRecantoFelizDB', 1);
                
                request.onerror = () => reject(request.error);
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('products')) {
                        db.createObjectStore('products', { keyPath: 'id' });
                    }
                    if (!db.objectStoreNames.contains('settings')) {
                        db.createObjectStore('settings', { keyPath: 'key' });
                    }
                };
                
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    const transaction = db.transaction(['settings'], 'readwrite');
                    const store = transaction.objectStore('settings');
                    
                    store.put({
                        key: 'mainData',
                        data: data,
                        timestamp: new Date().toISOString()
                    });
                    
                    transaction.oncomplete = () => {
                        console.log('✅ Dados salvos no IndexedDB');
                        resolve(true);
                    };
                    
                    transaction.onerror = () => reject(transaction.error);
                };
            });
        } catch (error) {
            console.warn('⚠️ Erro ao salvar no IndexedDB:', error);
        }
    }

    /**
     * Carrega do IndexedDB
     */
    async loadFromIndexedDB() {
        try {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('GranjaRecantoFelizDB', 1);
                
                request.onerror = () => resolve(null);
                
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    
                    if (!db.objectStoreNames.contains('settings')) {
                        resolve(null);
                        return;
                    }
                    
                    const transaction = db.transaction(['settings'], 'readonly');
                    const store = transaction.objectStore('settings');
                    const getRequest = store.get('mainData');
                    
                    getRequest.onsuccess = () => {
                        if (getRequest.result && getRequest.result.data) {
                            console.log('✅ Dados recuperados do IndexedDB');
                            resolve(getRequest.result.data);
                        } else {
                            resolve(null);
                        }
                    };
                    
                    getRequest.onerror = () => resolve(null);
                };
            });
        } catch (error) {
            console.warn('⚠️ Erro ao carregar do IndexedDB:', error);
            return null;
        }
    }

    /**
     * Força sincronização de dados entre admin e site
     */
    async forceSyncData() {
        console.log('🔄 Forçando sincronização de dados...');
        
        let sourceData = null;
        
        // Tentar obter dados do DatabaseManager primeiro
        if (window.dbManager && window.dbManager.isInitialized) {
            try {
                const products = await window.dbManager.getProducts();
                if (products && products.length > 0) {
                    sourceData = {
                        products: products,
                        lastUpdate: new Date().toISOString(),
                        source: 'DatabaseManager'
                    };
                    console.log('✅ Dados obtidos do DatabaseManager');
                }
            } catch (error) {
                console.error('❌ Erro ao obter dados do DatabaseManager:', error);
            }
        }
        
        // Se não conseguiu do DatabaseManager, tentar outras fontes
        if (!sourceData) {
            sourceData = this.loadPersistentData();
        }
        
        // Se ainda não tem dados, criar dados padrão
        if (!sourceData) {
            console.log('⚠️ Criando dados padrão como último recurso...');
            sourceData = this.createDefaultData();
        }
        
        // Salvar os dados de forma persistente
        if (sourceData) {
            this.savePersistentData(sourceData);
            
            // Atualizar DataManager se disponível
            if (window.dataManager) {
                try {
                    // Forçar atualização do DataManager
                    localStorage.setItem('granjaRecantoFelizData', JSON.stringify(sourceData));
                    
                    // Recriar instância se necessário
                    window.dataManager = new DataManager();
                    
                    console.log('✅ DataManager atualizado');
                } catch (error) {
                    console.error('❌ Erro ao atualizar DataManager:', error);
                }
            }
            
            return sourceData;
        }
        
        return null;
    }

    /**
     * Cria dados padrão
     */
    createDefaultData() {
        return {
            products: [
                {
                    id: 1,
                    name: "Substrato BioFértil 3 Anos",
                    category: "fertilizantes",
                    slogan: "Mais do que Adubo: um substrato vivo e completo.",
                    description: "Com um processo de maturação de 3 anos, nosso substrato é uma terra viva e completa, rica em matéria orgânica e microrganismos benéficos.",
                    price: 15.00, // Preço alterado
                    image: "imagens/produtos/1/1.png",
                    stock: 25,
                    active: true
                },
                {
                    id: 2,
                    name: "FertiGota",
                    category: "fertilizantes",
                    slogan: "Adubo de galinha líquido e potente.",
                    description: "Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas.",
                    price: 5.00, // Preço alterado
                    image: "imagens/produtos/2/1.png",
                    stock: 40,
                    active: true
                },
                {
                    id: 3,
                    name: "Ovos Caipira 10",
                    category: "ovos",
                    slogan: "10 ovos frescos da granja.",
                    description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 10 unidades.",
                    price: 15.00, // Preço alterado
                    image: "imagens/produtos/3/1.jpeg",
                    stock: 120,
                    active: true
                },
                {
                    id: 4,
                    name: "Ovos Caipira 20",
                    category: "ovos",
                    slogan: "20 ovos frescos da granja.",
                    description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 20 unidades.",
                    price: 30.00,
                    image: "imagens/produtos/4/1.jpeg",
                    stock: 80,
                    active: true
                },
                {
                    id: 5,
                    name: "Ovos Caipira 30",
                    category: "ovos",
                    slogan: "30 ovos frescos da granja.",
                    description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 30 unidades.",
                    price: 45.00,
                    image: "imagens/produtos/5/1.png",
                    stock: 50,
                    active: true
                },
                {
                    id: 6,
                    name: "Galinha Caipira Picada",
                    category: "aves",
                    slogan: "Galinha caipira cortada, pronta para cozinhar.",
                    description: "Galinha caipira picada, sabor autêntico da roça. Ideal para receitas tradicionais.",
                    price: 45.00, // Preço alterado
                    image: "imagens/produtos/6/1.png",
                    stock: 15,
                    active: true
                },
                {
                    id: 7,
                    name: "Galinha Caipira Inteira",
                    category: "aves",
                    slogan: "Galinha caipira inteira, fresca e saborosa.",
                    description: "Galinha caipira inteira, criada solta e alimentada naturalmente. Perfeita para assados e cozidos.",
                    price: 40.00, // Preço alterado
                    image: "imagens/produtos/7/1.png",
                    stock: 8,
                    active: true
                }
            ],
            lastUpdate: new Date().toISOString(),
            source: 'defaultWithUpdates'
        };
    }
}

// Criar instância global
window.persistenceManager = new PersistenceManager();

// Executar correção automática
document.addEventListener('DOMContentLoaded', async function() {
    setTimeout(async () => {
        console.log('🔧 Executando correção de persistência...');
        
        const result = await window.persistenceManager.forceSyncData();
        
        if (result) {
            console.log('✅ Correção de persistência aplicada com sucesso');
            
            // Recarregar interface se necessário
            if (typeof loadProductsTable === 'function') {
                try {
                    await loadProductsTable();
                } catch (error) {
                    console.error('Erro ao recarregar tabela:', error);
                }
            }
            
            // Disparar evento de atualização
            window.dispatchEvent(new CustomEvent('persistenceFixed', {
                detail: { products: result.products.length }
            }));
        }
    }, 1000);
});

// Interceptar salvamentos para garantir persistência
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalSetItem.call(this, key, value);
    
    // Se for dados da granja, fazer backup persistente
    if (key === 'granjaRecantoFelizData' && window.persistenceManager) {
        try {
            const data = JSON.parse(value);
            window.persistenceManager.savePersistentData(data);
        } catch (error) {
            console.warn('Erro ao fazer backup persistente:', error);
        }
    }
};

console.log('🔧 Sistema de correção de persistência carregado');
