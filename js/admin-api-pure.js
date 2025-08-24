
// Admin API - Apenas DynamoDB
window.renderizarProdutosAdmin = async function() {
    try {
        const data = await window.granjaAPI.getProdutos();
        const produtos = data.products || [];
        const tbody = document.getElementById('products-table-body');
        
        if (!tbody) return;
        
        tbody.innerHTML = produtos.map(produto => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">${produto.id}</td>
                <td class="px-4 py-3">
                    <img src="${produto.image}" alt="${produto.name}" class="w-12 h-12 object-cover rounded" onerror="this.src='imagens/produtos/default/placeholder.png'">
                </td>
                <td class="px-4 py-3 font-medium">${produto.name}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">${produto.category}</span>
                </td>
                <td class="px-4 py-3">R$ ${produto.price.toFixed(2)}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 ${produto.stock > 10 ? 'bg-green-100 text-green-800' : produto.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} rounded-full text-xs">
                        ${produto.stock || 0}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <div class="flex space-x-2">
                        <button onclick="editarProduto(${produto.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deletarProduto(${produto.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        console.log(`${produtos.length} produtos renderizados no admin`);
        
    } catch (error) {
        console.error('Erro ao carregar produtos no admin:', error);
        alert('Erro ao carregar produtos. Verifique a API.');
    }
};

window.editarProduto = async function(id) {
    try {
        const produto = await window.granjaAPI.getProduto(id);
        // TODO: Abrir modal de edição
        console.log('Editando produto:', produto);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        alert('Erro ao carregar produto para edição.');
    }
};

window.deletarProduto = async function(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    
    try {
        await window.granjaAPI.deleteProduto(id);
        alert('Produto deletado com sucesso!');
        window.renderizarProdutosAdmin();
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao deletar produto.');
    }
};

// Auto-carregar produtos no admin
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.renderizarProdutosAdmin) {
            window.renderizarProdutosAdmin();
        }
    }, 1000);
});
