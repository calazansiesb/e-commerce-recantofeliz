// Sistema de Administração - Granja Recanto Feliz
// Este arquivo gerencia toda a funcionalidade administrativa

// Configurações gerais
const LOW_STOCK_THRESHOLD = 10;
let currentEditingProduct = null;

// Inicialização quando o DOM carrega
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar o data manager carregar
    if (typeof window.dataManager === 'undefined') {
        console.error('Data Manager não carregado. Verifique se data-manager.js está incluído.');
        return;
    }
    
    showSection('produtos');
    loadProductsTable();
    updateDashboardStats();
    
    // Event listeners
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
    document.getElementById('product-images').addEventListener('change', handleImagePreview);
    
    // Escutar mudanças nos dados
    window.addEventListener('productsUpdated', function(event) {
        loadProductsTable();
        loadEstoqueGrid();
        updateDashboardStats();
    });
});

// Navegação entre seções
function showSection(sectionName) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar seção selecionada
    document.getElementById(sectionName + '-section').classList.remove('hidden');
    
    // Atualizar botões de navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-700', 'bg-yellow-700', 'bg-pink-700', 'bg-purple-700');
        btn.classList.add('bg-blue-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500');
    });
    
    // Carregar conteúdo específico da seção
    switch(sectionName) {
        case 'produtos':
            loadProductsTable();
            break;
        case 'estoque':
            loadEstoqueGrid();
            break;
        case 'layouts':
            loadLayoutsGrid();
            updateCurrentLayoutStatus();
            break;
        case 'relatorios':
            updateDashboardStats();
            break;
    }
    
    // Atualizar botão ativo
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(sectionName) || 
            (sectionName === 'layouts' && btn.textContent.includes('Layouts'))) {
            const colorMap = {
                produtos: 'bg-blue-700',
                estoque: 'bg-yellow-700', 
                layouts: 'bg-pink-700',
                relatorios: 'bg-purple-700'
            };
            btn.classList.remove('bg-blue-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500');
            btn.classList.add(colorMap[sectionName] || 'bg-blue-700');
        }
    });
}

// Carregar tabela de produtos
function loadProductsTable() {
    const tableBody = document.getElementById('products-table-body');
    tableBody.innerHTML = '';
    
    const adminProducts = window.dataManager.getProducts();
    
    adminProducts.forEach(product => {
        if (product.active === false) return; // Não mostrar produtos inativos
        
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        
        const stockClass = product.stock === 0 ? 'text-red-600 font-bold' : 
                          product.stock <= LOW_STOCK_THRESHOLD ? 'text-yellow-600 font-bold' : 
                          'text-green-600';
        
        row.innerHTML = `
            <td class="px-4 py-3">#${product.id}</td>
            <td class="px-4 py-3">
                <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded-lg">
            </td>
            <td class="px-4 py-3 font-semibold">${product.name}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    ${product.category}
                </span>
            </td>
            <td class="px-4 py-3 font-bold text-green-600">R$ ${product.price.toFixed(2)}</td>
            <td class="px-4 py-3 ${stockClass}">${product.stock} un.</td>
            <td class="px-4 py-3">
                <div class="flex space-x-2">
                    <button onclick="editProduct(${product.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="adjustStock(${product.id})" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition">
                        <i class="fas fa-warehouse"></i>
                    </button>
                    <button onclick="deleteProduct(${product.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Carregar grid de estoque
function loadEstoqueGrid() {
    const estoqueGrid = document.getElementById('estoque-grid');
    estoqueGrid.innerHTML = '';
    
    const adminProducts = window.dataManager.getActiveProducts();
    
    adminProducts.forEach(product => {
        const stockLevel = product.stock === 0 ? 'Sem estoque' : 
                          product.stock <= LOW_STOCK_THRESHOLD ? 'Estoque baixo' : 
                          'Normal';
        
        const stockColor = product.stock === 0 ? 'bg-red-500' : 
                          product.stock <= LOW_STOCK_THRESHOLD ? 'bg-yellow-500' : 
                          'bg-green-500';
        
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-6 border-l-4 ' + stockColor;
        
        card.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-lg">${product.name}</h3>
                <span class="text-2xl font-bold ${stockColor.replace('bg-', 'text-')}">${product.stock}</span>
            </div>
            <p class="text-gray-600 mb-4">${stockLevel}</p>
            <div class="flex space-x-2">
                <button onclick="adjustStock(${product.id}, 'add')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded transition flex-1">
                    <i class="fas fa-plus mr-1"></i>Adicionar
                </button>
                <button onclick="adjustStock(${product.id}, 'remove')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition flex-1">
                    <i class="fas fa-minus mr-1"></i>Remover
                </button>
            </div>
        `;
        
        estoqueGrid.appendChild(card);
    });
}

