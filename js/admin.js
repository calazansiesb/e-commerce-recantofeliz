// Sistema de Administração - Granja Recanto Feliz (Versão Funcional)
console.log('🔧 Carregando produtos no admin...');

let produtos = [];

// Função para mostrar/esconder seções
function showSection(section) {
    // Esconder todas as seções
    const sections = ['produtos', 'estoque', 'layouts', 'carrossel'];
    sections.forEach(s => {
        const el = document.getElementById(`${s}-section`);
        if (el) el.classList.add('hidden');
    });
    
    // Mostrar a seção selecionada
    const selectedSection = document.getElementById(`${section}-section`);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
        
        // Carregar conteúdo específico da seção
        if (section === 'layouts') {
            loadLayoutsGrid();
        } else if (section === 'carrossel') {
            loadCarouselSlides();
        } else if (section === 'produtos') {
            carregarProdutosAdmin();
        }
    }
}

// Carregar produtos do mesmo arquivo JSON que o index.html usa
async function carregarProdutosAdmin() {
    try {
        // Tentar carregar do localStorage primeiro (mesma lógica do index)
        const savedData = localStorage.getItem('granjaRecantoFelizData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.products && data.products.length > 0) {
                    produtos = data.products;
                    console.log(`✅ ${data.products.length} produtos carregados do localStorage`);
                    renderizarProdutosAdmin();
                    return;
                }
            } catch (e) {
                console.log('⚠️ Erro no localStorage, tentando arquivo JSON');
            }
        }
        
        // Se não tem localStorage, carregar do arquivo JSON
        const response = await fetch('data/produtos.json', { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            if (data.products && data.products.length > 0) {
                produtos = data.products;
                console.log(`✅ ${data.products.length} produtos carregados do arquivo JSON`);
                
                // Salvar no localStorage para sincronizar
                localStorage.setItem('granjaRecantoFelizData', JSON.stringify({
                    products: produtos,
                    lastUpdate: new Date().toISOString()
                }));
                
                renderizarProdutosAdmin();
            }
        }
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        // Usar produtos padrão como fallback
        produtos = [
            { id: 1, name: "Substrato BioFértil 3 Anos", category: "fertilizantes", slogan: "Mais do que Adubo: um substrato vivo e completo.", price: 40.00, image: "imagens/produtos/1/1.png", stock: 25, active: true },
            { id: 2, name: "FertiGota", category: "fertilizantes", slogan: "Adubo de galinha líquido e potente.", price: 25.00, image: "imagens/produtos/2/1.png", stock: 40, active: true },
            { id: 3, name: "Ovos Caipira 10", category: "ovos", slogan: "10 ovos frescos da granja.", price: 18.00, image: "imagens/produtos/3/1.jpeg", stock: 120, active: true },
            { id: 4, name: "Ovos Caipira 20", category: "ovos", slogan: "20 ovos frescos da granja.", price: 30.00, image: "imagens/produtos/4/1.jpeg", stock: 80, active: true },
            { id: 5, name: "Ovos Caipira 30", category: "ovos", slogan: "30 ovos frescos da granja.", price: 45.00, image: "imagens/produtos/5/1.png", stock: 50, active: true },
            { id: 6, name: "Galinha Caipira Picada", category: "aves", slogan: "Galinha caipira cortada, pronta para cozinhar.", price: 60.00, image: "imagens/produtos/6/1.png", stock: 15, active: true },
            { id: 7, name: "Galinha Caipira Inteira", category: "aves", slogan: "Galinha caipira inteira, fresca e saborosa.", price: 110.00, image: "imagens/produtos/7/1.png", stock: 8, active: true }
        ];
        renderizarProdutosAdmin();
    }
}

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

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ================================
// SEÇÃO DE LAYOUTS
// ================================

