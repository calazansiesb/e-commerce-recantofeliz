// Debug simples para identificar o problema da listagem de produtos
console.log('🔧 Iniciando debug simples da listagem de produtos...');

// Aguardar um momento para garantir que tudo está carregado
setTimeout(() => {
    console.log('\n=== DIAGNÓSTICO SIMPLES ===');
    
    // 1. Verificar se DataManager existe
    console.log('1. DataManager disponível:', typeof window.dataManager !== 'undefined');
    
    if (typeof window.dataManager === 'undefined') {
        console.log('💡 Criando DataManager...');
        try {
            window.dataManager = new DataManager();
            console.log('✅ DataManager criado');
        } catch (error) {
            console.error('❌ Erro ao criar DataManager:', error);
            return;
        }
    }
    
    // 2. Verificar produtos no DataManager
    try {
        const produtos = window.dataManager.getProducts();
        console.log('2. Produtos encontrados:', produtos.length);
        
        if (produtos.length === 0) {
            console.log('⚠️ Nenhum produto encontrado, forçando inicialização...');
            window.dataManager.forceInitializeWithDefaults();
            const novosProducts = window.dataManager.getProducts();
            console.log('✨ Após inicialização forçada:', novosProducts.length, 'produtos');
        }
        
        // 3. Verificar se a tabela existe
        const tabela = document.getElementById('products-table-body');
        console.log('3. Tabela existe:', !!tabela);
        
        if (tabela) {
            console.log('4. Conteúdo atual da tabela:', tabela.innerHTML.length, 'caracteres');
            
            // 5. Forçar carregamento da tabela
            console.log('5. 🔄 Forçando recarregamento da tabela...');
            if (typeof loadProductsTable === 'function') {
                loadProductsTable();
                console.log('✅ loadProductsTable() executada');
            } else {
                console.log('❌ Função loadProductsTable não encontrada');
            }
        }
        
    } catch (error) {
        console.error('❌ Erro durante diagnóstico:', error);
    }
    
}, 3000); // Aguardar 3 segundos para garantir carregamento completo
