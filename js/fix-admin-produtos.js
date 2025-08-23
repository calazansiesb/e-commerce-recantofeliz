// Admin simples para gerenciar produtos
console.log('🔧 Carregando admin simples...');

let produtos = [];

// Carregar produtos do JSON
async function carregarProdutos() {
    try {
        const response = await fetch('dados/produtos.json', { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            produtos = data.products || [];
            console.log(`✅ ${produtos.length} produtos carregados`);
            return produtos;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
    }
    return [];
}

// Renderizar produtos na tabela admin
async function renderizarProdutosAdmin() {
    await carregarProdutos();
    
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = produtos.map(produto => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">${produto.id}</td>
            <td class="px-4 py-3">
                <img src="${produto.image}" alt="${produto.name}" class="w-16 h-16 object-cover rounded" onerror="this.src='imagens/produtos/default/placeholder.png'">
            </td>
            <td class="px-4 py-3 font-medium">${produto.name}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">${produto.category}</span>
            </td>
            <td class="px-4 py-3 font-bold text-green-600">R$ ${produto.price.toFixed(2)}</td>
            <td class="px-4 py-3">${produto.stock}</td>
            <td class="px-4 py-3">
                <button onclick="editarProduto(${produto.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="excluirProduto(${produto.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        </tr>
    `).join('');
}

// Funções básicas do admin
function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) {
        alert('Produto não encontrado!');
        return;
    }
    
    // Preencher modal com dados do produto
    document.getElementById('product-id').value = produto.id;
    document.getElementById('product-name').value = produto.name;
    document.getElementById('product-category').value = produto.category;
    document.getElementById('product-slogan').value = produto.slogan;
    document.getElementById('product-description').value = produto.description;
    document.getElementById('product-price').value = produto.price;
    document.getElementById('product-stock').value = produto.stock;
    
    // Mostrar imagem atual no preview
    const imagePreview = document.getElementById('image-preview');
    if (produto.image) {
        imagePreview.innerHTML = `
            <div class="relative">
                <img src="${produto.image}" alt="${produto.name}" class="w-32 h-32 object-cover rounded border-2 border-blue-500" onerror="this.src='imagens/produtos/default/placeholder.png'">
                <div class="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl">Atual</div>
            </div>
        `;
    }
    
    document.getElementById('modal-title').textContent = `Editar Produto: ${produto.name}`;
    document.getElementById('product-modal').classList.remove('hidden');
}

function excluirProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        produtos = produtos.filter(p => p.id !== id);
        renderizarProdutosAdmin();
        alert('Produto excluído!');
    }
}

function openProductModal() {
    // Limpar formulário
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').textContent = 'Novo Produto';
    
    // Limpar preview de imagem
    document.getElementById('image-preview').innerHTML = '';
    
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// Salvar produto (novo ou editado)
function salvarProduto(event) {
    event.preventDefault();
    
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
    
    // Verificar se há imagem selecionada
    const imagePreview = document.querySelector('#image-preview img');
    if (imagePreview && imagePreview.src && !imagePreview.src.includes('placeholder')) {
        produtoData.image = imagePreview.src;
    }
    
    if (id) {
        // Editar produto existente
        const index = produtos.findIndex(p => p.id == id);
        if (index !== -1) {
            produtos[index] = { ...produtos[index], ...produtoData };
            alert('Produto atualizado!');
        }
    } else {
        // Novo produto
        const novoId = Math.max(...produtos.map(p => p.id), 0) + 1;
        produtos.push({
            id: novoId,
            image: produtoData.image || `imagens/produtos/${novoId}.1.png`,
            ...produtoData
        });
        alert('Produto adicionado!');
    }
    
    renderizarProdutosAdmin();
    closeProductModal();
}

// Função para preview de imagem
function setupImagePreview() {
    const imageInput = document.getElementById('product-images');
    const imagePreview = document.getElementById('image-preview');
    
    if (imageInput) {
        imageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `
                        <div class="relative">
                            <img src="${e.target.result}" alt="Preview" class="w-32 h-32 object-cover rounded border-2 border-green-500">
                            <div class="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl">Principal</div>
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function salvarProdutosDefinitivo() {
    const data = {
        products: produtos,
        lastUpdate: new Date().toISOString(),
        version: '1.0'
    };
    
    // Salvar no localStorage
    localStorage.setItem('granjaRecantoFelizData', JSON.stringify(data));
    
    // Download do JSON atualizado
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'produtos.json';
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Produtos salvos! Arquivo JSON baixado. Substitua o arquivo dados/produtos.json pelo arquivo baixado.');
}

function exportData() {
    const data = {
        products: produtos,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-produtos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Backup exportado com sucesso!');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.products) {
                produtos = data.products;
                renderizarProdutosAdmin();
                alert('Dados importados com sucesso!');
            }
        } catch (error) {
            alert('Erro ao importar dados: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Tornar funções globais
window.renderizarProdutosAdmin = renderizarProdutosAdmin;
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.salvarProduto = salvarProduto;
window.setupImagePreview = setupImagePreview;
window.salvarProdutosDefinitivo = salvarProdutosDefinitivo;
window.exportData = exportData;
window.importData = importData;

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderizarProdutosAdmin();
        // Adicionar evento ao formulário
        document.getElementById('product-form').addEventListener('submit', salvarProduto);
        // Setup preview de imagem
        setupImagePreview();
    });
} else {
    renderizarProdutosAdmin();
    // Adicionar evento ao formulário
    document.getElementById('product-form').addEventListener('submit', salvarProduto);
    // Setup preview de imagem
    setupImagePreview();
}

console.log('✅ Admin simples carregado');