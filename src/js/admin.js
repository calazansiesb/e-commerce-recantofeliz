// Sistema de Administração - Granja Recanto Feliz
// Este arquivo gerencia toda a funcionalidade administrativa

// Configurações gerais
const LOW_STOCK_THRESHOLD = 10;
let currentEditingProduct = null;

// Inicialização quando o DOM carrega
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando sistema administrativo...');
    
    // 1. GARANTIR FONTE DE DADOS ÚNICA
    console.log('🔧 Garantindo fonte de dados única...');
    
    // Verificar e limpar cache se necessário
    const cacheData = localStorage.getItem('granjaRecantoFelizData');
    if (cacheData) {
        try {
            const parsed = JSON.parse(cacheData);
            if (!parsed.forceSync) {
                console.log('⚠️ Cache sem marca forceSync - limpando para sincronizar...');
                localStorage.removeItem('granjaRecantoFelizData');
            }
        } catch (e) {
            console.log('⚠️ Cache corrompido - limpando...');
            localStorage.removeItem('granjaRecantoFelizData');
        }
    }
    
    // Forçar sincronização com produtos.json
    try {
        console.log('🔄 Forçando carregamento do produtos.json...');
        const response = await fetch('data/produtos.json', { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (response.ok) {
            const jsonData = await response.json();
            const syncData = {
                products: jsonData.products,
                lastUpdate: new Date().toISOString(),
                syncedFromServer: true,
                forceSync: true
            };
            localStorage.setItem('granjaRecantoFelizData', JSON.stringify(syncData));
            console.log('✅ Dados sincronizados com produtos.json');
        } else {
            console.error('❌ Erro ao carregar produtos.json:', response.status);
        }
    } catch (error) {
        console.error('❌ Erro na sincronização:', error);
    }
    
    // 2. INICIALIZAR DATA MANAGER
    setTimeout(async () => {
        // Verificar se DataManager está disponível
        if (typeof window.dataManager === 'undefined') {
            console.warn('⚠️ Data Manager não carregado, criando instância...');
            try {
                window.dataManager = new DataManager();
                console.log('✅ DataManager criado com sucesso');
            } catch (error) {
                console.error('❌ Erro ao criar DataManager:', error);
            }
        }
        
        // Verificar SQLiteManager
        if (typeof window.sqliteManager !== 'undefined') {
            console.log('✅ SQLiteManager disponível');
        } else {
            console.warn('⚠️ SQLiteManager não disponível, usando apenas localStorage');
        }
        
        // Debug: Verificar estado do localStorage
        console.log('🔍 Estado do localStorage:');
        const storageData = localStorage.getItem('granjaRecantoFelizData');
        if (storageData) {
            try {
                const parsed = JSON.parse(storageData);
                console.log(`📊 ${parsed.products?.length || 0} produtos no localStorage`);
                console.log('🕰️ Última atualização:', parsed.lastUpdate);
            } catch (parseError) {
                console.error('❌ Erro ao analisar dados do localStorage:', parseError);
            }
        } else {
            console.log('⚠️ Nenhum dado encontrado no localStorage');
        }
        
        // Inicializar interface
        try {
            await showSection('produtos');
            updateDashboardStats();
            console.log('✅ Interface inicializada com sucesso');
        } catch (interfaceError) {
            console.error('❌ Erro ao inicializar interface:', interfaceError);
        }
        
        // Verificar layouts
        if (window.dataManager && window.dataManager.getLayouts) {
            try {
                console.log('Layouts disponíveis:', Object.keys(window.dataManager.getLayouts()));
            } catch (layoutError) {
                console.warn('⚠️ Erro ao verificar layouts:', layoutError);
            }
        }
    }, 500);
    
    // Event listeners com tratamento de erro
    try {
        const productForm = document.getElementById('product-form');
        const productImages = document.getElementById('product-images');
        
        if (productForm) {
            productForm.addEventListener('submit', handleProductSubmit);
            console.log('✅ Event listener do formulário adicionado');
        } else {
            console.warn('⚠️ Formulário de produto não encontrado');
        }
        
        if (productImages) {
            productImages.addEventListener('change', handleImagePreview);
            console.log('✅ Event listener de imagens adicionado');
        }
    } catch (eventError) {
        console.error('❌ Erro ao adicionar event listeners:', eventError);
    }
    
    // Escutar mudanças nos dados
    window.addEventListener('productsUpdated', async function(event) {
        try {
            console.log('🔄 Produtos atualizados, recarregando interface...');
            await loadProductsTable();
            loadEstoqueGrid();
            updateDashboardStats();
        } catch (updateError) {
            console.error('❌ Erro ao atualizar interface:', updateError);
        }
    });
    
    console.log('✅ Inicialização concluída');
});