// Atualizar estatísticas do dashboard
function updateDashboardStats() {
    const stats = window.dataManager.getStats();
    
    document.getElementById('total-produtos').textContent = stats.totalProducts;
    document.getElementById('valor-total').textContent = `R$ ${stats.totalValue.toFixed(2)}`;
    document.getElementById('estoque-baixo').textContent = stats.lowStock;
    document.getElementById('sem-estoque').textContent = stats.outOfStock;
}

// Modal de produtos
function openProductModal(productId = null) {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    if (productId) {
        // Editar produto existente
        const product = window.dataManager.getProducts().find(p => p.id === productId);
        if (product) {
            modalTitle.textContent = 'Editar Produto';
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-slogan').value = product.slogan;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-stock').value = product.stock;
            currentEditingProduct = product;
        }
    } else {
        // Novo produto
        modalTitle.textContent = 'Novo Produto';
        form.reset();
        document.getElementById('product-id').value = '';
        document.getElementById('image-preview').innerHTML = '';
        currentEditingProduct = null;
    }
    
    modal.classList.remove('hidden');
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.add('hidden');
    currentEditingProduct = null;
}

// Manipular envio do formulário
function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        slogan: document.getElementById('product-slogan').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        image: currentEditingProduct ? currentEditingProduct.image : 'imagens/produtos/placeholder.jpg'
    };
    
    const productId = document.getElementById('product-id').value;
    
    if (productId) {
        // Atualizar produto existente
        if (window.dataManager.updateProduct(parseInt(productId), productData)) {
            showNotification('Produto atualizado com sucesso!', 'success');
        } else {
            showNotification('Erro ao atualizar produto!', 'error');
        }
    } else {
        // Adicionar novo produto
        if (window.dataManager.addProduct(productData)) {
            showNotification('Produto adicionado com sucesso!', 'success');
        } else {
            showNotification('Erro ao adicionar produto!', 'error');
        }
    }
    
    closeProductModal();
}

