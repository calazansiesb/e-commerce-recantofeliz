// Admin corrigido - salva direto no DynamoDB
console.log('🔧 Admin corrigido carregando...');

// Desabilitar download automático de imagens
window.baixarImagemPNG = function() {
    console.log('Download automático desabilitado');
};

// Função corrigida para salvar produto
window.salvarProduto = async function(event) {
    event.preventDefault();
    
    const id = document.getElementById('product-id').value || Date.now();
    const produtoData = {
        id: parseInt(id),
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        slogan: document.getElementById('product-slogan').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        active: true,
        image: `imagens/produtos/${id}.1.jpg`
    };
    
    try {
        console.log('💾 Salvando produto no DynamoDB...');
        
        // Salvar direto via API corrigida
        const response = await fetch('https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoData)
        });
        
        if (response.ok) {
            alert('✅ Produto salvo com sucesso!');
            await window.renderizarProdutosAdmin();
            window.closeProductModal();
        } else {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        alert('❌ Erro ao salvar produto: ' + error.message);
    }
};

// Carregar produtos do DynamoDB
window.renderizarProdutosAdmin = async function() {
    try {
        console.log('📦 Carregando produtos...');
        
        const response = await fetch('https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/produtos');
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        const produtos = data.products || [];
        
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;
        
        if (produtos.length === 0) {
            tbody.innerHTML = `
                <tr><td colspan="7" class="text-center py-8">
                    <p class="text-gray-500">Nenhum produto encontrado</p>
                </td></tr>
            `;
            return;
        }
        
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
                <td class="px-4 py-3 font-bold text-green-600">R$ ${produto.price.toFixed(2)}</td>
                <td class="px-4 py-3">${produto.stock}</td>
                <td class="px-4 py-3">
                    <button onclick="editarProduto(${produto.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="excluirProduto(${produto.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        console.log(`✅ ${produtos.length} produtos carregados`);
        
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        const tbody = document.getElementById('products-table-body');
        if (tbody) {
            tbody.innerHTML = `
                <tr><td colspan="7" class="text-center py-8 text-red-500">
                    <p>❌ Erro ao carregar produtos</p>
                    <p class="text-sm">${error.message}</p>
                    <button onclick="window.renderizarProdutosAdmin()" class="mt-2 bg-red-500 text-white px-4 py-2 rounded">
                        Tentar Novamente
                    </button>
                </td></tr>
            `;
        }
    }
};

// Desabilitar carregamento de categorias (usar lista fixa)
window.renderizarCategoriasAdmin = function() {
    console.log('📋 Usando categorias fixas');
    // Não fazer nada - usar categorias do HTML
};

console.log('✅ Admin corrigido carregado');