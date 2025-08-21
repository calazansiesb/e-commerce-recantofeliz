// Sistema Administrativo Simplificado - Granja Recanto Feliz
// Apenas funcionalidades essenciais: Produtos, Estoque e Backup

// Variáveis globais
let currentEditingProduct = null;
const LOW_STOCK_THRESHOLD = 10;

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando sistema administrativo simplificado...');
    
    // Garantir que o DataManager está disponível
    if (!window.dataManager) {
        window.dataManager = new DataManager();
    }
    
    // Carregar dados iniciais
    await loadProductsTable();
    loadEstoqueGrid();
    
    // Configurar formulário de produto
    setupProductForm();
    
    console.log('✅ Sistema administrativo inicializado');
});

// Navegação entre seções
function showSection(sectionName) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Atualizar botões de navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-700', 'bg-yellow-700', 'bg-purple-700');
        btn.classList.add('bg-blue-500', 'bg-yellow-500', 'bg-purple-500');
    });
    
    // Carregar conteúdo específico da seção
    switch(sectionName) {
        case 'produtos':
            loadProductsTable();
            break;
        case 'estoque':
            loadEstoqueGrid();
            break;
        case 'backup':
            // Seção de backup é estática
            break;
    }
}

// Carregar tabela de produtos
async function loadProductsTable() {
    const tableBody = document.getElementById('products-table-body');
    
    if (!tableBody) {
        console.error('❌ Elemento products-table-body não encontrado');
        return;
    }
    
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Carregando produtos...</td></tr>';
    
    try {
        // Carregar produtos do DataManager
        const products = await window.dataManager.getProducts();
        
        if (!products || products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-yellow-600">Nenhum produto encontrado</td></tr>';
            return;
        }
        
        // Limpar tabela
        tableBody.innerHTML = '';
        
        // Renderizar produtos
        products.forEach(product => {
            if (product.active === false) return;
            
            const row = document.createElement('tr');
            row.className = 'border-b hover:bg-gray-50';
            
            const stockClass = product.stock === 0 ? 'text-red-600 font-bold' : 
                              product.stock <= LOW_STOCK_THRESHOLD ? 'text-yellow-600 font-bold' : 
                              'text-green-600';
            
            row.innerHTML = `
                <td class="px-4 py-3">#${product.id}</td>
                <td class="px-4 py-3 font-medium">${product.name}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">${product.category}</span>
                </td>
                <td class="px-4 py-3 font-bold text-green-600">R$ ${product.price}</td>
                <td class="px-4 py-3 ${stockClass}">${product.stock}</td>
                <td class="px-4 py-3">
                    <div class="flex space-x-2">
                        <button onclick="editProduct(${product.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteProduct(${product.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        console.log(`✅ ${products.length} produtos carregados na tabela`);
        
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-red-600">Erro ao carregar produtos</td></tr>';
    }
}

// Carregar grid de estoque
async function loadEstoqueGrid() {
    const grid = document.getElementById('estoque-grid');
    
    if (!grid) return;
    
    try {
        const products = await window.dataManager.getProducts();
        
        if (!products || products.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center py-8 text-yellow-600">Nenhum produto encontrado</div>';
            return;
        }
        
        grid.innerHTML = '';
        
        products.forEach(product => {
            if (product.active === false) return;
            
            const stockLevel = product.stock === 0 ? 'Sem estoque' :
                              product.stock <= LOW_STOCK_THRESHOLD ? 'Estoque baixo' :
                              'Estoque normal';
            
            const stockColor = product.stock === 0 ? 'bg-red-100 border-red-500' :
                              product.stock <= LOW_STOCK_THRESHOLD ? 'bg-yellow-100 border-yellow-500' :
                              'bg-green-100 border-green-500';
            
            const card = document.createElement('div');
            card.className = `border rounded-lg p-4 ${stockColor}`;
            
            card.innerHTML = `
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-lg">${product.name}</h3>
                    <span class="text-2xl font-bold">${product.stock}</span>
                </div>
                <p class="text-gray-600 mb-4">${stockLevel}</p>
                <div class="flex space-x-2">
                    <button onclick="adjustStock(${product.id}, 'remove')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition flex-1">
                        <i class="fas fa-minus"></i> -1
                    </button>
                    <button onclick="adjustStock(${product.id}, 'add')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition flex-1">
                        <i class="fas fa-plus"></i> +1
                    </button>
                </div>
            `;
            
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('❌ Erro ao carregar estoque:', error);
        grid.innerHTML = '<div class="col-span-full text-center py-8 text-red-600">Erro ao carregar estoque</div>';
    }
}

// Ajustar estoque
async function adjustStock(productId, action) {
    try {
        const products = await window.dataManager.getProducts();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            alert('Produto não encontrado');
            return;
        }
        
        const newStock = action === 'add' ? product.stock + 1 : Math.max(0, product.stock - 1);
        
        await window.dataManager.updateProduct(productId, { stock: newStock });
        
        // Recarregar interfaces
        await loadProductsTable();
        loadEstoqueGrid();
        
        console.log(`✅ Estoque do produto ${productId} atualizado para ${newStock}`);
        
    } catch (error) {
        console.error('❌ Erro ao ajustar estoque:', error);
        alert('Erro ao ajustar estoque');
    }
}

// Modal de produto
function openProductModal() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').textContent = 'Novo Produto';
    document.getElementById('product-modal').classList.remove('hidden');
    currentEditingProduct = null;
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
    currentEditingProduct = null;
}

// Editar produto
async function editProduct(productId) {
    try {
        const products = await window.dataManager.getProducts();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            alert('Produto não encontrado');
            return;
        }
        
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-description').value = product.description || '';
        
        document.getElementById('modal-title').textContent = 'Editar Produto';
        document.getElementById('product-modal').classList.remove('hidden');
        
        currentEditingProduct = productId;
        
    } catch (error) {
        console.error('❌ Erro ao carregar produto para edição:', error);
        alert('Erro ao carregar produto');
    }
}

// Excluir produto
async function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }
    
    try {
        await window.dataManager.updateProduct(productId, { active: false });
        await loadProductsTable();
        loadEstoqueGrid();
        
        console.log(`✅ Produto ${productId} excluído`);
        
    } catch (error) {
        console.error('❌ Erro ao excluir produto:', error);
        alert('Erro ao excluir produto');
    }
}

// Configurar formulário de produto
function setupProductForm() {
    const form = document.getElementById('product-form');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const productData = {
                    name: document.getElementById('product-name').value,
                    category: document.getElementById('product-category').value,
                    price: parseFloat(document.getElementById('product-price').value),
                    stock: parseInt(document.getElementById('product-stock').value),
                    description: document.getElementById('product-description').value,
                    active: true
                };
                
                if (currentEditingProduct) {
                    // Editar produto existente
                    await window.dataManager.updateProduct(currentEditingProduct, productData);
                    console.log(`✅ Produto ${currentEditingProduct} atualizado`);
                } else {
                    // Criar novo produto
                    await window.dataManager.addProduct(productData);
                    console.log('✅ Novo produto criado');
                }
                
                closeProductModal();
                await loadProductsTable();
                loadEstoqueGrid();
                
            } catch (error) {
                console.error('❌ Erro ao salvar produto:', error);
                alert('Erro ao salvar produto');
            }
        });
    }
}

// Backup e restauração
async function exportData() {
    try {
        const products = await window.dataManager.getProducts();
        
        const backupData = {
            products: products,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup-granja-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        console.log('✅ Backup criado com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao criar backup:', error);
        alert('Erro ao criar backup');
    }
}

async function importData(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    if (!confirm('Esta operação substituirá todos os dados atuais. Continuar?')) {
        return;
    }
    
    try {
        const text = await file.text();
        const backupData = JSON.parse(text);
        
        if (!backupData.products || !Array.isArray(backupData.products)) {
            throw new Error('Formato de backup inválido');
        }
        
        // Restaurar produtos
        for (const product of backupData.products) {
            if (product.id) {
                await window.dataManager.updateProduct(product.id, product);
            } else {
                await window.dataManager.addProduct(product);
            }
        }
        
        await loadProductsTable();
        loadEstoqueGrid();
        
        alert('Backup restaurado com sucesso!');
        console.log('✅ Backup restaurado');
        
    } catch (error) {
        console.error('❌ Erro ao restaurar backup:', error);
        alert('Erro ao restaurar backup: ' + error.message);
    }
}

async function salvarProdutosDefinitivo() {
    if (!confirm('Esta operação salvará todas as alterações de forma permanente. Continuar?')) {
        return;
    }
    
    try {
        // Forçar salvamento no DataManager
        if (window.dataManager && window.dataManager.saveToServer) {
            await window.dataManager.saveToServer();
        }
        
        alert('Alterações salvas com sucesso!');
        console.log('✅ Alterações salvas definitivamente');
        
    } catch (error) {
        console.error('❌ Erro ao salvar alterações:', error);
        alert('Erro ao salvar alterações');
    }
}

// Tornar funções globais
window.showSection = showSection;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.adjustStock = adjustStock;
window.exportData = exportData;
window.importData = importData;
window.salvarProdutosDefinitivo = salvarProdutosDefinitivo;
