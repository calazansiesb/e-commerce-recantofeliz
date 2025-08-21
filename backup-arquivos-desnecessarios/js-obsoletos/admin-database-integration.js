/**
 * Script de Integração - DatabaseManager com Sistema Administrativo
 * 
 * Este script integra o novo DatabaseManager SQLite com o sistema administrativo
 * existente, garantindo compatibilidade e migração suave dos dados.
 */

// Variável global para o DatabaseManager
let dbManager = null;

/**
 * Inicialização do DatabaseManager
 */
async function initializeDatabaseManager() {
    console.log('🔄 Inicializando DatabaseManager...');
    
    try {
        // Criar instância do DatabaseManager
        dbManager = new DatabaseManager();
        
        // Aguardar inicialização
        await dbManager.init();
        
        console.log('✅ DatabaseManager inicializado com sucesso');
        
        // Verificar se há dados para migrar do localStorage
        await migrateFromLocalStorage();
        
        // Atualizar interface administrativa
        updateAdminInterface();
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao inicializar DatabaseManager:', error);
        return false;
    }
}

/**
 * Migração de dados do localStorage para SQLite
 */
async function migrateFromLocalStorage() {
    console.log('🔄 Verificando migração de dados...');
    
    try {
        // Verificar se há produtos no SQLite
        const sqliteProducts = await dbManager.getProducts();
        
        if (sqliteProducts.length > 0) {
            console.log(`✅ SQLite já contém ${sqliteProducts.length} produtos`);
            return;
        }
        
        // Verificar dados no localStorage
        const localData = localStorage.getItem('granjaRecantoFelizData');
        if (!localData) {
            console.log('ℹ️ Nenhum dado no localStorage para migrar');
            return;
        }
        
        const parsedData = JSON.parse(localData);
        const localProducts = parsedData.products || [];
        
        if (localProducts.length === 0) {
            console.log('ℹ️ Nenhum produto no localStorage para migrar');
            return;
        }
        
        console.log(`🔄 Migrando ${localProducts.length} produtos do localStorage...`);
        
        // Migrar cada produto
        let migratedCount = 0;
        for (const product of localProducts) {
            try {
                // Converter formato se necessário
                const sqliteProduct = convertProductForSQLite(product);
                await dbManager.addProduct(sqliteProduct);
                migratedCount++;
            } catch (error) {
                console.error(`❌ Erro ao migrar produto ${product.name}:`, error);
            }
        }
        
        console.log(`✅ ${migratedCount} produtos migrados com sucesso`);
        
        // Backup dos dados antigos
        localStorage.setItem('granjaRecantoFelizData_backup', localData);
        console.log('💾 Backup dos dados antigos criado');
        
    } catch (error) {
        console.error('❌ Erro durante migração:', error);
    }
}

/**
 * Converte produto do formato localStorage para SQLite
 */
function convertProductForSQLite(localProduct) {
    return {
        name: localProduct.name || '',
        category: localProduct.category || 'outros',
        price: parseFloat(localProduct.price) || 0.00,
        stock: parseInt(localProduct.stock) || 0,
        description: localProduct.description || '',
        slogan: localProduct.slogan || '',
        image: localProduct.image || '',
        images: localProduct.images ? JSON.stringify(localProduct.images) : '[]',
        active: localProduct.active !== false,
        partner_name: localProduct.partner?.name || null,
        partner_producer: localProduct.partner?.producer || null,
        partner_location: localProduct.partner?.location || null,
        partner_description: localProduct.partner?.description || null
    };
}

/**
 * Converte produto do SQLite para o formato esperado pelo admin
 */
function convertProductFromSQLite(sqliteProduct) {
    const product = {
        id: sqliteProduct.id,
        name: sqliteProduct.name,
        category: sqliteProduct.category,
        price: parseFloat(sqliteProduct.price),
        stock: parseInt(sqliteProduct.stock),
        description: sqliteProduct.description,
        slogan: sqliteProduct.slogan,
        image: sqliteProduct.image,
        images: sqliteProduct.images ? JSON.parse(sqliteProduct.images) : [],
        active: sqliteProduct.active
    };
    
    // Adicionar informações do parceiro se existir
    if (sqliteProduct.partner_name) {
        product.partner = {
            name: sqliteProduct.partner_name,
            producer: sqliteProduct.partner_producer,
            location: sqliteProduct.partner_location,
            description: sqliteProduct.partner_description
        };
    }
    
    return product;
}

/**
 * Atualiza a interface administrativa para usar o DatabaseManager
 */