// Navegação entre seções
async function showSection(sectionName) {
    console.log('🔍 DEBUG: showSection chamado com:', sectionName);
    
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(sectionName + '-section');
    console.log('🔍 DEBUG: targetSection encontrado:', !!targetSection);
    
    if (targetSection) {
        targetSection.classList.remove('hidden');
        console.log('🔍 DEBUG: Seção', sectionName, 'deve estar visível agora');
    } else {
        console.error('❌ ERRO: Seção não encontrada:', sectionName + '-section');
    }
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-700', 'bg-yellow-700', 'bg-pink-700', 'bg-purple-700', 'bg-indigo-700');
        btn.classList.add('bg-blue-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500', 'bg-indigo-500');
    });
    
    // Carregar conteúdo específico da seção
    switch(sectionName) {
        case 'produtos':
            await loadProductsTable();
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
        case 'database':
            if (typeof updateDatabaseStatus === 'function') {
                updateDatabaseStatus();
            }
            break;
        case 'carrossel':
            loadCarouselThemes();
            break;
        case 'mensagens':
            carregarMensagemSalva();
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
async function loadProductsTable() {
    console.log('🔍 DEBUG: Iniciando loadProductsTable()');
    const tableBody = document.getElementById('products-table-body');
    console.log('🔍 DEBUG: tableBody encontrado:', !!tableBody);
    
    if (!tableBody) {
        console.error('❌ ERRO: Elemento products-table-body não encontrado!');
        return;
    }
    
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4">Carregando produtos...</td></tr>';
    
    try {
        console.log('🔄 Carregando produtos...');
        
        // MÉTODO SIMPLIFICADO: Carregar direto do JSON
        const response = await fetch('data/produtos.json', { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const jsonData = await response.json();
        
        if (!jsonData.products || !Array.isArray(jsonData.products) || jsonData.products.length === 0) {
            console.error('❌ Nenhum produto encontrado no JSON');
            tableBody.innerHTML = `
                <tr><td colspan="7" class="text-center py-8">
                    <div class="text-yellow-600 mb-4">
                        <i class="fas fa-box-open text-3xl mb-2"></i>
                        <p class="font-bold">Nenhum produto encontrado</p>
                        <p class="text-sm">Clique em "Novo Produto" para adicionar</p>
                    </div>
                </td></tr>
            `;
            return;
        }
        
        console.log(`✅ ${jsonData.products.length} produtos carregados do JSON`);
        
        // Limpar tabela
        tableBody.innerHTML = '';
        
        // Renderizar produtos
        jsonData.products.forEach(product => {
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
                <td class="px-4 py-3 font-medium">${product.name}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${product.category}</span>
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
        
        console.log(`✅ ${jsonData.products.length} produtos renderizados na tabela`);
        
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        tableBody.innerHTML = `
            <tr><td colspan="7" class="text-center py-8">
                <div class="text-red-600 mb-4">
                    <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
                    <p class="font-bold">Erro ao carregar produtos</p>
                    <p class="text-sm">${error.message}</p>
                </div>
            </td></tr>
        `;
    }
}
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
                        <button onclick="showProductHistory(${product.id})" class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm transition" title="Histórico">
                            <i class="fas fa-history"></i>
                        </button>
                        <button onclick="deleteProduct(${product.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        console.log('✅ Tabela de produtos carregada com sucesso');
        
    } catch (error) {
        console.error('❌ Erro fatal ao carregar produtos:', error);
        tableBody.innerHTML = `
            <tr><td colspan="7" class="text-center py-8">
                <div class="text-red-600 mb-4">
                    <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
                    <p class="font-bold">Erro fatal ao carregar produtos</p>
                    <p class="text-sm">${error.message}</p>
                </div>
                <button onclick="fixProductLoadingIssue()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
                    <i class="fas fa-tools mr-2"></i>Corrigir Problema
                </button>
            </td></tr>
        `;
    }
}

// Carregar grid de estoque
async function loadEstoqueGrid() {
    const estoqueGrid = document.getElementById('estoque-grid');
    if (!estoqueGrid) return;
    
    estoqueGrid.innerHTML = '';
    
    try {
        const adminProducts = window.dataManager ? 
            await window.dataManager.getActiveProducts() : 
            [];
        
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
async function updateDashboardStats() {
    try {
        const stats = await window.dataManager.getStats();
        
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
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    if (!productId) {
        // Novo produto - limpar formulário
        document.getElementById('modal-title').textContent = 'Novo Produto';
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        
        // Esconder campos de parceiro
        document.getElementById('partner-fields').classList.add('hidden');
        document.getElementById('partner-details').classList.add('hidden');
        document.getElementById('partner-description-field').classList.add('hidden');
    }
    
    modal.classList.remove('hidden');
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.add('hidden');
}

async function editProduct(productId) {
    try {
        console.log('✏️ Editando produto ID:', productId);
        console.log('🔍 Verificando fontes de dados disponíveis...');
        
        // Debug: verificar estado dos gerenciadores
        console.log('SQLiteManager disponível:', !!(window.sqliteManager && window.sqliteManager.db));
        console.log('DataManager disponível:', !!window.dataManager);
        console.log('DatabaseManager disponível:', !!window.dbManager);
        
        // CORREÇÃO: Usar APENAS DataManager (mesma fonte que loadProductsTable)
        let products = null;
        
        if (!window.dataManager) {
            console.error('❌ DataManager não disponível!');
            showNotification('Erro: Sistema de dados não disponível!', 'error');
            return;
        }
        
        try {
            console.log('📊 Usando DataManager para obter produtos...');
            products = await window.dataManager.getProducts();
            console.log(`✅ Produtos obtidos: ${products?.length || 0}`);
        } catch (dataManagerError) {
            console.error('❌ Erro no DataManager:', dataManagerError);
            showNotification('Erro ao acessar dados do produto!', 'error');
            return;
        }
        
        if (!products || !Array.isArray(products) || products.length === 0) {
            console.error('❌ Nenhum produto encontrado em nenhuma fonte');
            showNotification('Erro: Nenhum produto encontrado no sistema!', 'error');
            return;
        }
            
        const product = products.find(p => p.id == productId); // Usar == para comparação flexível
        
        if (!product) {
            console.error('❌ Produto não encontrado:', productId);
            console.log('IDs disponíveis:', products.map(p => ({ id: p.id, name: p.name })));
            showNotification('Produto não encontrado!', 'error');
            return;
        }
        
        console.log('✅ Produto encontrado:', product);
        
        // Abrir modal primeiro
        openProductModal(productId);
        
        // Aguardar um pouco para garantir que o modal está aberto e renderizado
        setTimeout(() => {
            try {
                // Preencher formulário com dados do produto
                const modalTitle = document.getElementById('modal-title');
                if (modalTitle) {
                    modalTitle.textContent = 'Editar Produto';
                    console.log('📝 Título do modal definido');
                }
                
                const productIdField = document.getElementById('product-id');
                if (productIdField) {
                    productIdField.value = product.id;
                    console.log('🆔 ID do produto definido:', product.id);
                }
                
                const productName = document.getElementById('product-name');
                if (productName) {
                    productName.value = product.name || '';
                    console.log('📛 Nome do produto definido:', product.name);
                }
                
                const productSlogan = document.getElementById('product-slogan');
                if (productSlogan) {
                    productSlogan.value = product.slogan || '';
                    console.log('💭 Slogan definido:', product.slogan);
                }
                
                const productDescription = document.getElementById('product-description');
                if (productDescription) {
                    productDescription.value = product.description || '';
                    console.log('📄 Descrição definida');
                }
                
                const productPrice = document.getElementById('product-price');
                if (productPrice) {
                    productPrice.value = product.price || 0;
                    console.log('💰 Preço definido:', product.price);
                }
                
                const productStock = document.getElementById('product-stock');
                if (productStock) {
                    productStock.value = product.stock || 0;
                    console.log('📦 Estoque definido:', product.stock);
                }
                
                // Definir categoria
                const categorySelect = document.getElementById('product-category');
                if (categorySelect) {
                    categorySelect.value = product.category || '';
                    console.log('🏷️ Categoria definida:', product.category);
                }
                
                // Definir tipo (granja ou parceiro)
                const typeSelect = document.getElementById('product-type');
                if (typeSelect) {
                    typeSelect.value = product.partner ? 'parceiro' : 'granja';
                    console.log('🏢 Tipo definido:', product.partner ? 'parceiro' : 'granja');
                    togglePartnerFields(); // Mostrar campos de parceiro se necessário
                }
                
                // Preencher dados do parceiro se existir
                if (product.partner) {
                    console.log('👥 Preenchendo dados do parceiro...');
                    
                    const partnerName = document.getElementById('partner-name');
                    if (partnerName) {
                        partnerName.value = product.partner.name || '';
                        console.log('🏪 Nome do parceiro:', product.partner.name);
                    }
                    
                    const partnerProducer = document.getElementById('partner-producer');
                    if (partnerProducer) {
                        partnerProducer.value = product.partner.producer || '';
                        console.log('👨‍🌾 Produtor:', product.partner.producer);
                    }
                    
                    const partnerLocation = document.getElementById('partner-location');
                    if (partnerLocation) {
                        partnerLocation.value = product.partner.location || '';
                        console.log('📍 Localização:', product.partner.location);
                    }
                    
                    const partnerDescription = document.getElementById('partner-description');
                    if (partnerDescription) {
                        partnerDescription.value = product.partner.description || '';
                        console.log('📝 Descrição do parceiro definida');
                    }
                }
                
                console.log('✅ Todos os dados preenchidos no formulário');
            } catch (fillError) {
                console.error('❌ Erro ao preencher formulário:', fillError);
                showNotification('Erro ao carregar dados no formulário!', 'error');
            }
        }, 200); // Aumentei o timeout para garantir renderização completa
        
    } catch (error) {
        console.error('❌ Erro ao editar produto:', error);
        showNotification('Erro ao carregar dados do produto!', 'error');
    }
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
        let stockChanged = false;
        
        if (action === 'add') {
            const amount = prompt('Quantidade a adicionar:', '1');
            if (amount && !isNaN(amount)) {
                window.dataManager.adjustStock(productId, parseInt(amount));
                showNotification(`Adicionados ${amount} itens ao estoque`, 'success');
                stockChanged = true;
            }
        } else if (action === 'remove') {
            const amount = prompt('Quantidade a remover:', '1');
            if (amount && !isNaN(amount)) {
                window.dataManager.adjustStock(productId, -parseInt(amount));
                showNotification(`Removidos ${amount} itens do estoque`, 'success');
                stockChanged = true;
            }
        } else {
            const products = await window.dataManager.getProducts();
            const product = products.find(p => p.id === productId);
            if (product) {
                const newStock = prompt(`Estoque atual: ${product.stock}\nNovo estoque:`, product.stock);
                if (newStock !== null && !isNaN(newStock)) {
                    await window.dataManager.updateProduct(productId, {stock: parseInt(newStock)});
                    showNotification(`Estoque atualizado para ${newStock}`, 'success');
                    stockChanged = true;
                }
            }
        }
        
        if (stockChanged) {
            await loadProductsTable();
            await loadEstoqueGrid();
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
            showNotification('Backup JSON realizado com sucesso!', 'success');
        } else {
            showNotification('Erro ao criar backup!', 'error');
        }
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
        showNotification('Erro ao criar backup!', 'error');
    }
}

// Exportar histórico de alterações
function exportHistory() {
    try {
        if (window.dataManager.exportHistoryToCSV()) {
            showNotification('Histórico exportado com sucesso!', 'success');
        } else {
            showNotification('Erro ao exportar histórico!', 'error');
        }
    } catch (error) {
        console.error('Erro ao exportar histórico:', error);
        showNotification('Erro ao exportar histórico!', 'error');
    }
}

// Mostrar histórico de um produto
function showProductHistory(productId) {
    try {
        const history = window.dataManager.getProductHistory(productId, 20);
        
        if (history.length === 0) {
            showNotification('Nenhum histórico encontrado para este produto', 'info');
            return;
        }
        
        let historyHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
                    <div class="p-6 border-b flex justify-between items-center">
                        <h3 class="text-2xl font-bold">Histórico do Produto #${productId}</h3>
                        <button onclick="closeHistoryModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                    </div>
                    <div class="p-6 overflow-y-auto max-h-96">
                        <div class="space-y-4">
        `;
        
        history.forEach(entry => {
            const date = new Date(entry.timestamp).toLocaleString('pt-BR');
            const actionColor = {
                'CREATE': 'bg-green-100 text-green-800',
                'UPDATE': 'bg-blue-100 text-blue-800', 
                'DELETE': 'bg-red-100 text-red-800'
            }[entry.action] || 'bg-gray-100 text-gray-800';
            
            historyHTML += `
                <div class="border rounded-lg p-4">
                    <div class="flex justify-between items-start mb-2">
                        <span class="px-2 py-1 rounded text-sm ${actionColor}">${entry.action}</span>
                        <span class="text-sm text-gray-500">${date}</span>
                    </div>
                    <h4 class="font-semibold">${entry.productName}</h4>
            `;
            
            if (entry.changes && entry.changes.length > 0) {
                historyHTML += '<div class="mt-2 space-y-1">';
                entry.changes.forEach(change => {
                    historyHTML += `
                        <div class="text-sm bg-gray-50 p-2 rounded">
                            <strong>${change.field}:</strong> 
                            <span class="text-red-600">${change.oldValue}</span> → 
                            <span class="text-green-600">${change.newValue}</span>
                        </div>
                    `;
                });
                historyHTML += '</div>';
            }
            
            historyHTML += '</div>';
        });
        
        historyHTML += `
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', historyHTML);
        
    } catch (error) {
        console.error('Erro ao mostrar histórico:', error);
        showNotification('Erro ao carregar histórico!', 'error');
    }
}

// Fechar modal de histórico
function closeHistoryModal() {
    const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (modal) modal.remove();
}

// Mostrar backups CSV disponíveis
function showCSVBackups() {
    try {
        const backups = window.dataManager.getCSVBackups();
        
        if (backups.length === 0) {
            showNotification('Nenhum backup CSV encontrado', 'info');
            return;
        }
        
        let backupsHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg max-w-2xl w-full">
                    <div class="p-6 border-b flex justify-between items-center">
                        <h3 class="text-2xl font-bold">Backups CSV Disponíveis</h3>
                        <button onclick="closeBackupsModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                    </div>
                    <div class="p-6">
                        <div class="space-y-3">
        `;
        
        backups.forEach((backup, index) => {
            const date = new Date(backup.timestamp).toLocaleString('pt-BR');
            backupsHTML += `
                <div class="flex justify-between items-center p-3 border rounded">
                    <div>
                        <div class="font-semibold">${backup.filename}</div>
                        <div class="text-sm text-gray-500">${date} - ${backup.recordCount} produtos</div>
                    </div>
                    <button onclick="downloadBackup(${index})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-download mr-1"></i>Baixar
                    </button>
                </div>
            `;
        });
        
        backupsHTML += `
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', backupsHTML);
        
    } catch (error) {
        console.error('Erro ao mostrar backups:', error);
        showNotification('Erro ao carregar backups!', 'error');
    }
}

// Fechar modal de backups
function closeBackupsModal() {
    const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (modal) modal.remove();
}

// Download de backup específico
function downloadBackup(index) {
    try {
        if (window.dataManager.downloadCSVBackup(index)) {
            showNotification('Backup baixado com sucesso!', 'success');
            closeBackupsModal();
        } else {
            showNotification('Erro ao baixar backup!', 'error');
        }
    } catch (error) {
        console.error('Erro ao baixar backup:', error);
        showNotification('Erro ao baixar backup!', 'error');
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
    const productType = document.getElementById('product-type');
    if (!productType) return;
    
    const typeValue = productType.value;
    const partnerFields = document.getElementById('partner-fields');
    const partnerDetails = document.getElementById('partner-details');
    const partnerDescField = document.getElementById('partner-description-field');
    
    console.log('Tipo de produto:', typeValue);
    
    if (typeValue === 'parceiro') {
        if (partnerFields) partnerFields.classList.remove('hidden');
        if (partnerDetails) partnerDetails.classList.remove('hidden');
        if (partnerDescField) partnerDescField.classList.remove('hidden');
        console.log('Campos de parceiro mostrados');
    } else {
        if (partnerFields) partnerFields.classList.add('hidden');
        if (partnerDetails) partnerDetails.classList.add('hidden');
        if (partnerDescField) partnerDescField.classList.add('hidden');
        console.log('Campos de parceiro escondidos');
    }
}

function toggleCustomCategory() {
    const categorySelect = document.getElementById('product-category');
    const customCategoryInput = document.getElementById('custom-category');
    
    if (categorySelect && customCategoryInput) {
        if (categorySelect.value === 'custom') {
            customCategoryInput.classList.remove('hidden');
            customCategoryInput.required = true;
        } else {
            customCategoryInput.classList.add('hidden');
            customCategoryInput.required = false;
            customCategoryInput.value = '';
        }
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    try {
        console.log('💾 Salvando produto...');
        
        // Validar campos obrigatórios
        const productName = document.getElementById('product-name').value.trim();
        const productPrice = document.getElementById('product-price').value;
        const productStock = document.getElementById('product-stock').value;
        const productCategory = document.getElementById('product-category').value;
        
        if (!productName) {
            showNotification('Nome do produto é obrigatório!', 'error');
            return;
        }
        
        if (!productPrice || parseFloat(productPrice) <= 0) {
            showNotification('Preço deve ser maior que zero!', 'error');
            return;
        }
        
        if (!productStock || parseInt(productStock) < 0) {
            showNotification('Estoque deve ser um número válido!', 'error');
            return;
        }
        
        if (!productCategory) {
            showNotification('Categoria é obrigatória!', 'error');
            return;
        }
        
        const productId = document.getElementById('product-id').value;
        const productData = {
            name: productName,
            slogan: document.getElementById('product-slogan').value.trim(),
            description: document.getElementById('product-description').value.trim(),
            price: parseFloat(productPrice),
            stock: parseInt(productStock),
            category: productCategory,
            active: true
        };
        
        // Verificar se é produto de parceiro
        const productType = document.getElementById('product-type').value;
        if (productType === 'parceiro') {
            const partnerName = document.getElementById('partner-name').value.trim();
            if (!partnerName) {
                showNotification('Nome do parceiro é obrigatório!', 'error');
                return;
            }
            
            productData.partner = {
                name: partnerName,
                producer: document.getElementById('partner-producer').value.trim(),
                location: document.getElementById('partner-location').value.trim(),
                description: document.getElementById('partner-description').value.trim()
            };
        }
        
        // === NOVO SISTEMA DE PERSISTÊNCIA ===
        console.log('🔄 Iniciando salvamento com sistema robusto...');
        
        // 1. Aguardar SQLite estar pronto (com timeout para não travar)
        let sqliteReady = false;
        if (window.sqliteRobustInitializer) {
            try {
                console.log('⏳ Aguardando SQLite inicializar...');
                await Promise.race([
                    window.sqliteRobustInitializer.waitForReady(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
                ]);
                sqliteReady = true;
                console.log('✅ SQLite está pronto para uso');
            } catch (timeout) {
                console.log('⚠️ SQLite não ficou pronto em 3s - continuando com localStorage');
            }
        } else {
            console.log('⚠️ Sistema robusto não disponível - tentando inicialização tradicional...');
        }
        
        let success = false;
        
        // 2. Usar DataManager (que agora integra com SQLite automaticamente)
        if (!window.dataManager) {
            console.error('❌ DataManager não disponível!');
            showNotification('Erro: Sistema de dados não disponível!', 'error');
            return;
        }
        
        try {
            console.log('💾 Salvando via DataManager...');
            
            if (productId) {
                // Atualizar produto existente
                console.log(`🔄 Atualizando produto ID ${productId}...`);
                success = await window.dataManager.updateProduct(parseInt(productId), productData);
            } else {
                // Adicionar novo produto
                console.log('➕ Adicionando novo produto...');
                success = await window.dataManager.addProduct(productData);
            }
            
            if (success) {
                console.log('✅ Produto salvo com sucesso no DataManager');
                
                // Verificar se SQLite também foi atualizado
                if (window.sqliteReady && window.sqliteManager) {
                    console.log('� Verificando sincronização SQLite...');
                    try {
                        const products = window.sqliteManager.getProducts();
                        console.log(`📊 SQLite agora tem ${products.length} produtos`);
                    } catch (checkError) {
                        console.warn('⚠️ Erro ao verificar SQLite:', checkError);
                    }
                }
                
                // Notificar sucesso
                if (productId) {
                    showNotification('Produto atualizado com sucesso!', 'success');
                } else {
                    showNotification('Produto adicionado com sucesso!', 'success');
                }
                // Tentar enviar ao servidor (opcional)
                try {
                    if (window.dataManager && typeof window.dataManager.pushDataToServer === 'function') {
                        const pushed = await window.dataManager.pushDataToServer(5000);
                        if (pushed) {
                            showNotification('Alterações sincronizadas com o servidor.', 'success');
                        } else {
                            showNotification('Alterações salvas localmente (servidor indisponível).', 'warning');
                        }
                    }
                } catch (pushError) {
                    console.warn('⚠️ Falha ao enviar dados ao servidor:', pushError);
                    showNotification('Salvo localmente — falha ao sincronizar com servidor.', 'warning');
                }
                
                // Atualizar interface
                await showSection('produtos');
                updateDashboardStats();
                
                // Fechar modal
                if (typeof closeProductModal === 'function') {
                    closeProductModal();
                }
                
            } else {
                console.error('❌ Falha ao salvar produto');
                showNotification('Erro ao salvar produto!', 'error');
            }
            
        } catch (dataManagerError) {
            console.error('❌ Erro no DataManager:', dataManagerError);
            showNotification('Erro interno ao salvar produto!', 'error');
        }
        
    } catch (error) {
        console.error('❌ Erro geral durante salvamento:', error);
        showNotification('Erro inesperado ao salvar produto!', 'error');
    }
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
window.exportHistory = exportHistory;
window.showProductHistory = showProductHistory;
window.closeHistoryModal = closeHistoryModal;
window.showCSVBackups = showCSVBackups;
window.closeBackupsModal = closeBackupsModal;
window.downloadBackup = downloadBackup;
window.quickRestore = quickRestore;
window.exportCSV = exportCSV;
window.syncWithCSV = syncWithCSV;

// Função de exportação CSV
function exportCSV() {
    try {
        if (window.sqliteManager && window.sqliteManager.db) {
            window.sqliteManager.exportToCSV();
            showNotification('✅ CSV exportado do SQLite!', 'success');
        } else {
            const products = window.dataManager.getProducts();
            if (window.csvManager) {
                window.csvManager.exportFullCSV(products);
            } else {
                showNotification('CSV Manager não carregado!', 'error');
            }
        }
    } catch (error) {
        console.error('Erro ao exportar CSV:', error);
        showNotification('Erro ao exportar CSV!', 'error');
    }
}

// Função de sincronização com CSV
function syncWithCSV() {
    try {
        if (window.csvManager) {
            window.csvManager.syncWithCSV();
        } else {
            showNotification('CSV Manager não carregado!', 'error');
        }
    } catch (error) {
        console.error('Erro na sincronização:', error);
        showNotification('Erro na sincronização!', 'error');
    }
}

// Função de restauração rápida
function quickRestore() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.style.display = 'none';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                let data;
                
                if (file.name.endsWith('.csv')) {
                    // Processar CSV
                    const csvData = event.target.result;
                    const lines = csvData.split('\n');
                    const headers = lines[0].split(',');
                    
                    const products = [];
                    for (let i = 1; i < lines.length; i++) {
                        if (lines[i].trim()) {
                            const values = lines[i].split(',');
                            const product = {
                                id: parseInt(values[0]),
                                name: values[1].replace(/"/g, ''),
                                category: values[2],
                                price: parseFloat(values[3]),
                                stock: parseInt(values[4]),
                                slogan: values[5].replace(/"/g, ''),
                                description: values[6].replace(/"/g, ''),
                                image: values[7],
                                active: values[8] === 'true'
                            };
                            
                            if (values[9] && values[9].replace(/"/g, '')) {
                                product.partner = {
                                    name: values[9].replace(/"/g, ''),
                                    producer: values[10].replace(/"/g, ''),
                                    location: values[11].replace(/"/g, ''),
                                    description: values[12].replace(/"/g, '')
                                };
                            }
                            
                            products.push(product);
                        }
                    }
                    
                    data = {
                        products,
                        lastUpdate: new Date().toISOString()
                    };
                } else {
                    // Processar JSON
                    data = JSON.parse(event.target.result);
                }
                
                if (window.dataManager.importData(data)) {
                    showNotification(`Dados restaurados: ${data.products.length} produtos!`, 'success');
                    loadProductsTable();
                    loadEstoqueGrid();
                    updateDashboardStats();
                } else {
                    showNotification('Erro ao restaurar dados!', 'error');
                }
            } catch (error) {
                console.error('Erro ao processar arquivo:', error);
                showNotification('Arquivo inválido!', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}
window.debugStorage = debugStorage;

// Função de debug para verificar localStorage
function debugStorage() {
    console.log('=== DEBUG STORAGE ===');
    const data = localStorage.getItem('granjaRecantoFelizData');
    if (data) {
        const parsed = JSON.parse(data);
        console.log('Produtos no storage:', parsed.products?.length);
        console.log('Primeira produto:', parsed.products?.[0]);
        console.log('Última atualização:', parsed.lastUpdate);
    } else {
        console.log('Nenhum dado encontrado!');
    }
    
    // Verificar se DataManager está funcionando
    const products = window.dataManager.getProducts();
    console.log('Produtos via DataManager:', products.length);
    console.log('Primeiro produto via DataManager:', products[0]);
    
    return { localStorage: data ? JSON.parse(data) : null, dataManager: products };
}