function loadLayoutsGrid() {
    console.log('🎨 Carregando layouts...');
    
    const grid = document.getElementById('layouts-grid');
    if (!grid) return;
    
    if (window.layoutManager) {
        const layouts = window.layoutManager.getLayouts();
        const activeLayout = window.layoutManager.getActiveLayout();
        
        grid.innerHTML = layouts.map(layout => `
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${
                layout.id === activeLayout.id ? 'ring-2 ring-blue-500' : ''
            }">
                <div class="relative">
                    <div class="h-32 bg-gradient-to-br from-${layout.colors.primary.replace('#', '')}-100 to-${layout.colors.secondary.replace('#', '')}-100 flex items-center justify-center">
                        <div class="text-center p-4">
                            <div class="text-2xl mb-2">${layout.name}</div>
                            <div class="text-sm opacity-75">${layout.description}</div>
                        </div>
                    </div>
                    ${layout.id === activeLayout.id ? '<div class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">Ativo</div>' : ''}
                </div>
                <div class="p-4">
                    <div class="flex space-x-2 mb-3">
                        ${Object.entries(layout.colors).map(([key, color]) => 
                            `<div class="w-4 h-4 rounded-full border" style="background-color: ${color}" title="${key}"></div>`
                        ).join('')}
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="activateLayout('${layout.id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex-1">
                            <i class="fas fa-check mr-1"></i>Ativar
                        </button>
                        <button onclick="previewLayout('${layout.id}')" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log(`✅ ${layouts.length} layouts carregados`);
    } else {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500">LayoutManager não disponível</div>';
    }
}

function activateLayout(layoutId) {
    if (window.layoutManager) {
        const success = window.layoutManager.applyTheme(layoutId);
        
        if (success) {
            loadLayoutsGrid();
            showNotification('Layout ativado com sucesso!', 'success');
        } else {
            showNotification('Erro ao ativar layout', 'error');
        }
    } else {
        showNotification('LayoutManager não disponível', 'error');
    }
}

function previewLayout(layoutId) {
    window.open(`index.html?preview=${layoutId}`, '_blank');
}

// ================================
// SEÇÃO DO CARROSSEL
// ================================

function loadCarouselSlides() {
    console.log('🎠 Carregando slides do carrossel...');
    
    const grid = document.getElementById('carousel-slides-grid');
    if (!grid) return;
    
    // Slides padrão do carrossel
    const defaultSlides = [
        {
            id: 1,
            title: 'Ovos Caipira Frescos',
            description: 'Direto da nossa granja para sua mesa',
            image: 'imagens/carrocel/ovos-caipira.png',
            active: true
        },
        {
            id: 2,
            title: 'Galinhas Caipira',
            description: 'Criadas com amor e cuidado no campo',
            image: 'imagens/carrocel/galinhas-caipira.png',
            active: true
        },
        {
            id: 3,
            title: 'Agricultura Familiar',
            description: 'Tradição e qualidade há gerações',
            image: 'imagens/carrocel/agricultura-familiar.png',
            active: true
        },
        {
            id: 4,
            title: 'Adubo Orgânico',
            description: 'Para um cultivo mais natural e sustentável',
            image: 'imagens/carrocel/adubo-organico.png',
            active: true
        }
    ];
    
    // Verificar se há slides salvos no localStorage
    let slides = defaultSlides;
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        console.log('⚠️ Usando slides padrão do carrossel');
    }
    
    // Renderizar slides
    grid.innerHTML = slides.map(slide => `
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <div class="relative">
                <img src="${slide.image}" alt="${slide.title}" class="w-full h-48 object-cover" onerror="this.src='imagens/LOGO 2023.jpg'">
                <div class="absolute top-2 right-2">
                    <span class="px-2 py-1 text-xs rounded-full ${slide.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${slide.active ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-gray-800 mb-2">${slide.title}</h3>
                <p class="text-gray-600 text-sm mb-4">${slide.description}</p>
                <div class="flex space-x-2">
                    <button onclick="editCarouselSlide(${slide.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-edit mr-1"></i>Editar
                    </button>
                    <button onclick="toggleSlideStatus(${slide.id})" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-toggle-${slide.active ? 'on' : 'off'} mr-1"></i>${slide.active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button onclick="deleteCarouselSlide(${slide.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-trash mr-1"></i>Excluir
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log(`✅ ${slides.length} slides carregados`);
}

function addCarouselSlide() {
    const title = prompt('Título do slide:');
    if (!title) return;
    
    const description = prompt('Descrição do slide:');
    if (!description) return;
    
    const image = prompt('URL/caminho da imagem (deixe em branco para usar padrão):') || 'imagens/LOGO 2023.jpg';
    
    // Buscar slides existentes
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        slides = [];
    }
    
    // Criar novo slide
    const newSlide = {
        id: Math.max(...slides.map(s => s.id || 0)) + 1,
        title: title,
        description: description,
        image: image,
        active: true
    };
    
    slides.push(newSlide);
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification('Slide adicionado com sucesso!', 'success');
}

function editCarouselSlide(id) {
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        showNotification('Erro ao carregar slides', 'error');
        return;
    }
    
    const slide = slides.find(s => s.id === id);
    if (!slide) {
        showNotification('Slide não encontrado', 'error');
        return;
    }
    
    const newTitle = prompt('Novo título:', slide.title);
    if (newTitle === null) return;
    
    const newDescription = prompt('Nova descrição:', slide.description);
    if (newDescription === null) return;
    
    const newImage = prompt('Nova imagem:', slide.image);
    if (newImage === null) return;
    
    // Atualizar slide
    slide.title = newTitle;
    slide.description = newDescription;
    slide.image = newImage;
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification('Slide atualizado com sucesso!', 'success');
}

function toggleSlideStatus(id) {
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        showNotification('Erro ao carregar slides', 'error');
        return;
    }
    
    const slide = slides.find(s => s.id === id);
    if (!slide) {
        showNotification('Slide não encontrado', 'error');
        return;
    }
    
    slide.active = !slide.active;
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification('Slide ' + (slide.active ? 'ativado' : 'desativado') + ' com sucesso!', 'success');
}

function deleteCarouselSlide(id) {
    if (!confirm('Tem certeza que deseja excluir este slide?')) return;
    
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        showNotification('Erro ao carregar slides', 'error');
        return;
    }
    
    slides = slides.filter(s => s.id !== id);
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification('Slide excluído com sucesso!', 'success');
}