function updateAdminInterface() {
    console.log('🔄 Atualizando interface administrativa...');
    
    // Substituir window.sqliteManager por dbManager
    window.sqliteManager = {
        db: true, // Flag para indicar que está inicializado
        
        // Métodos para compatibilidade
        getProducts: async () => {
            const sqliteProducts = await dbManager.getProducts();
            return sqliteProducts.map(convertProductFromSQLite);
        },
        
        addProduct: async (product) => {
            const sqliteProduct = convertProductForSQLite(product);
            return await dbManager.addProduct(sqliteProduct);
        },
        
        updateProduct: async (id, product) => {
            const sqliteProduct = convertProductForSQLite(product);
            return await dbManager.updateProduct(id, sqliteProduct);
        },
        
        deleteProduct: async (id) => {
            return await dbManager.deleteProduct(id);
        },
        
        getProduct: async (id) => {
            const sqliteProduct = await dbManager.getProduct(id);
            return sqliteProduct ? convertProductFromSQLite(sqliteProduct) : null;
        }
    };
    
    // Atualizar DataManager para usar SQLite como fonte primária
    if (window.dataManager) {
        const originalGetProducts = window.dataManager.getProducts;
        
        window.dataManager.getProducts = function() {
            // Se SQLite estiver disponível, usar ele
            if (dbManager && dbManager.isInitialized) {
                return window.sqliteManager.getProducts();
            }
            // Senão, usar o método original
            return originalGetProducts.call(this);
        };
    }
    
    console.log('✅ Interface administrativa atualizada');
}

/**
 * Função para recarregar dados e interface
 */
async function refreshAdminData() {
    if (!dbManager || !dbManager.isInitialized) {
        console.warn('⚠️ DatabaseManager não inicializado');
        return;
    }
    
    try {
        // Recarregar tabela de produtos se existir
        if (typeof loadProductsTable === 'function') {
            await loadProductsTable();
        }
        
        // Recarregar estatísticas se existir
        if (typeof updateDashboardStats === 'function') {
            await updateDashboardStats();
        }
        
        // Recarregar estoque se existir
        if (typeof loadEstoqueGrid === 'function') {
            await loadEstoqueGrid();
        }
        
        console.log('✅ Dados administrativos recarregados');
    } catch (error) {
        console.error('❌ Erro ao recarregar dados:', error);
    }
}

/**
 * Função para diagnóstico do sistema
 */
async function diagnosticDatabase() {
    console.log('🔍 === DIAGNÓSTICO DO SISTEMA ===');
    
    // Verificar DatabaseManager
    console.log('DatabaseManager:', dbManager ? '✅ Criado' : '❌ Não criado');
    if (dbManager) {
        console.log('Inicializado:', dbManager.isInitialized ? '✅ Sim' : '❌ Não');
        
        if (dbManager.isInitialized) {
            try {
                const products = await dbManager.getProducts();
                console.log(`Produtos no SQLite: ${products.length}`);
                
                const stats = await dbManager.getStatistics();
                console.log('Estatísticas:', stats);
            } catch (error) {
                console.error('Erro ao obter dados:', error);
            }
        }
    }
    
    // Verificar localStorage
    const localData = localStorage.getItem('granjaRecantoFelizData');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            console.log(`Produtos no localStorage: ${parsed.products?.length || 0}`);
        } catch (error) {
            console.error('Erro ao analisar localStorage:', error);
        }
    } else {
        console.log('LocalStorage: Vazio');
    }
    
    // Verificar compatibilidade
    console.log('window.sqliteManager:', window.sqliteManager ? '✅ Presente' : '❌ Ausente');
    console.log('window.dataManager:', window.dataManager ? '✅ Presente' : '❌ Ausente');
    
    console.log('🔍 === FIM DO DIAGNÓSTICO ===');
}

/**
 * Inicialização automática quando o script carrega
 */
document.addEventListener('DOMContentLoaded', async function() {
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(async () => {
        console.log('🚀 Iniciando integração DatabaseManager...');
        
        // Verificar se DatabaseManager está disponível
        if (typeof DatabaseManager === 'undefined') {
            console.error('❌ DatabaseManager não encontrado! Certifique-se de que database-manager.js foi carregado.');
            return;
        }
        
        // Inicializar
        const success = await initializeDatabaseManager();
        
        if (success) {
            console.log('✅ Integração DatabaseManager concluída com sucesso');
            
            // Disparar evento para atualizar interface
            window.dispatchEvent(new CustomEvent('databaseManagerReady'));
        } else {
            console.error('❌ Falha na integração DatabaseManager');
        }
    }, 1000); // 1 segundo de delay
});

// Exportar funções para uso global
window.dbManager = null; // Será definido após inicialização
window.refreshAdminData = refreshAdminData;
window.diagnosticDatabase = diagnosticDatabase;
window.initializeDatabaseManager = initializeDatabaseManager;
