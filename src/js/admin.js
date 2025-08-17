// Sistema de Administração - Granja Recanto Feliz
// Este arquivo gerencia toda a funcionalidade administrativa

// Configurações gerais
const LOW_STOCK_THRESHOLD = 10;
let currentEditingProduct = null;

// Inicialização quando o DOM carrega
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof window.dataManager === 'undefined') {
            console.error('Data Manager não carregado. Verifique se data-manager.js está incluído.');
            window.dataManager = new DataManager();
        }
        
        showSection('produtos');
        loadProductsTable();
        updateDashboardStats();
        
        if (window.dataManager && window.dataManager.getLayouts) {
            console.log('Layouts disponíveis:', Object.keys(window.dataManager.getLayouts()));
        }
    }, 500);
    
    // Event listeners
    const productForm = document.getElementById('product-form');
    const productImages = document.getElementById('product-images');
    
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
    
    if (productImages) {
        productImages.addEventListener('change', handleImagePreview);
    }
    
    // Escutar mudanças nos dados
    window.addEventListener('productsUpdated', function(event) {
        loadProductsTable();
        loadEstoqueGrid();
        updateDashboardStats();
    });
});

// Navegação entre seções
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(sectionName + '-section').classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-700', 'bg-yellow-700', 'bg-pink-700', 'bg-purple-700', 'bg-indigo-700');
        btn.classList.add('bg-blue-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500', 'bg-indigo-500');
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
        case 'carrossel':
            loadCarouselThemes();
            break;
    }
    
    // Atualizar botão ativo
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(sectionName) || 
            (sectionName === 'layouts' && btn.textContent.includes('Layouts')) ||
            (sectionName === 'carrossel' && btn.textContent.includes('Carrossel'))) {
            const colorMap = {
                produtos: 'bg-blue-700',
                estoque: 'bg-yellow-700', 
                layouts: 'bg-pink-700',
                relatorios: 'bg-purple-700',
                carrossel: 'bg-indigo-700'
            };
            btn.classList.remove('bg-blue-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500', 'bg-indigo-500');
            btn.classList.add(colorMap[sectionName] || 'bg-blue-700');
        }
    });
}