function previewCarousel() {
    window.open('index.html#carrossel', '_blank');
}

function loadDefaultCarouselSlides() {
    if (!confirm('Isso irá substituir todos os slides atuais pelos padrões. Continuar?')) return;
    
    localStorage.removeItem('carouselSlides');
    loadCarouselSlides();
    showNotification('Slides padrão restaurados!', 'success');
}

// Inicializar admin quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Admin carregado');
    carregarProdutosAdmin();
    
    // Mostrar seção de produtos por padrão
    showSection('produtos');
});
async function carregarProdutosAdmin() {
    try {
        // Tentar carregar do localStorage primeiro (mesma lógica do index)
        const savedData = localStorage.getItem('granjaRecantoFelizData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.products && data.products.length > 0) {
                    produtos = data.products;
                    console.log(`✅ ${data.products.length} produtos carregados do localStorage`);
                    renderizarProdutosAdmin();
                    return;
                }
            } catch (e) {
                console.log('⚠️ Erro no localStorage, tentando arquivo JSON');
            }
        }
        
        // Se não tem localStorage, carregar do arquivo JSON
        const response = await fetch('data/produtos.json', { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            if (data.products && data.products.length > 0) {
                produtos = data.products;
                console.log(`✅ ${data.products.length} produtos carregados do arquivo JSON`);
                
                // Salvar no localStorage para sincronizar
                localStorage.setItem('granjaRecantoFelizData', JSON.stringify({
                    products: produtos,
                    lastUpdate: new Date().toISOString()
                }));
                
                renderizarProdutosAdmin();
            }
        }
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        // Usar produtos padrão como fallback
        produtos = [
            { id: 1, name: "Substrato BioFértil 3 Anos", category: "fertilizantes", slogan: "Mais do que Adubo: um substrato vivo e completo.", price: 40.00, image: "imagens/produtos/1/1.png", stock: 25, active: true },
            { id: 2, name: "FertiGota", category: "fertilizantes", slogan: "Adubo de galinha líquido e potente.", price: 25.00, image: "imagens/produtos/2/1.png", stock: 40, active: true },
            { id: 3, name: "Ovos Caipira 10", category: "ovos", slogan: "10 ovos frescos da granja.", price: 18.00, image: "imagens/produtos/3/1.jpeg", stock: 120, active: true },
            { id: 4, name: "Ovos Caipira 20", category: "ovos", slogan: "20 ovos frescos da granja.", price: 30.00, image: "imagens/produtos/4/1.jpeg", stock: 80, active: true },
            { id: 5, name: "Ovos Caipira 30", category: "ovos", slogan: "30 ovos frescos da granja.", price: 45.00, image: "imagens/produtos/5/1.png", stock: 50, active: true },
            { id: 6, name: "Galinha Caipira Picada", category: "aves", slogan: "Galinha caipira cortada, pronta para cozinhar.", price: 60.00, image: "imagens/produtos/6/1.png", stock: 15, active: true },
            { id: 7, name: "Galinha Caipira Inteira", category: "aves", slogan: "Galinha caipira inteira, fresca e saborosa.", price: 110.00, image: "imagens/produtos/7/1.png", stock: 8, active: true }
        ];
        renderizarProdutosAdmin();
    }
}

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
            salvarNoLocalStorage();
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
    
    // Limpar preview de imagens
    document.getElementById('image-preview').innerHTML = '';
    uploadedImages = [];
    selectedMainImage = null;
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
    
    // Limpar preview de imagens
    document.getElementById('image-preview').innerHTML = '';
    uploadedImages = [];
    selectedMainImage = null;
}

