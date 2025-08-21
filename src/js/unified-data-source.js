// Script para garantir fonte de dados única em todo o sistema
console.log('🔧 Inicializando fonte de dados única...');

(async function initializeUnifiedDataSource() {
    try {
        // 1. Verificar se há dados em cache e se estão atualizados
        const cacheKey = 'granjaRecantoFelizData';
        const cacheData = localStorage.getItem(cacheKey);
        let needsUpdate = true;
        
        if (cacheData) {
            try {
                const parsed = JSON.parse(cacheData);
                // Verificar se os dados têm a marca de sincronização forçada
                if (parsed.forceSync && parsed.syncedFromServer) {
                    console.log('✅ Cache já sincronizado com produtos.json');
                    needsUpdate = false;
                }
            } catch (e) {
                console.log('⚠️ Cache corrompido, forçando atualização');
            }
        }
        
        // 2. Se necessário, carregar dados do arquivo JSON
        if (needsUpdate) {
            console.log('🔄 Carregando dados atualizados do produtos.json...');
            
            try {
                const response = await fetch('data/produtos.json', { 
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                
                if (response.ok) {
                    const jsonData = await response.json();
                    
                    // Validar estrutura dos dados
                    if (jsonData.products && Array.isArray(jsonData.products)) {
                        const syncData = {
                            products: jsonData.products,
                            lastUpdate: new Date().toISOString(),
                            syncedFromServer: true,
                            forceSync: true,
                            version: jsonData.version || '1.0'
                        };
                        
                        localStorage.setItem(cacheKey, JSON.stringify(syncData));
                        console.log(`✅ ${jsonData.products.length} produtos sincronizados`);
                        
                        // Verificar alguns produtos para confirmar preços
                        const firstProduct = jsonData.products[0];
                        if (firstProduct) {
                            console.log(`📊 Primeiro produto: ${firstProduct.name} - R$ ${firstProduct.price}`);
                        }
                        
                        return jsonData.products;
                    } else {
                        throw new Error('Formato inválido no arquivo produtos.json');
                    }
                } else {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
            } catch (fetchError) {
                console.error('❌ Erro ao carregar produtos.json:', fetchError);
                
                // Fallback: usar dados padrão se disponível
                if (window.DataManager) {
                    const manager = new DataManager();
                    console.log('🔄 Usando dados padrão como fallback');
                    return manager.defaultProducts;
                }
            }
        } else {
            // Retornar dados do cache
            const parsed = JSON.parse(cacheData);
            console.log(`✅ Usando dados do cache: ${parsed.products.length} produtos`);
            return parsed.products;
        }
    } catch (error) {
        console.error('❌ Erro na inicialização da fonte de dados:', error);
        return [];
    }
})();

// Função global para verificar consistência de dados
window.verifyDataConsistency = async function() {
    try {
        const localData = localStorage.getItem('granjaRecantoFelizData');
        const response = await fetch('data/produtos.json', { cache: 'no-store' });
        
        if (response.ok) {
            const jsonData = await response.json();
            
            console.log('🔍 VERIFICAÇÃO DE CONSISTÊNCIA:');
            console.log('Cache:', localData ? JSON.parse(localData).products?.length : 'vazio');
            console.log('JSON:', jsonData.products?.length);
            
            if (localData) {
                const cacheProducts = JSON.parse(localData).products;
                const firstCacheProduct = cacheProducts[0];
                const firstJsonProduct = jsonData.products[0];
                
                console.log('Preço no cache:', firstCacheProduct?.price);
                console.log('Preço no JSON:', firstJsonProduct?.price);
                
                if (firstCacheProduct?.price !== firstJsonProduct?.price) {
                    console.warn('⚠️ INCONSISTÊNCIA DETECTADA! Preços diferentes entre cache e JSON');
                    return false;
                }
            }
            
            console.log('✅ Dados consistentes');
            return true;
        }
    } catch (error) {
        console.error('❌ Erro na verificação:', error);
        return false;
    }
};

// Disponibilizar globalmente
window.unifiedDataSource = {
    initialized: true,
    timestamp: new Date().toISOString()
};
