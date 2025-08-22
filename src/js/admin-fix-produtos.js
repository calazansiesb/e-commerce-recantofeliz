// Correção específica para problema de listagem de produtos no admin
console.log('🔧 CORREÇÃO ESPECÍFICA - Produtos não listando');

// Aguardar carregamento completo
setTimeout(() => {
    console.log('\n=== CORREÇÃO AUTOMÁTICA ===');
    
    // 1. Verificar e criar DataManager se necessário
    if (typeof window.dataManager === 'undefined') {
        console.log('📦 Criando DataManager...');
        window.dataManager = new DataManager();
    }
    
    // 2. Forçar inicialização com produtos padrão
    console.log('🔄 Forçando inicialização dos produtos...');
    window.dataManager.forceInitializeWithDefaults();
    
    // 3. Verificar produtos
    const produtos = window.dataManager.getProducts();
    console.log(`✅ ${produtos.length} produtos carregados`);
    
    // 4. Verificar se função loadProductsTable existe e executar
    if (typeof loadProductsTable === 'function') {
        console.log('🔄 Recarregando tabela de produtos...');
        loadProductsTable();
        console.log('✅ Tabela recarregada');
    } else {
        console.log('⚠️ Função loadProductsTable não encontrada, criando carregamento manual...');
        
        // Carregamento manual da tabela
        const tbody = document.getElementById('products-table-body');
        if (tbody && produtos.length > 0) {
            tbody.innerHTML = '';
            
            produtos.forEach((produto, index) => {
                const row = document.createElement('tr');
                row.className = 'border-b hover:bg-gray-50';
                row.innerHTML = `
                    <td class="px-6 py-4">
                        <img src="${produto.images?.[0] || 'imagens/placeholder.jpg'}" 
                             alt="${produto.name}" 
                             class="w-16 h-16 object-cover rounded">
                    </td>
                    <td class="px-6 py-4 font-medium">${produto.name}</td>
                    <td class="px-6 py-4">R$ ${produto.price?.toFixed(2) || '0.00'}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs rounded ${produto.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${produto.active !== false ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                    <td class="px-6 py-4">${produto.stock || 0}</td>
                    <td class="px-6 py-4">
                        <button onclick="editProduct(${produto.id})" 
                                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2">
                            Editar
                        </button>
                        <button onclick="toggleProductStatus(${produto.id})" 
                                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2">
                            ${produto.active !== false ? 'Desativar' : 'Ativar'}
                        </button>
                        <button onclick="deleteProduct(${produto.id})" 
                                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                            Excluir
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            console.log(`✅ Tabela carregada manualmente com ${produtos.length} produtos`);
        } else {
            console.log('❌ Elemento tbody não encontrado ou sem produtos');
        }
    }
    
    // 5. Atualizar estatísticas se existir a função
    if (typeof updateDashboardStats === 'function') {
        updateDashboardStats();
        console.log('📊 Estatísticas atualizadas');
    }
    
}, 2000); // 2 segundos para garantir carregamento

// Adicionar função global para recarregar produtos manualmente
window.recarregarProdutos = function() {
    console.log('🔄 Recarregamento manual solicitado...');
    
    if (window.dataManager) {
        window.dataManager.forceInitializeWithDefaults();
        const produtos = window.dataManager.getProducts();
        console.log(`📦 ${produtos.length} produtos recarregados`);
        
        if (typeof loadProductsTable === 'function') {
            loadProductsTable();
        }
        
        return produtos.length;
    }
    
    return 0;
};

console.log('💡 Para recarregar manualmente, execute: recarregarProdutos()');