// Carregar tabela de produtos
function loadProductsTable() {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    try {
        const adminProducts = window.dataManager.getProducts();
        
        adminProducts.forEach(product => {
            if (product.active === false) return;
            
            const row = document.createElement('tr');
            row.className = 'border-b hover:bg-gray-50';
            
            const stockClass = product.stock === 0 ? 'text-red-600 font-bold' : 
                              product.stock <= LOW_STOCK_THRESHOLD ? 'text-yellow-600 font-bold' : 
                              'text-green-600';
            
            row.innerHTML = `
                <td class="px-4 py-3">#${product.id}</td>
                <td class="px-4 py-3">
                    <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded-lg" onerror="this.src='imagens/produtos/default/placeholder.png'">
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
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-red-500 p-4">Erro ao carregar produtos</td></tr>';
    }
}

// Carregar grid de estoque
function loadEstoqueGrid() {
    const estoqueGrid = document.getElementById('estoque-grid');
    if (!estoqueGrid) return;
    
    estoqueGrid.innerHTML = '';
    
    try {
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
    } catch (error) {
        console.error('Erro ao carregar estoque:', error);
        estoqueGrid.innerHTML = '<div class="text-red-500 p-4">Erro ao carregar estoque</div>';
    }
}

// Atualizar estatísticas do dashboard
function updateDashboardStats() {
    try {
        const stats = window.dataManager.getStats();
        
        document.getElementById('total-produtos').textContent = stats.totalProducts;
        document.getElementById('valor-total').textContent = `R$ ${stats.totalValue.toFixed(2)}`;
        document.getElementById('estoque-baixo').textContent = stats.lowStock;
        document.getElementById('sem-estoque').textContent = stats.outOfStock;
    } catch (error) {
        console.error('Erro ao atualizar estatísticas:', error);
    }
}

// =============== FUNÇÕES DE LAYOUTS TEMÁTICOS ===============

function loadLayoutsGrid() {
    const layoutsGrid = document.getElementById('layouts-grid');
    
    if (!layoutsGrid) {
        console.error('Elemento layouts-grid não encontrado');
        return;
    }
    
    try {
        if (!window.dataManager) {
            layoutsGrid.innerHTML = '<div class="text-red-500 p-4 border border-red-300 rounded">❌ DataManager não carregado.</div>';
            return;
        }
        
        const layouts = window.dataManager.getLayouts();
        const currentLayout = window.dataManager.getCurrentLayout();
        
        if (!layouts || Object.keys(layouts).length === 0) {
            layoutsGrid.innerHTML = '<div class="text-yellow-500 p-4 border border-yellow-300 rounded">⚠️ Nenhum layout encontrado.</div>';
            return;
        }
        
        layoutsGrid.innerHTML = '';
        
        Object.entries(layouts).forEach(([key, layout]) => {
            const isActive = currentLayout && currentLayout.theme === layout.theme;
            
            const card = document.createElement('div');
            card.className = `border rounded-lg p-4 ${isActive ? 'border-green-500 bg-green-50' : 'border-gray-200'}`;
            
            card.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <h4 class="font-bold text-lg">${layout.name || 'Layout sem nome'}</h4>
                    ${isActive ? '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">ATIVO</span>' : ''}
                </div>
                
                ${layout.colors ? `
                    <div class="flex space-x-2 mb-3">
                        <div class="w-6 h-6 rounded" style="background-color: ${layout.colors.primary || '#000'}"></div>
                        <div class="w-6 h-6 rounded" style="background-color: ${layout.colors.secondary || '#000'}"></div>
                        <div class="w-6 h-6 rounded" style="background-color: ${layout.colors.accent || '#000'}"></div>
                        <div class="w-6 h-6 rounded" style="background-color: ${layout.colors.background || '#fff'}"></div>
                    </div>
                ` : ''}
                
                <div class="text-sm text-gray-600 mb-4 truncate">
                    "${layout.bannerText || 'Sem texto de banner'}"
                </div>
                
                <div class="flex space-x-2">
                    ${!isActive ? `
                        <button onclick="activateLayout('${key}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                            <i class="fas fa-play mr-1"></i>Ativar
                        </button>
                    ` : ''}
                </div>
            `;
            
            layoutsGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Erro ao carregar layouts:', error);
        layoutsGrid.innerHTML = '<div class="text-red-500 p-4 border border-red-300 rounded">❌ Erro ao carregar layouts.</div>';
    }
}

function updateCurrentLayoutStatus() {
    try {
        const currentLayout = window.dataManager.getCurrentLayout();
        const statusInfo = document.getElementById('current-layout-info');
        
        if (!statusInfo) return;
        
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
    } catch (error) {
        console.error('Erro ao atualizar status do layout:', error);
    }
}

function activateLayout(layoutKey) {
    try {
        if (window.dataManager.activateLayout(layoutKey)) {
            showNotification(`Layout "${layoutKey}" ativado com sucesso!`, 'success');
            loadLayoutsGrid();
            updateCurrentLayoutStatus();
        } else {
            showNotification('Erro ao ativar layout!', 'error');
        }
    } catch (error) {
        console.error('Erro ao ativar layout:', error);
        showNotification('Erro ao ativar layout!', 'error');
    }
}

// =============== FUNÇÕES DE TEMAS DE CARROSSEL ===============

function loadCarouselThemes() {
    const grid = document.getElementById('carousel-themes-grid');
    
    if (!grid) {
        console.error('Elemento carousel-themes-grid não encontrado');
        return;
    }
    
    try {
        if (!window.dataManager) {
            grid.innerHTML = '<div class="text-red-500 p-4 border border-red-300 rounded">❌ DataManager não carregado.</div>';
            return;
        }
        
        const themes = window.dataManager.getCarouselThemes();
        
        if (!themes || themes.length === 0) {
            grid.innerHTML = '<div class="text-gray-500 p-4 border border-gray-300 rounded">🎠 Nenhum tema de carrossel encontrado. Clique em "Novo Tema" para criar.</div>';
            return;
        }
        
        grid.innerHTML = themes.map(theme => `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="relative h-48">
                    <img src="${theme.image || 'imagens/produtos/default/placeholder.png'}" alt="${theme.name || 'Tema sem nome'}" class="w-full h-full object-cover" onerror="this.src='imagens/produtos/default/placeholder.png'">
                    <div class="absolute top-2 right-2">
                        <span class="px-2 py-1 text-xs rounded-full ${theme.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}">
                            ${theme.active ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">${theme.name || 'Tema sem nome'}</h3>
                    <p class="text-sm text-gray-600 mb-2">${theme.category || 'Sem categoria'}</p>
                    <p class="text-sm text-gray-700 mb-4">${(theme.description || 'Sem descrição').substring(0, 100)}...</p>
                    <div class="flex space-x-2">
                        <button onclick="editCarouselTheme(${theme.id})" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm">
                            <i class="fas fa-edit mr-1"></i>Editar
                        </button>
                        <button onclick="toggleCarouselTheme(${theme.id})" class="${theme.active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white py-2 px-3 rounded text-sm">
                            <i class="fas fa-${theme.active ? 'pause' : 'play'} mr-1"></i>${theme.active ? 'Desativar' : 'Ativar'}
                        </button>
                        <button onclick="deleteCarouselTheme(${theme.id})" class="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm">
                            <i class="fas fa-trash mr-1"></i>Excluir
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar temas de carrossel:', error);
        grid.innerHTML = '<div class="text-red-500 p-4 border border-red-300 rounded">❌ Erro ao carregar temas.</div>';
    }
}

function addCarouselTheme() {
    document.getElementById('carousel-modal-title').textContent = 'Novo Tema de Carrossel';
    document.getElementById('carousel-theme-form').reset();
    document.getElementById('carousel-theme-id').value = '';
    document.getElementById('carousel-theme-modal').classList.remove('hidden');
}

function editCarouselTheme(themeId) {
    try {
        const themes = window.dataManager.getCarouselThemes();
        const theme = themes.find(t => t.id === themeId);
        
        if (!theme) return;
        
        document.getElementById('carousel-modal-title').textContent = 'Editar Tema de Carrossel';
        document.getElementById('carousel-theme-id').value = theme.id;
        document.getElementById('theme-name').value = theme.name;
        document.getElementById('theme-category').value = theme.category;
        document.getElementById('theme-title').value = theme.title;
        document.getElementById('theme-description').value = theme.description;
        document.getElementById('theme-image').value = theme.image;
        document.getElementById('theme-button-text').value = theme.buttonText;
        document.getElementById('theme-button-link').value = theme.buttonLink;
        document.getElementById('theme-button-color').value = theme.buttonColor;
        document.getElementById('theme-active').checked = theme.active;
        
        document.getElementById('carousel-theme-modal').classList.remove('hidden');
    } catch (error) {
        console.error('Erro ao editar tema:', error);
        showNotification('Erro ao editar tema!', 'error');
    }
}

function toggleCarouselTheme(themeId) {
    try {
        const themes = window.dataManager.getCarouselThemes();
        const theme = themes.find(t => t.id === themeId);
        
        if (!theme) return;
        
        window.dataManager.updateCarouselTheme(themeId, { active: !theme.active });
        loadCarouselThemes();
        showNotification(`Tema ${theme.active ? 'desativado' : 'ativado'} com sucesso!`, 'success');
    } catch (error) {
        console.error('Erro ao alternar tema:', error);
        showNotification('Erro ao alternar tema!', 'error');
    }
}

function deleteCarouselTheme(themeId) {
    if (!confirm('Tem certeza que deseja excluir este tema?')) return;
    
    try {
        window.dataManager.removeCarouselTheme(themeId);
        loadCarouselThemes();
        showNotification('Tema excluído com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao excluir tema:', error);
        showNotification('Erro ao excluir tema!', 'error');
    }
}

function closeCarouselThemeModal() {
    document.getElementById('carousel-theme-modal').classList.add('hidden');
}

// =============== FUNÇÕES AUXILIARES ===============

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
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Funções básicas de produto
function openProductModal(productId = null) {
    // Implementação básica
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.add('hidden');
}

function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            if (window.dataManager.deleteProduct(productId)) {
                showNotification('Produto excluído com sucesso!', 'success');
                loadProductsTable();
            } else {
                showNotification('Erro ao excluir produto!', 'error');
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            showNotification('Erro ao excluir produto!', 'error');
        }
    }
}

function adjustStock(productId, action = null) {
    try {
        if (action === 'add') {
            const amount = prompt('Quantidade a adicionar:', '1');
            if (amount && !isNaN(amount)) {
                window.dataManager.adjustStock(productId, parseInt(amount));
                showNotification(`Adicionados ${amount} itens ao estoque`, 'success');
                loadProductsTable();
                loadEstoqueGrid();
            }
        } else if (action === 'remove') {
            const amount = prompt('Quantidade a remover:', '1');
            if (amount && !isNaN(amount)) {
                window.dataManager.adjustStock(productId, -parseInt(amount));
                showNotification(`Removidos ${amount} itens do estoque`, 'success');
                loadProductsTable();
                loadEstoqueGrid();
            }
        } else {
            const product = window.dataManager.getProducts().find(p => p.id === productId);
            if (product) {
                const newStock = prompt(`Estoque atual: ${product.stock}\nNovo estoque:`, product.stock);
                if (newStock !== null && !isNaN(newStock)) {
                    window.dataManager.updateStock(productId, parseInt(newStock));
                    showNotification(`Estoque atualizado para ${newStock}`, 'success');
                    loadProductsTable();
                    loadEstoqueGrid();
                }
            }
        }
    } catch (error) {
        console.error('Erro ao ajustar estoque:', error);
        showNotification('Erro ao ajustar estoque!', 'error');
    }
}

function exportData() {
    try {
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
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
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
                event.target.value = '';
                loadProductsTable();
                loadLayoutsGrid();
                loadCarouselThemes();
            } else {
                showNotification('Erro ao restaurar dados!', 'error');
            }
        } catch (error) {
            showNotification('Arquivo de backup inválido!', 'error');
        }
    };
    reader.readAsText(file);
}

// Funções auxiliares
function updateLayoutsFromDefaults() {
    if (!confirm('Isso irá atualizar os layouts mantendo os produtos existentes. Confirma?')) {
        return;
    }
    
    try {
        window.dataManager = new DataManager();
        showNotification('Layouts atualizados com sucesso!', 'success');
        setTimeout(() => {
            loadLayoutsGrid();
            updateCurrentLayoutStatus();
        }, 100);
    } catch (error) {
        console.error('Erro ao atualizar layouts:', error);
        showNotification('Erro ao atualizar layouts!', 'error');
    }
}

function restoreProducts() {
    if (!confirm('Isso irá restaurar os produtos padrão. Confirma?')) {
        return;
    }
    
    try {
        window.dataManager = new DataManager();
        showNotification('Produtos padrão restaurados com sucesso!', 'success');
        setTimeout(() => {
            loadProductsTable();
            loadEstoqueGrid();
            updateDashboardStats();
        }, 100);
    } catch (error) {
        console.error('Erro ao restaurar produtos:', error);
        showNotification('Erro ao restaurar produtos!', 'error');
    }
}

function activateDefaultLayout() {
    activateLayout('default');
}

function checkAutoLayouts() {
    showNotification('Verificação de layouts automáticos em desenvolvimento', 'info');
}

function toggleLayoutAuto(layoutKey) {
    showNotification('Função de toggle automático em desenvolvimento', 'info');
}

function applyCustomLayout() {
    showNotification('Aplicação de layout personalizado em desenvolvimento', 'info');
}

function previewCustomLayout() {
    showNotification('Preview de layout personalizado em desenvolvimento', 'info');
}

function editLayout(layoutKey) {
    showNotification('Edição de layout em desenvolvimento', 'info');
}

function togglePartnerFields() {
    // Implementação básica
}

function toggleCustomCategory() {
    // Implementação básica
}

function handleProductSubmit(e) {
    e.preventDefault();
    showNotification('Função de submissão de produto em desenvolvimento', 'info');
}

function handleImagePreview(e) {
    // Implementação básica de preview
}

// Garantir que as funções estão disponíveis globalmente
window.showSection = showSection;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.adjustStock = adjustStock;
window.deleteProduct = deleteProduct;
window.exportData = exportData;
window.importData = importData;
window.loadLayoutsGrid = loadLayoutsGrid;
window.updateCurrentLayoutStatus = updateCurrentLayoutStatus;
window.activateLayout = activateLayout;
window.activateDefaultLayout = activateDefaultLayout;
window.checkAutoLayouts = checkAutoLayouts;
window.toggleLayoutAuto = toggleLayoutAuto;
window.applyCustomLayout = applyCustomLayout;
window.previewCustomLayout = previewCustomLayout;
window.updateLayoutsFromDefaults = updateLayoutsFromDefaults;
window.restoreProducts = restoreProducts;
window.editLayout = editLayout;
window.addCarouselTheme = addCarouselTheme;
window.editCarouselTheme = editCarouselTheme;
window.toggleCarouselTheme = toggleCarouselTheme;
window.deleteCarouselTheme = deleteCarouselTheme;
window.closeCarouselThemeModal = closeCarouselThemeModal;
window.togglePartnerFields = togglePartnerFields;
window.toggleCustomCategory = toggleCustomCategory;