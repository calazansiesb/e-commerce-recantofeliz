// Admin que usa APENAS DynamoDB
console.log('🗄️ Admin DynamoDB puro...');

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
        console.log('💾 Salvando no DynamoDB via API...');
        
        if (document.getElementById('product-id').value) {
            // Atualizar produto existente
            await window.granjaAPI.updateProduto(id, produtoData);
            alert('✅ Produto atualizado!');
        } else {
            // Criar novo produto
            await window.granjaAPI.createProduto(produtoData);
            alert('✅ Produto criado!');
        }
        
        // Recarregar lista
        await window.renderizarProdutosAdmin();
        window.closeProductModal();
        
        // Baixar imagens se houver
        if (window.currentProductImages && window.currentProductImages.length > 0) {
            setTimeout(() => {
                window.currentProductImages.forEach((imageData, index) => {
                    window.baixarImagemPNG(imageData, `${id}.${index + 1}.png`);
                });
                alert(`📸 ${window.currentProductImages.length} imagens baixadas! Faça upload manual para S3.`);
            }, 500);
        }
        
    } catch (error) {
        console.error('❌ Erro:', error);
        alert('❌ Erro ao salvar: ' + error.message + '\n\nVerifique se a API está funcionando.');
    }
};

// Carregar produtos do DynamoDB
window.renderizarProdutosAdmin = async function() {
    try {
        console.log('📦 Carregando produtos do DynamoDB...');
        const data = await window.granjaAPI.getProdutos();
        const produtos = data.products || [];
        
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;
        
        if (produtos.length === 0) {
            tbody.innerHTML = `
                <tr><td colspan="7" class="text-center py-8">
                    <p class="text-gray-500">Nenhum produto no DynamoDB</p>
                    <button onclick="window.granjaAPI.getProdutos()" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                        Tentar Novamente
                    </button>
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
        
        console.log(`✅ ${produtos.length} produtos renderizados`);
        
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        const tbody = document.getElementById('products-table-body');
        if (tbody) {
            tbody.innerHTML = `
                <tr><td colspan="7" class="text-center py-8 text-red-500">
                    <p>❌ Erro ao carregar produtos do DynamoDB</p>
                    <p class="text-sm">${error.message}</p>
                    <button onclick="window.renderizarProdutosAdmin()" class="mt-2 bg-red-500 text-white px-4 py-2 rounded">
                        Tentar Novamente
                    </button>
                </td></tr>
            `;
        }
    }
};

console.log('✅ Admin DynamoDB puro carregado');