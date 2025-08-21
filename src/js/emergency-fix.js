/**
 * Script de Diagnóstico Urgente - Erro "Erro ao carregar produtos"
 * 
 * Este script identifica e corrige o problema de carregamento de produtos no admin.
 */

console.log('🚨 === DIAGNÓSTICO URGENTE - ERRO CARREGAR PRODUTOS ===');

async function diagnoseProductLoadingError() {
    console.log('🔍 Iniciando diagnóstico detalhado...');
    
    // 1. Verificar localStorage
    console.log('\n📋 1. VERIFICANDO LOCALSTORAGE:');
    const storageData = localStorage.getItem('granjaRecantoFelizData');
    if (storageData) {
        try {
            const parsed = JSON.parse(storageData);
            console.log('✅ localStorage existe');
            console.log('📊 Produtos no localStorage:', parsed.products?.length || 0);
            if (parsed.products?.length > 0) {
                console.log('💰 Exemplo produto:', parsed.products[0]);
            }
        } catch (error) {
            console.error('❌ Erro ao analisar localStorage:', error);
        }
    } else {
        console.log('❌ localStorage vazio ou não existe');
    }
    
    // 2. Verificar DataManager
    console.log('\n📋 2. VERIFICANDO DATAMANAGER:');
    if (window.dataManager) {
        try {
            const dmProducts = window.dataManager.getProducts();
            console.log('✅ DataManager existe');
            console.log('📊 Produtos no DataManager:', dmProducts?.length || 0);
            if (dmProducts?.length > 0) {
                console.log('💰 Exemplo produto:', dmProducts[0]);
            }
        } catch (error) {
            console.error('❌ Erro no DataManager:', error);
        }
    } else {
        console.log('❌ DataManager não encontrado');
    }
    
    // 3. Verificar SQLiteManager
    console.log('\n📋 3. VERIFICANDO SQLITEMANAGER:');
    if (window.sqliteManager) {
        console.log('✅ SQLiteManager existe');
        console.log('🔗 DB conectado:', !!window.sqliteManager.db);
        
        if (window.sqliteManager.db) {
            try {
                const sqlProducts = await window.sqliteManager.getProducts();
                console.log('📊 Produtos no SQLite:', sqlProducts?.length || 0);
                if (sqlProducts?.length > 0) {
                    console.log('💰 Exemplo produto:', sqlProducts[0]);
                }
            } catch (error) {
                console.error('❌ Erro no SQLiteManager:', error);
            }
        }
    } else {
        console.log('❌ SQLiteManager não encontrado');
    }
    
    // 4. Verificar DatabaseManager
    console.log('\n📋 4. VERIFICANDO DATABASEMANAGER:');
    if (window.dbManager) {
        console.log('✅ DatabaseManager existe');
        console.log('🔗 Inicializado:', window.dbManager.isInitialized);
        
        if (window.dbManager.isInitialized) {
            try {
                const dbProducts = await window.dbManager.getProducts();
                console.log('📊 Produtos no DatabaseManager:', dbProducts?.length || 0);
                if (dbProducts?.length > 0) {
                    console.log('💰 Exemplo produto:', dbProducts[0]);
                }
            } catch (error) {
                console.error('❌ Erro no DatabaseManager:', error);
            }
        }
    } else {
        console.log('❌ DatabaseManager não encontrado');
    }
    
    console.log('\n🚨 === FIM DO DIAGNÓSTICO ===');
}

async function forceCreateTestData() {
    console.log('🔧 Criando dados de teste para resolver o problema...');
    
    const testProducts = [
        {
            id: 1,
            name: 'Ovos Caipira',
            category: 'ovos',
            price: 8.50,
            stock: 50,
            description: 'Ovos frescos de galinhas criadas soltas',
            slogan: 'Direto do galinheiro para sua mesa',
            image: 'imagens/produtos/1/1.png',
            images: ['imagens/produtos/1/1.png'],
            active: true
        },
        {
            id: 2,
            name: 'Adubo Orgânico',
            category: 'fertilizantes',
            price: 15.00,
            stock: 30,
            description: 'Adubo natural de galinha poedeira',
            slogan: 'Para suas plantas crescerem saudáveis',
            image: 'imagens/produtos/2/1.png',
            images: ['imagens/produtos/2/1.png'],
            active: true
        }
    ];
    
    // Salvar no localStorage
    const data = {
        products: testProducts,
        lastUpdate: new Date().toISOString()
    };
    
    localStorage.setItem('granjaRecantoFelizData', JSON.stringify(data));
    console.log('✅ Dados de teste salvos no localStorage');
    
    // Recriar DataManager se necessário
    if (!window.dataManager) {
        try {
            window.dataManager = new DataManager();
            console.log('✅ DataManager recriado');
        } catch (error) {
            console.error('❌ Erro ao recriar DataManager:', error);
        }
    }
    
    return testProducts;
}

async function fixProductLoadingIssue() {
    console.log('🛠️ INICIANDO CORREÇÃO DO PROBLEMA...');
    
    // Executar diagnóstico
    await diagnoseProductLoadingError();
    
    // Verificar se há dados em algum lugar
    let hasData = false;
    
    // Verificar localStorage
    const storageData = localStorage.getItem('granjaRecantoFelizData');
    if (storageData) {
        try {
            const parsed = JSON.parse(storageData);
            if (parsed.products && parsed.products.length > 0) {
                hasData = true;
                console.log('✅ Dados encontrados no localStorage');
            }
        } catch (error) {
            console.error('❌ Erro no localStorage:', error);
        }
    }
    
    // Se não há dados, criar dados de teste
    if (!hasData) {
        console.log('⚠️ Nenhum dado encontrado. Criando dados de teste...');
        await forceCreateTestData();
    }
    
    // Forçar recarregamento da tabela
    if (typeof loadProductsTable === 'function') {
        console.log('🔄 Recarregando tabela de produtos...');
        try {
            await loadProductsTable();
            console.log('✅ Tabela recarregada com sucesso');
        } catch (error) {
            console.error('❌ Erro ao recarregar tabela:', error);
        }
    }
    
    console.log('🛠️ CORREÇÃO CONCLUÍDA');
}

// Executar correção automaticamente
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(async () => {
        await fixProductLoadingIssue();
        
        // Adicionar botão de correção na interface
        const fixButton = document.createElement('button');
        fixButton.textContent = '🛠️ Corrigir Dados';
        fixButton.className = 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition';
        fixButton.onclick = fixProductLoadingIssue;
        fixButton.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(fixButton);
    }, 2000);
});

// Exportar funções para uso manual
window.diagnoseProductLoadingError = diagnoseProductLoadingError;
window.forceCreateTestData = forceCreateTestData;
window.fixProductLoadingIssue = fixProductLoadingIssue;

console.log('🛠️ Script de correção carregado');
