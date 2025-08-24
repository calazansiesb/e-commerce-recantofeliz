// Script de backup simplificado
console.log('🚀 Carregando script de backup...');

// Produtos básicos
const produtos = [
    {id: 1, name: "Substrato BioFértil 3 Anos", category: "fertilizantes", slogan: "Substrato vivo e completo", price: 15, image: "imagens/produtos/1.1.png"},
    {id: 2, name: "FertiGota", category: "fertilizantes", slogan: "Adubo líquido potente", price: 5, image: "imagens/produtos/2.1.png"},
    {id: 3, name: "Ovos Caipira 10", category: "ovos", slogan: "10 ovos frescos", price: 15, image: "imagens/produtos/3.1.jpeg"},
    {id: 9, name: "Queijo Minas Artesanal", category: "laticinios", slogan: "Sabor autêntico", price: 37, image: "imagens/produtos/9.1.png"}
];

// Renderizar produtos
function renderizarProdutos() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = produtos.map(p => `
        <div class="product-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl">
            <img src="${p.image}" alt="${p.name}" class="w-40 h-40 object-cover rounded-lg mb-4" onerror="this.src='imagens/produtos/default/placeholder.png'">
            <h3 class="text-xl font-bold mb-2 font-lora">${p.name}</h3>
            <p class="text-gray-600 mb-4 flex-grow">${p.slogan}</p>
            <span class="text-xl font-bold text-[#5D4037] mb-4">R$ ${p.price.toFixed(2)}</span>
            <button class="detail-btn bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-4 rounded-lg transition w-full" data-id="${p.id}">
                <i class="fas fa-shopping-cart mr-2"></i>Comprar
            </button>
        </div>
    `).join('');
    console.log('✅ Produtos renderizados');
}

// Carrossel
let currentSlide = 0;
let carouselInterval;

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!slides.length) return;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
            slide.classList.toggle('active', i === index);
        });
        
        indicators.forEach((indicator, i) => {
            indicator.style.backgroundColor = i === index ? 'white' : 'rgba(255, 255, 255, 0.5)';
            indicator.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }
    
    // Auto-play
    carouselInterval = setInterval(nextSlide, 8000);
    
    // Controles
    const nextBtn = document.getElementById('next-slide');
    const prevBtn = document.getElementById('prev-slide');
    
    if (nextBtn) nextBtn.onclick = () => {
        clearInterval(carouselInterval);
        nextSlide();
        carouselInterval = setInterval(nextSlide, 8000);
    };
    
    if (prevBtn) prevBtn.onclick = () => {
        clearInterval(carouselInterval);
        showSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
        carouselInterval = setInterval(nextSlide, 8000);
    };
    
    // Indicadores
    indicators.forEach((indicator, index) => {
        indicator.onclick = () => {
            clearInterval(carouselInterval);
            showSlide(index);
            carouselInterval = setInterval(nextSlide, 8000);
        };
    });
    
    showSlide(0);
    console.log('✅ Carrossel inicializado');
}

