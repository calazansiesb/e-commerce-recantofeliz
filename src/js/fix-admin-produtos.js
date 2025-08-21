// Correção mínima para exibir produtos no admin
console.log('🔧 Carregando produtos no admin...');

let produtos = [];

function renderizarProdutosAdmin() {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = produtos.map(p => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">${p.id}</td>
            <td class="px-4 py-3">
                <img src="${p.image}" alt="${p.name}" class="w-16 h-16 object-cover rounded">
            </td>
            <td class="px-4 py-3 font-medium">${p.name}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${p.category}</span>
            </td>
            <td class="px-4 py-3 font-bold text-green-600">R$ ${p.price.toFixed(2)}</td>
            <td class="px-4 py-3">${p.stock}</td>
            <td class="px-4 py-3">
                <div class="flex space-x-2">
                    <button onclick="editarProduto(${p.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="excluirProduto(${p.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    console.log(`✅ ${produtos.length} produtos exibidos no admin`);
}

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    document.getElementById('product-id').value = produto.id;
    document.getElementById('product-name').value = produto.name;
    document.getElementById('product-category').value = produto.category;
    document.getElementById('product-slogan').value = produto.slogan;
    document.getElementById('product-description').value = produto.description || '';
    document.getElementById('product-price').value = produto.price;
    document.getElementById('product-stock').value = produto.stock;
    
    document.getElementById('modal-title').textContent = 'Editar Produto';
    document.getElementById('product-modal').classList.remove('hidden');
}

function excluirProduto(id) {
    if (confirm(`Excluir produto ${id}?`)) {
        const index = produtos.findIndex(p => p.id === id);
        if (index > -1) {
            produtos.splice(index, 1);
            renderizarProdutosAdmin();
            alert('Produto excluído!');
        }
    }
}

function openProductModal() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').textContent = 'Novo Produto';
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// Salvar produto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('product-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = document.getElementById('product-id').value;
            const produtoData = {
                name: document.getElementById('product-name').value,
                category: document.getElementById('product-category').value,
                slogan: document.getElementById('product-slogan').value,
                description: document.getElementById('product-description').value,
                price: parseFloat(document.getElementById('product-price').value),
                stock: parseInt(document.getElementById('product-stock').value),
                active: true
            };
            
            if (id) {
                // Editar produto existente
                const produto = produtos.find(p => p.id == id);
                if (produto) {
                    Object.assign(produto, produtoData);
                    alert('Produto atualizado!');
                }
            } else {
                // Novo produto
                const novoId = Math.max(...produtos.map(p => p.id)) + 1;
                produtos.push({
                    id: novoId,
                    image: `imagens/produtos/${novoId}/1.png`,
                    ...produtoData
                });
                alert('Produto adicionado!');
            }
            
            renderizarProdutosAdmin();
            closeProductModal();
        });
    }
});

function salvarProdutosDefinitivo() {
    const dadosParaSalvar = {
        products: produtos,
        lastUpdate: new Date().toISOString(),
        version: "1.0"
    };
    
    const dataStr = JSON.stringify(dadosParaSalvar, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'produtos.json';
    
    const instrucoes = `Para tornar as alterações DEFINITIVAS:

1. Um arquivo 'produtos.json' será baixado
2. Substitua o arquivo em 'src/data/produtos.json'
3. As alterações ficarão permanentes

Baixar arquivo agora?`;
    
    if (confirm(instrucoes)) {
        link.click();
        alert('✅ Arquivo baixado! Substitua o arquivo em src/data/produtos.json');
    }
}

// Carregar produtos do arquivo JSON
async function carregarProdutosDoArquivo() {
    try {
        const response = await fetch('data/produtos.json', { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            if (data.products && data.products.length > 0) {
                produtos.splice(0, produtos.length, ...data.products);
                console.log(`✅ ${data.products.length} produtos carregados do arquivo JSON`);
                renderizarProdutosAdmin();
            }
        } else {
            console.error('❌ Erro ao carregar produtos.json:', response.status);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar produtos.json:', error);
    }
}

// Executar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarProdutosDoArquivo);
} else {
    carregarProdutosDoArquivo();
}

// Tornar funções globais
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.salvarProdutosDefinitivo = salvarProdutosDefinitivo;