// Preview de imagens
function handleImagePreview(e) {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    
    Array.from(e.target.files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'w-20 h-20 object-cover rounded-lg border';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Funções de ação
function editProduct(productId) {
    openProductModal(productId);
}

function adjustStock(productId, action = null) {
    if (action === 'add') {
        const amount = prompt('Quantidade a adicionar:', '1');
        if (amount && !isNaN(amount)) {
            window.dataManager.adjustStock(productId, parseInt(amount));
            showNotification(`Adicionados ${amount} itens ao estoque`, 'success');
        }
    } else if (action === 'remove') {
        const amount = prompt('Quantidade a remover:', '1');
        if (amount && !isNaN(amount)) {
            window.dataManager.adjustStock(productId, -parseInt(amount));
            showNotification(`Removidos ${amount} itens do estoque`, 'success');
        }
    } else {
        const product = window.dataManager.getProducts().find(p => p.id === productId);
        if (product) {
            const newStock = prompt(`Estoque atual: ${product.stock}\nNovo estoque:`, product.stock);
            if (newStock !== null && !isNaN(newStock)) {
                window.dataManager.updateStock(productId, parseInt(newStock));
                showNotification(`Estoque atualizado para ${newStock}`, 'success');
            }
        }
    }
}

function deleteProduct(productId) {
    const product = window.dataManager.getProducts().find(p => p.id === productId);
    if (!product) return;
    
    if (confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
        if (window.dataManager.deleteProduct(productId)) {
            showNotification(`Produto "${product.name}" excluído com sucesso!`, 'success');
        } else {
            showNotification('Erro ao excluir produto!', 'error');
        }
    }
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Funções de backup e restauração
function exportData() {
    const data = window.dataManager.exportData();
    if (data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `granja-recanto-feliz-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Backup realizado com sucesso!', 'success');
    } else {
        showNotification('Erro ao criar backup!', 'error');
    }
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            if (window.dataManager.importData(backupData)) {
                showNotification('Dados restaurados com sucesso!', 'success');
                // Reset do input file
                event.target.value = '';
            } else {
                showNotification('Erro ao restaurar dados!', 'error');
            }
        } catch (error) {
            showNotification('Arquivo de backup inválido!', 'error');
        }
    };
    reader.readAsText(file);
}

// =============== FUNÇÕES DE LAYOUTS TEMÁTICOS ===============

// Carregar layouts na interface
function loadLayoutsGrid() {
    const layouts = window.dataManager.getLayouts();
    const currentLayout = window.dataManager.getCurrentLayout();
    const layoutsGrid = document.getElementById('layouts-grid');
    
    layoutsGrid.innerHTML = '';
    
    Object.entries(layouts).forEach(([key, layout]) => {
        const isActive = currentLayout.theme === layout.theme;
        const isAutoActive = key !== 'default' && layout.active && 
                           window.dataManager.isDateInRange(
                               new Date().toISOString().substr(5, 5), 
                               layout.dateStart, 
                               layout.dateEnd
                           );
        
        const card = document.createElement('div');
        card.className = `border rounded-lg p-4 ${isActive ? 'border-green-500 bg-green-50' : 'border-gray-200'}`;
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h4 class="font-bold text-lg">${layout.name}</h4>
                ${isActive ? '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">ATIVO</span>' : ''}
                ${isAutoActive ? '<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">AUTO</span>' : ''}
            </div>
            
            ${key !== 'default' ? `
                <div class="text-sm text-gray-600 mb-3">
                    <i class="fas fa-calendar mr-1"></i>
                    ${layout.dateStart} até ${layout.dateEnd}
                </div>
            ` : ''}
            
            <div class="flex space-x-2 mb-3">
                <div class="w-6 h-6 rounded" style="background-color: ${layout.colors.primary}"></div>
                <div class="w-6 h-6 rounded" style="background-color: ${layout.colors.secondary}"></div>
                <div class="w-6 h-6 rounded" style="background-color: ${layout.colors.accent}"></div>
                <div class="w-6 h-6 rounded" style="background-color: ${layout.colors.background}"></div>
            </div>
            
            <div class="text-sm text-gray-600 mb-4 truncate">
                "${layout.bannerText}"
            </div>
            
            <div class="flex space-x-2">
                ${!isActive ? `
                    <button onclick="activateLayout('${key}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                        <i class="fas fa-play mr-1"></i>Ativar
                    </button>
                ` : ''}
                
                ${key !== 'default' ? `
                    <button onclick="editLayout('${key}')" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition">
                        <i class="fas fa-edit mr-1"></i>Editar
                    </button>
                    <button onclick="toggleLayoutAuto('${key}')" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition">
                        <i class="fas fa-clock mr-1"></i>${layout.active ? 'Manual' : 'Auto'}
                    </button>
                ` : ''}
            </div>
        `;
        
        layoutsGrid.appendChild(card);
    });
}

// Atualizar status do layout atual
function updateCurrentLayoutStatus() {
    const currentLayout = window.dataManager.getCurrentLayout();
    const statusInfo = document.getElementById('current-layout-info');
    
    const today = new Date();
    const dateStr = today.toLocaleDateString('pt-BR');
    
    statusInfo.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <strong>Layout Ativo:</strong> ${currentLayout.name}<br>
                <strong>Tema:</strong> ${currentLayout.theme}<br>
                <strong>Data:</strong> ${dateStr}
            </div>
            <div>
                <strong>Cores:</strong>
                <div class="flex space-x-1 mt-1">
                    <div class="w-4 h-4 rounded" style="background-color: ${currentLayout.colors.primary}" title="Primária"></div>
                    <div class="w-4 h-4 rounded" style="background-color: ${currentLayout.colors.secondary}" title="Secundária"></div>
                    <div class="w-4 h-4 rounded" style="background-color: ${currentLayout.colors.accent}" title="Destaque"></div>
                    <div class="w-4 h-4 rounded" style="background-color: ${currentLayout.colors.background}" title="Fundo"></div>
                </div>
            </div>
        </div>
    `;
}

// Ativar layout específico
function activateLayout(layoutKey) {
    if (window.dataManager.activateLayout(layoutKey)) {
        showNotification(`Layout "${layoutKey}" ativado com sucesso!`, 'success');
        loadLayoutsGrid();
        updateCurrentLayoutStatus();
        
        // Aplicar no site principal se estiver aberto
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
                type: 'layoutChanged',
                layout: window.dataManager.getCurrentLayout()
            }, '*');
        }
    } else {
        showNotification('Erro ao ativar layout!', 'error');
    }
}

// Ativar layout padrão
function activateDefaultLayout() {
    if (window.dataManager.activateDefaultLayout()) {
        showNotification('Layout padrão ativado!', 'success');
        loadLayoutsGrid();
        updateCurrentLayoutStatus();
        
        // Aplicar no site principal se estiver aberto
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
                type: 'layoutChanged',
                layout: window.dataManager.getCurrentLayout()
            }, '*');
        }
    } else {
        showNotification('Erro ao ativar layout padrão!', 'error');
    }
}

// Verificar layouts automáticos
function checkAutoLayouts() {
    const currentLayout = window.dataManager.getCurrentLayout();
    const layouts = window.dataManager.getLayouts();
    
    const today = new Date();
    const currentDate = String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(today.getDate()).padStart(2, '0');
    
    let foundAutoLayout = false;
    
    // Verificar se há algum layout automático para hoje
    for (const [key, layout] of Object.entries(layouts)) {
        if (key !== 'default' && layout.active && layout.dateStart && layout.dateEnd) {
            if (window.dataManager.isDateInRange(currentDate, layout.dateStart, layout.dateEnd)) {
                foundAutoLayout = true;
                if (currentLayout.theme !== layout.theme) {
                    activateLayout(key);
                    showNotification(`Layout automático "${layout.name}" foi ativado para a data atual!`, 'info');
                    return;
                }
            }
        }
    }
    
    if (!foundAutoLayout) {
        showNotification('Nenhum layout automático configurado para hoje.', 'info');
    } else {
        showNotification('Layout automático já está ativo!', 'success');
    }
}

// Alternar modo automático do layout
function toggleLayoutAuto(layoutKey) {
    const layouts = window.dataManager.getLayouts();
    const layout = layouts[layoutKey];
    
    if (layout) {
        layout.active = !layout.active;
        
        if (window.dataManager.saveLayouts(layouts)) {
            const status = layout.active ? 'ativado' : 'desativado';
            showNotification(`Modo automático ${status} para "${layout.name}"!`, 'success');
            loadLayoutsGrid();
            
            // Se foi ativado, verificar se deve aplicar agora
            if (layout.active) {
                checkAutoLayouts();
            }
        } else {
            showNotification('Erro ao alterar configuração!', 'error');
        }
    }
}

// Aplicar layout personalizado
function applyCustomLayout() {
    const customLayout = {
        name: "Layout Personalizado",
        colors: {
            primary: document.getElementById('custom-primary').value,
            secondary: document.getElementById('custom-secondary').value,
            accent: document.getElementById('custom-accent').value,
            background: document.getElementById('custom-background').value
        },
        bannerText: document.getElementById('custom-banner-text').value,
        bannerImage: document.getElementById('custom-banner-image').value,
        theme: "custom",
        active: true
    };
    
    const layouts = window.dataManager.getLayouts();
    layouts.custom = customLayout;
    
    if (window.dataManager.saveLayouts(layouts)) {
        activateLayout('custom');
        showNotification('Layout personalizado aplicado!', 'success');
    } else {
        showNotification('Erro ao aplicar layout personalizado!', 'error');
    }
}

// Visualizar layout personalizado
function previewCustomLayout() {
    const customColors = {
        primary: document.getElementById('custom-primary').value,
        secondary: document.getElementById('custom-secondary').value,
        accent: document.getElementById('custom-accent').value,
        background: document.getElementById('custom-background').value
    };
    
    // Aplicar temporariamente
    const root = document.documentElement;
    root.style.setProperty('--primary-color', customColors.primary);
    root.style.setProperty('--secondary-color', customColors.secondary);
    root.style.setProperty('--accent-color', customColors.accent);
    root.style.setProperty('--background-color', customColors.background);
    
        
    showNotification('Visualização aplicada! Recarregue a página para voltar ao normal.', 'info');
}