function salvarNoLocalStorage() {
    localStorage.setItem('granjaRecantoFelizData', JSON.stringify({
        products: produtos,
        lastUpdate: new Date().toISOString()
    }));
}

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

// Navegação entre seções
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Carregar conteúdo específico da seção
    if (sectionName === 'produtos') {
        carregarProdutosAdmin();
    } else if (sectionName === 'estoque') {
        loadEstoqueGrid();
    } else if (sectionName === 'layouts') {
        loadLayoutsGrid();
    }
}

// Carregar grid de estoque
function loadEstoqueGrid() {
    const estoqueGrid = document.getElementById('estoque-grid');
    if (!estoqueGrid) return;
    
    estoqueGrid.innerHTML = produtos.map(product => {
        const stockLevel = product.stock === 0 ? 'Sem estoque' : 
                          product.stock <= 10 ? 'Estoque baixo' : 
                          'Normal';
        
        const stockColor = product.stock === 0 ? 'bg-red-500' : 
                          product.stock <= 10 ? 'bg-yellow-500' : 
                          'bg-green-500';
        
        return `
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 ${stockColor}">
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
            </div>
        `;
    }).join('');
}

function adjustStock(productId, action) {
    const product = produtos.find(p => p.id === productId);
    if (!product) return;
    
    const amount = prompt('Quantidade:', '1');
    if (!amount || isNaN(amount)) return;
    
    if (action === 'add') {
        product.stock += parseInt(amount);
    } else if (action === 'remove') {
        product.stock = Math.max(0, product.stock - parseInt(amount));
    }
    
    salvarNoLocalStorage();
    loadEstoqueGrid();
    renderizarProdutosAdmin();
    alert(`Estoque ${action === 'add' ? 'adicionado' : 'removido'} com sucesso!`);
}

// Layouts básicos
function loadLayoutsGrid() {
    const layoutsGrid = document.getElementById('layouts-grid');
    if (!layoutsGrid) return;
    
    // Usar LayoutManager se disponível
    if (window.layoutManager) {
        const layouts = window.layoutManager.getLayouts();
        const activeLayout = window.layoutManager.getActiveLayout();
        
        layoutsGrid.innerHTML = layouts.map(layout => `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="font-bold text-lg mb-2">${layout.name}</h3>
                <p class="text-gray-600 mb-3">${layout.description}</p>
                <div class="mb-4">
                    <span class="text-sm text-gray-500">Cores: ${layout.colorScheme}</span><br>
                    <span class="text-sm text-gray-500">Fonte: ${layout.fontFamily}</span><br>
                    <span class="text-sm text-gray-500">Hero: ${layout.heroType}</span>
                </div>
                <button onclick="activateLayout('${layout.id}')" 
                        class="${layout.active ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded transition">
                    ${layout.active ? 'Ativo' : 'Ativar'}
                </button>
            </div>
        `).join('');
    } else {
        // Fallback se LayoutManager não estiver disponível
        layoutsGrid.innerHTML = `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="font-bold text-lg mb-4">Layout Padrão</h3>
                <p class="text-gray-600 mb-4">Layout padrão da Granja Recanto Feliz</p>
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Ativo
                </button>
            </div>
        `;
    }
}