// Modal de produto
function openProductModal(productId) {
    const produto = produtos.find(p => p.id == productId);
    if (!produto) return;
    
    const modal = document.getElementById('product-modal');
    const content = modal.querySelector('#modal-content-grid');
    
    content.innerHTML = `
        <div class="p-6">
            <img src="${produto.image}" alt="${produto.name}" class="w-full h-80 object-cover rounded-lg">
        </div>
        <div class="p-6">
            <h3 class="text-3xl font-bold mb-4 font-lora text-[#5D4037]">${produto.name}</h3>
            <p class="text-gray-600 mb-6">${produto.slogan}</p>
            <span class="text-2xl font-bold text-[#5D4037] mb-6 block">R$ ${produto.price.toFixed(2)}</span>
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2">Quantidade:</label>
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('qty').value = Math.max(1, parseInt(document.getElementById('qty').value) - 1)" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input id="qty" type="number" value="1" min="1" class="w-20 text-center border rounded py-2">
                    <button onclick="document.getElementById('qty').value = parseInt(document.getElementById('qty').value) + 1" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button onclick="adicionarAoCarrinho({id: ${produto.id}, name: '${produto.name}', price: ${produto.price}}, parseInt(document.getElementById('qty').value)); document.getElementById('product-modal').classList.add('hidden');" class="w-full bg-[#4CAF50] hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">
                <i class="fas fa-cart-plus mr-2"></i>Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

// Sistema de carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function adicionarAoCarrinho(produto, quantidade = 1) {
    for (let i = 0; i < quantidade; i++) {
        carrinho.push(produto);
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    updateCartCounter();
    
    // Notificação
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.innerHTML = `<i class="fas fa-check mr-2"></i>${quantidade}x ${produto.name} adicionado!`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

function updateCartCounter() {
    const counter = document.getElementById('cart-count');
    const total = document.getElementById('cart-total-display');
    
    if (counter) counter.textContent = carrinho.length;
    if (total) {
        const valorTotal = carrinho.reduce((sum, item) => sum + item.price, 0);
        total.textContent = `R$ ${valorTotal.toFixed(2)}`;
    }
}

// Filtros
window.filterProducts = function(category) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    let filtered = produtos;
    
    if (category === 'granja') {
        filtered = produtos.filter(p => ['fertilizantes', 'aves', 'ovos'].includes(p.category));
    } else if (category === 'parceiros') {
        filtered = produtos.filter(p => ['mel', 'laticinios', 'parceiros'].includes(p.category));
    } else if (category !== 'all') {
        filtered = produtos.filter(p => p.category === category);
    }
    
    grid.innerHTML = filtered.map(p => `
        <div class="product-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl">
            <img src="${p.image}" alt="${p.name}" class="w-40 h-40 object-cover rounded-lg mb-4" onerror="this.src='imagens/produtos/default/placeholder.png'">
            <h3 class="text-xl font-bold mb-2 font-lora">${p.name}</h3>
            <p class="text-gray-600 mb-4 flex-grow">${p.slogan}</p>
            <span class="text-xl font-bold text-[#5D4037] mb-4">R$ ${p.price.toFixed(2)}</span>
            <button class="detail-btn bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-4 rounded-lg transition w-full" data-id="${p.id}">
                <i class="fas fa-shopping-cart mr-2"></i>Comprar
            </button>
        </div>
    `).join('');
};

window.setActiveButton = function(button) {
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
};

// Modais
window.openSustainabilityModal = () => {
    document.getElementById('sustainability-modal').classList.remove('hidden');
    document.getElementById('sustainability-modal').style.display = 'flex';
};

window.closeSustainabilityModal = () => {
    document.getElementById('sustainability-modal').classList.add('hidden');
    document.getElementById('sustainability-modal').style.display = 'none';
};

window.openEggsModal = () => {
    document.getElementById('eggs-modal').classList.remove('hidden');
    document.getElementById('eggs-modal').style.display = 'flex';
};

window.closeEggsModal = () => {
    document.getElementById('eggs-modal').classList.add('hidden');
    document.getElementById('eggs-modal').style.display = 'none';
};

window.openDeliveryModal = () => {
    document.getElementById('delivery-modal').classList.remove('hidden');
    document.getElementById('delivery-modal').style.display = 'flex';
};

window.closeDeliveryModal = () => {
    document.getElementById('delivery-modal').classList.add('hidden');
    document.getElementById('delivery-modal').style.display = 'none';
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando...');
    
    renderizarProdutos();
    setTimeout(initCarousel, 100);
    updateCartCounter();
    
    // Event listeners
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.detail-btn');
        if (button) {
            openProductModal(parseInt(button.getAttribute('data-id')));
        }
        
        if (e.target.id === 'close-modal-btn' || e.target.closest('#close-modal-btn')) {
            document.getElementById('product-modal').classList.add('hidden');
        }
    });
    
    console.log('✅ Sistema inicializado');
});

console.log('✅ Script de backup carregado');