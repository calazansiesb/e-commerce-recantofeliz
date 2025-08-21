/**
 * Script de Teste - Diagnóstico de Edição de Produtos
 * 
 * Este script testa especificamente a funcionalidade de edição de produtos
 * para identificar e corrigir o erro "Erro ao carregar dados do produto!"
 */

console.log('🔍 === TESTE DE EDIÇÃO DE PRODUTOS ===');

function testProductEdit() {
    console.log('🚀 Iniciando teste de edição...');
    
    // 1. Verificar disponibilidade de fontes de dados
    console.log('📊 Verificando fontes de dados:');
    console.log('- window.dataManager:', !!window.dataManager);
    console.log('- window.sqliteManager:', !!window.sqliteManager);
    console.log('- window.dbManager:', !!window.dbManager);
    
    // 2. Tentar obter produtos de cada fonte
    let products = [];
    
    // Teste SQLiteManager
    if (window.sqliteManager && window.sqliteManager.db) {
        try {
            console.log('🔍 Testando SQLiteManager...');
            const sqliteProducts = window.sqliteManager.getProducts();
            if (sqliteProducts && Array.isArray(sqliteProducts)) {
                products = sqliteProducts;
                console.log('✅ SQLiteManager OK:', products.length, 'produtos');
            }
        } catch (error) {
            console.error('❌ Erro no SQLiteManager:', error);
        }
    }
    
    // Teste DataManager se SQLite falhou
    if (products.length === 0 && window.dataManager) {
        try {
            console.log('🔍 Testando DataManager...');
            const dataProducts = window.dataManager.getProducts();
            if (dataProducts && Array.isArray(dataProducts)) {
                products = dataProducts;
                console.log('✅ DataManager OK:', products.length, 'produtos');
            }
        } catch (error) {
            console.error('❌ Erro no DataManager:', error);
        }
    }
    
    // Teste localStorage direto se ambos falharam
    if (products.length === 0) {
        try {
            console.log('🔍 Testando localStorage direto...');
            const storageData = localStorage.getItem('granjaRecantoFelizData');
            if (storageData) {
                const parsed = JSON.parse(storageData);
                if (parsed.products && Array.isArray(parsed.products)) {
                    products = parsed.products;
                    console.log('✅ localStorage OK:', products.length, 'produtos');
                }
            }
        } catch (error) {
            console.error('❌ Erro no localStorage:', error);
        }
    }
    
    // 3. Verificar estrutura dos produtos
    if (products.length > 0) {
        console.log('📋 Estrutura do primeiro produto:');
        const firstProduct = products[0];
        console.log('- ID:', firstProduct.id, typeof firstProduct.id);
        console.log('- Nome:', firstProduct.name);
        console.log('- Preço:', firstProduct.price);
        console.log('- Categoria:', firstProduct.category);
        console.log('- Ativo:', firstProduct.active);
        
        // Listar todos os IDs disponíveis
        console.log('📋 IDs disponíveis:', products.map(p => p.id));
        
        // 4. Testar função editProduct com o primeiro produto
        if (typeof window.editProduct === 'function') {
            console.log('🧪 Testando editProduct com ID:', firstProduct.id);
            try {
                window.editProduct(firstProduct.id);
                console.log('✅ editProduct executou sem erro');
            } catch (error) {
                console.error('❌ Erro em editProduct:', error);
            }
        } else {
            console.error('❌ Função editProduct não encontrada');
        }
    } else {
        console.error('❌ Nenhum produto encontrado em nenhuma fonte');
    }
    
    console.log('🔍 === FIM DO TESTE ===');
}

// Aguardar tudo carregar e executar teste
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        testProductEdit();
        
        // Adicionar botão de teste na interface
        const testButton = document.createElement('button');
        testButton.textContent = '🧪 Teste de Edição';
        testButton.className = 'bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition';
        testButton.onclick = testProductEdit;
        testButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(testButton);
    }, 3000);
});

console.log('🧪 Script de teste carregado');