// Variáveis para upload de imagens
let uploadedImages = [];
let selectedMainImage = null;

// Função para processar upload de imagens
function handleImageUpload(files) {
    const preview = document.getElementById('image-preview');
    uploadedImages = [];
    preview.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                uploadedImages.push({
                    name: file.name,
                    data: imageData,
                    isMain: index === 0 // Primeira imagem é a principal por padrão
                });
                
                // Criar preview
                const imgContainer = document.createElement('div');
                imgContainer.className = 'relative cursor-pointer border-2 border-gray-300 rounded hover:border-blue-500';
                imgContainer.onclick = () => setMainImage(index);
                
                imgContainer.innerHTML = `
                    <img src="${imageData}" class="w-full h-20 object-cover rounded">
                    <div class="absolute top-1 right-1 ${index === 0 ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs px-1 rounded">
                        ${index === 0 ? 'Principal' : 'Extra'}
                    </div>
                `;
                
                preview.appendChild(imgContainer);
                
                if (index === 0) {
                    selectedMainImage = imageData;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Função para definir imagem principal
function setMainImage(index) {
    uploadedImages.forEach((img, i) => {
        img.isMain = i === index;
    });
    
    selectedMainImage = uploadedImages[index].data;
    
    // Atualizar preview
    const preview = document.getElementById('image-preview');
    const containers = preview.querySelectorAll('div');
    containers.forEach((container, i) => {
        const badge = container.querySelector('div');
        if (i === index) {
            badge.className = 'absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded';
            badge.textContent = 'Principal';
        } else {
            badge.className = 'absolute top-1 right-1 bg-gray-500 text-white text-xs px-1 rounded';
            badge.textContent = 'Extra';
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Carregar produtos inicialmente
    carregarProdutosAdmin();
    
    // Upload de imagens
    const imageInput = document.getElementById('product-images');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleImageUpload(e.target.files);
            }
        });
    }
    
    // Form de produto
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
            
            // Adicionar imagem
            if (selectedMainImage) {
                produtoData.image = selectedMainImage; // Usar a imagem em base64
            }
            
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
                    image: selectedMainImage || `imagens/produtos/${novoId}/1.png`,
                    ...produtoData
                });
                alert('Produto adicionado!');
            }
            
            salvarNoLocalStorage();
            renderizarProdutosAdmin();
            closeProductModal();
            
            // Limpar upload
            uploadedImages = [];
            selectedMainImage = null;
            document.getElementById('image-preview').innerHTML = '';
        });
    }
});

// Funções para gerenciar layouts
function activateLayout(layoutId) {
    if (window.layoutManager) {
        const success = window.layoutManager.activateLayout(layoutId);
        if (success) {
            // Aplicar o tema imediatamente
            window.layoutManager.applyTheme(layoutId);
            
            // Recarregar a grid para mostrar o novo estado
            loadLayoutsGrid();
            
            // Mostrar mensagem de sucesso
            showNotification('Layout ativado com sucesso!', 'success');
        } else {
            showNotification('Erro ao ativar layout', 'error');
        }
    } else {
        showNotification('LayoutManager não disponível', 'error');
    }
}

function updateLayoutsFromDefaults() {
    if (window.layoutManager) {
        const success = window.layoutManager.resetToDefault();
        if (success) {
            loadLayoutsGrid();
            showNotification('Layouts atualizados com os padrões!', 'success');
        } else {
            showNotification('Erro ao atualizar layouts', 'error');
        }
    } else {
        showNotification('LayoutManager não disponível', 'error');
    }
}

function checkAutoLayouts() {
    if (window.layoutManager) {
        const layouts = window.layoutManager.getLayouts();
        const activeLayout = window.layoutManager.getActiveLayout();
        
        showNotification(`${layouts.length} layouts disponíveis. Ativo: ${activeLayout.name}`, 'info');
    } else {
        showNotification('LayoutManager não disponível', 'error');
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">
                ×
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ================================
// SEÇÃO DO CARROSSEL
// ================================

// Carregar slides do carrossel
function loadCarouselSlides() {
    console.log('🎠 Carregando slides do carrossel...');
    
    const grid = document.getElementById('carousel-slides-grid');
    if (!grid) return;
    
    // Slides padrão do carrossel
    const defaultSlides = [
        {
            id: 1,
            title: 'Ovos Caipira Frescos',
            description: 'Direto da nossa granja para sua mesa',
            image: 'imagens/carrocel/ovos-caipira.png',
            active: true
        },
        {
            id: 2,
            title: 'Galinhas Caipira',
            description: 'Criadas com amor e cuidado no campo',
            image: 'imagens/carrocel/galinhas-caipira.png',
            active: true
        },
        {
            id: 3,
            title: 'Agricultura Familiar',
            description: 'Tradição e qualidade há gerações',
            image: 'imagens/carrocel/agricultura-familiar.png',
            active: true
        },
        {
            id: 4,
            title: 'Adubo Orgânico',
            description: 'Para um cultivo mais natural e sustentável',
            image: 'imagens/carrocel/adubo-organico.png',
            active: true
        }
    ];
    
    // Verificar se há slides salvos no localStorage
    let slides = defaultSlides;
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        console.log('⚠️ Usando slides padrão do carrossel');
    }
    
    // Renderizar slides
    grid.innerHTML = slides.map(slide => `
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <div class="relative">
                <img src="${slide.image}" alt="${slide.title}" class="w-full h-48 object-cover" onerror="this.src='imagens/LOGO 2023.jpg'">
                <div class="absolute top-2 right-2">
                    <span class="px-2 py-1 text-xs rounded-full ${slide.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${slide.active ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-gray-800 mb-2">${slide.title}</h3>
                <p class="text-gray-600 text-sm mb-4">${slide.description}</p>
                <div class="flex space-x-2">
                    <button onclick="editCarouselSlide(${slide.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-edit mr-1"></i>Editar
                    </button>
                    <button onclick="toggleSlideStatus(${slide.id})" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-toggle-${slide.active ? 'on' : 'off'} mr-1"></i>${slide.active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button onclick="deleteCarouselSlide(${slide.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                        <i class="fas fa-trash mr-1"></i>Excluir
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log(`✅ ${slides.length} slides carregados`);
}

function addCarouselSlide() {
    const title = prompt('Título do slide:');
    if (!title) return;
    
    const description = prompt('Descrição do slide:');
    if (!description) return;
    
    const image = prompt('URL/caminho da imagem (deixe em branco para usar padrão):') || 'imagens/LOGO 2023.jpg';
    
    // Buscar slides existentes
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        slides = [];
    }
    
    // Criar novo slide
    const newSlide = {
        id: Math.max(...slides.map(s => s.id || 0)) + 1,
        title: title,
        description: description,
        image: image,
        active: true
    };
    
    slides.push(newSlide);
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification('Slide adicionado com sucesso!', 'success');
}

function editCarouselSlide(id) {
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        showNotification('Erro ao carregar slides', 'error');
        return;
    }
    
    const slide = slides.find(s => s.id === id);
    if (!slide) {
        showNotification('Slide não encontrado', 'error');
        return;
    }
    
    const newTitle = prompt('Novo título:', slide.title);
    if (newTitle === null) return;
    
    const newDescription = prompt('Nova descrição:', slide.description);
    if (newDescription === null) return;
    
    const newImage = prompt('Nova imagem:', slide.image);
    if (newImage === null) return;
    
    // Atualizar slide
    slide.title = newTitle;
    slide.description = newDescription;
    slide.image = newImage;
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification('Slide atualizado com sucesso!', 'success');
}

function toggleSlideStatus(id) {
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        showNotification('Erro ao carregar slides', 'error');
        return;
    }
    
    const slide = slides.find(s => s.id === id);
    if (!slide) {
        showNotification('Slide não encontrado', 'error');
        return;
    }
    
    slide.active = !slide.active;
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification(`Slide ${slide.active ? 'ativado' : 'desativado'} com sucesso!`, 'success');
}

function deleteCarouselSlide(id) {
    if (!confirm('Tem certeza que deseja excluir este slide?')) return;
    
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        showNotification('Erro ao carregar slides', 'error');
        return;
    }
    
    slides = slides.filter(s => s.id !== id);
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification('Slide excluído com sucesso!', 'success');
}

function previewCarousel() {
    window.open('index.html#carrossel', '_blank');
}

function loadDefaultCarouselSlides() {
    if (!confirm('Isso irá substituir todos os slides atuais pelos padrões. Continuar?')) return;
    
    localStorage.removeItem('carouselSlides');
    loadCarouselSlides();
    showNotification('Slides padrão restaurados!', 'success');
}

// Inicializar admin quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Admin carregado');
    carregarProdutosAdmin();
    
    // Mostrar seção de produtos por padrão
    showSection('produtos');
});
            </div>
        </div>
    `).join('');
    
    console.log(`✅ ${slides.length} slides carregados`);
}

function addCarouselSlide() {
    const title = prompt('Título do slide:');
    if (!title) return;
    
    const description = prompt('Descrição do slide:');
    if (!description) return;
    
    const image = prompt('URL/caminho da imagem (deixe em branco para usar padrão):') || 'imagens/LOGO 2023.jpg';
    
    // Buscar slides existentes
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        slides = [];
    }
    
    // Criar novo slide
    const newSlide = {
        id: Math.max(...slides.map(s => s.id || 0)) + 1,
        title: title,
        description: description,
        image: image,
        active: true
    };
    
    slides.push(newSlide);
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification('Slide adicionado com sucesso!', 'success');
}

function editCarouselSlide(id) {
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        showNotification('Erro ao carregar slides', 'error');
        return;
    }
    
    const slide = slides.find(s => s.id === id);
    if (!slide) {
        showNotification('Slide não encontrado', 'error');
        return;
    }
    
    const newTitle = prompt('Novo título:', slide.title);
    if (newTitle === null) return;
    
    const newDescription = prompt('Nova descrição:', slide.description);
    if (newDescription === null) return;
    
    const newImage = prompt('Nova imagem:', slide.image);
    if (newImage === null) return;
    
    // Atualizar slide
    slide.title = newTitle;
    slide.description = newDescription;
    slide.image = newImage;
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification('Slide atualizado com sucesso!', 'success');
}

function toggleSlideStatus(id) {
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        showNotification('Erro ao carregar slides', 'error');
        return;
    }
    
    const slide = slides.find(s => s.id === id);
    if (!slide) {
        showNotification('Slide não encontrado', 'error');
        return;
    }
    
    slide.active = !slide.active;
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification(`Slide ${slide.active ? 'ativado' : 'desativado'} com sucesso!`, 'success');
}

function deleteCarouselSlide(id) {
    if (!confirm('Tem certeza que deseja excluir este slide?')) return;
    
    let slides = [];
    try {
        const savedSlides = localStorage.getItem('carouselSlides');
        if (savedSlides) {
            slides = JSON.parse(savedSlides);
        }
    } catch (e) {
        showNotification('Erro ao carregar slides', 'error');
        return;
    }
    
    slides = slides.filter(s => s.id !== id);
    
    // Salvar no localStorage
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
    
    // Recarregar grid
    loadCarouselSlides();
    showNotification('Slide excluído com sucesso!', 'success');
}

function previewCarousel() {
    window.open('index.html#carrossel', '_blank');
}

function loadDefaultCarouselSlides() {
    if (!confirm('Isso irá substituir todos os slides atuais pelos padrões. Continuar?')) return;
    
    localStorage.removeItem('carouselSlides');
    loadCarouselSlides();
    showNotification('Slides padrão restaurados!', 'success');
}

// Inicializar admin quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Admin carregado');
    carregarProdutosAdmin();
    
    // Mostrar seção de produtos por padrão
    showSection('produtos');
});
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Tornar funções globais
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.salvarProdutosDefinitivo = salvarProdutosDefinitivo;
window.showSection = showSection;
window.adjustStock = adjustStock;
window.activateLayout = activateLayout;
window.updateLayoutsFromDefaults = updateLayoutsFromDefaults;
window.checkAutoLayouts = checkAutoLayouts;