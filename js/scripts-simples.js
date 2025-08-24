// Scripts simplificados para o site principal
console.log('🚀 Carregando scripts simplificados...');

// Produtos padrão
const produtosPadrao = [
    {
        id: 1,
        name: "Substrato BioFértil 3 Anos",
        category: "fertilizantes",
        slogan: "Mais do que Adubo: um substrato vivo e completo.",
        description: "Com um processo de maturação de 3 anos, nosso substrato é uma terra viva e completa, rica em matéria orgânica e microrganismos benéficos.",
        price: 15,
        image: "imagens/produtos/1.1.png",
        stock: 25,
        active: true
    },
    {
        id: 2,
        name: "FertiGota",
        category: "fertilizantes",
        slogan: "Adubo de galinha líquido e potente.",
        description: "Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas.",
        price: 5,
        image: "imagens/produtos/2.1.png",
        stock: 40,
        active: true
    },
    {
        id: 3,
        name: "Ovos Caipira 10",
        category: "ovos",
        slogan: "10 ovos frescos da granja.",
        description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 10 unidades.",
        price: 15,
        image: "imagens/produtos/3.1.jpeg",
        stock: 120,
        active: true
    },
    {
        id: 9,
        name: "Queijo Minas Artesanal",
        category: "laticinios",
        slogan: "Sabor autêntico da tradição mineira.",
        description: "Produzido com leite fresco e técnicas centenárias, nosso Queijo Minas Artesanal tem textura macia e sabor inconfundível.",
        price: 37,
        image: "imagens/produtos/9.1.png",
        stock: 20,
        active: true
    }
];

let produtos = [];
let currentSlide = 0;
let carouselInterval;

// Carregar produtos
async function carregarProdutos() {
    try {
        const response = await fetch('dados/produtos.json');
        if (response.ok) {
            const data = await response.json();
            produtos = data.products || produtosPadrao;
        } else {
            produtos = produtosPadrao;
        }
    } catch (error) {
        console.log('⚠️ Usando produtos padrão');
        produtos = produtosPadrao;
    }
    
    console.log(`✅ ${produtos.length} produtos carregados`);
    renderizarProdutos();
}

// Renderizar produtos
function renderizarProdutos() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = produtos.map(produto => `
        <div class="product-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl">
            <img src="${produto.image}" alt="${produto.name}" class="w-40 h-40 object-cover rounded-lg mb-4" onerror="this.src='imagens/produtos/default/placeholder.png'">
            <h3 class="text-xl font-bold mb-2 font-lora">${produto.name}</h3>
            <p class="text-gray-600 mb-4 flex-grow">${produto.slogan}</p>
            <span class="text-xl font-bold text-[#5D4037] mb-4">R$ ${produto.price.toFixed(2)}</span>
            <button class="detail-btn bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-4 rounded-lg transition w-full" data-id="${produto.id}">
                <i class="fas fa-shopping-cart mr-2"></i>Comprar
            </button>
        </div>
    `).join('');
}

// Sistema de filtros
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
    
    grid.innerHTML = filtered.map(produto => `
        <div class="product-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl">
            <img src="${produto.image}" alt="${produto.name}" class="w-40 h-40 object-cover rounded-lg mb-4" onerror="this.src='imagens/produtos/default/placeholder.png'">
            <h3 class="text-xl font-bold mb-2 font-lora">${produto.name}</h3>
            <p class="text-gray-600 mb-4 flex-grow">${produto.slogan}</p>
            <span class="text-xl font-bold text-[#5D4037] mb-4">R$ ${produto.price.toFixed(2)}</span>
            <button class="detail-btn bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-4 rounded-lg transition w-full" data-id="${produto.id}">
                <i class="fas fa-shopping-cart mr-2"></i>Comprar
            </button>
        </div>
    `).join('');
    
    console.log(`✅ Filtro ${category}: ${filtered.length} produtos`);
};

// Ativar botão de filtro
window.setActiveButton = function(button) {
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
};

// Sistema de carrossel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    if (!slides.length) return;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
                slide.style.opacity = '1';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            }
        });
        
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
                indicator.style.backgroundColor = 'white';
            } else {
                indicator.classList.remove('active');
                indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            }
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
    }
    
    function prevSlide() {
        const newIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(newIndex);
    }
    
    // Auto-play
    carouselInterval = setInterval(nextSlide, 8000);
    
    // Controles
    if (nextBtn) nextBtn.addEventListener('click', () => {
        clearInterval(carouselInterval);
        nextSlide();
        carouselInterval = setInterval(nextSlide, 8000);
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        clearInterval(carouselInterval);
        prevSlide();
        carouselInterval = setInterval(nextSlide, 8000);
    });
    
    // Indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(carouselInterval);
            showSlide(index);
            carouselInterval = setInterval(nextSlide, 8000);
        });
    });
    
    // Mostrar primeiro slide
    showSlide(0);
    console.log('✅ Carrossel inicializado');
}

// Sistema de carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

window.adicionarAoCarrinho = function(produto) {
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    updateCartCounter();
    
    // Notificação
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.innerHTML = `<i class="fas fa-check mr-2"></i>${produto.name} adicionado!`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
};

function updateCartCounter() {
    const counter = document.getElementById('cart-count');
    const total = document.getElementById('cart-total-display');
    
    if (counter) counter.textContent = carrinho.length;
    if (total) {
        const valorTotal = carrinho.reduce((sum, item) => sum + item.price, 0);
        total.textContent = `R$ ${valorTotal.toFixed(2)}`;
    }
}

// Função para descobrir imagens do produto
async function discoverProductImages(productId) {
    const gallery = [];
    const extensions = ['png', 'jpeg', 'jpg'];
    
    for (let i = 1; i <= 5; i++) {
        let found = false;
        for (const ext of extensions) {
            const imagePath = `imagens/produtos/${productId}.${i}.${ext}`;
            try {
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => { gallery.push(imagePath); found = true; resolve(); };
                    img.onerror = reject;
                    img.src = imagePath;
                });
                break;
            } catch (e) { continue; }
        }
        if (!found) break;
    }
    
    return gallery.length > 0 ? gallery : [produtos.find(p => p.id == productId)?.image || 'imagens/produtos/default/placeholder.png'];
}

// Modal de produto com múltiplas imagens
async function openProductModal(productId) {
    const produto = produtos.find(p => p.id == productId);
    if (!produto) return;
    
    // Descobrir todas as imagens do produto
    const gallery = await discoverProductImages(productId);
    
    const modal = document.getElementById('product-modal');
    const content = modal.querySelector('#modal-content-grid');
    
    content.innerHTML = `
        <div class="p-6 relative">
            <div id="carousel-container" class="relative overflow-hidden rounded-lg">
                <div id="carousel-track" class="flex transition-transform duration-300 ease-in-out">
                    ${gallery.map((imgSrc, index) => `
                        <div class="w-full flex-shrink-0">
                            <img src="${imgSrc}" alt="${produto.name} - ${index + 1}" class="w-full h-80 object-cover">
                        </div>
                    `).join('')}
                </div>
                ${gallery.length > 1 ? `
                    <button id="prev-btn" class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button id="next-btn" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        ${gallery.map((_, index) => `
                            <div class="carousel-dot w-2 h-2 rounded-full bg-white/50 cursor-pointer hover:bg-white transition" data-index="${index}"></div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
        <div class="p-6">
            <h3 class="text-3xl font-bold mb-4 font-lora text-[#5D4037]">${produto.name}</h3>
            <p class="text-gray-600 mb-6">${produto.description}</p>
            <span class="text-2xl font-bold text-[#5D4037] mb-6 block">R$ ${produto.price.toFixed(2)}</span>
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2">Quantidade:</label>
                <div class="flex items-center space-x-3">
                    <button id="qty-minus" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input id="product-quantity" type="number" value="1" min="1" class="w-20 text-center border rounded py-2">
                    <button id="qty-plus" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button id="add-to-cart-modal" class="w-full bg-[#4CAF50] hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">
                <i class="fas fa-cart-plus mr-2"></i>Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    // Implementar carrossel de imagens
    let currentIndex = 0;
    const track = content.querySelector('#carousel-track');
    const dots = content.querySelectorAll('.carousel-dot');
    const prevBtn = content.querySelector('#prev-btn');
    const nextBtn = content.querySelector('#next-btn');
    
    function updateCarousel() {
        if (track) track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('bg-white', index === currentIndex);
            dot.classList.toggle('bg-white/50', index !== currentIndex);
        });
    }
    
    if (prevBtn) prevBtn.onclick = () => { currentIndex = currentIndex === 0 ? gallery.length - 1 : currentIndex - 1; updateCarousel(); };
    if (nextBtn) nextBtn.onclick = () => { currentIndex = currentIndex === gallery.length - 1 ? 0 : currentIndex + 1; updateCarousel(); };
    dots.forEach((dot, index) => { dot.onclick = () => { currentIndex = index; updateCarousel(); }; });
    
    // Controles de quantidade
    const qtyMinus = content.querySelector('#qty-minus');
    const qtyPlus = content.querySelector('#qty-plus');
    const qtyInput = content.querySelector('#product-quantity');
    
    if (qtyMinus) qtyMinus.onclick = () => { if (qtyInput.value > 1) qtyInput.value = parseInt(qtyInput.value) - 1; };
    if (qtyPlus) qtyPlus.onclick = () => { qtyInput.value = parseInt(qtyInput.value) + 1; };
    
    // Adicionar ao carrinho
    const addBtn = content.querySelector('#add-to-cart-modal');
    if (addBtn) addBtn.onclick = () => {
        const qty = parseInt(qtyInput.value);
        for (let i = 0; i < qty; i++) {
            adicionarAoCarrinho({id: produto.id, name: produto.name, price: produto.price});
        }
        modal.classList.add('hidden');
    };
    
    updateCarousel();
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando site...');
    
    // Carregar produtos
    carregarProdutos();
    
    // Inicializar carrossel
    setTimeout(initCarousel, 100);
    
    // Event delegation para botões de comprar
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.detail-btn');
        if (button) {
            const productId = parseInt(button.getAttribute('data-id'));
            openProductModal(productId);
        }
        
        // Fechar modal
        if (e.target.id === 'close-modal-btn' || e.target.closest('#close-modal-btn')) {
            document.getElementById('product-modal').classList.add('hidden');
        }
    });
    
    // Atualizar contador do carrinho
    updateCartCounter();
    
    console.log('✅ Site inicializado');
});

// Tornar função global
window.openProductModal = openProductModal;

// Sistema de frete - VERSÃO SIMPLIFICADA
window.verificarFrete = function() {
    const cep = document.getElementById('cep-frete').value.replace(/\D/g, '');
    const resultadoDiv = document.getElementById('frete-resultado');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const deliveryFeeSpan = document.getElementById('delivery-fee');
    const cartTotalSpan = document.getElementById('cart-total');
    
    if (cep.length !== 8) {
        resultadoDiv.innerHTML = '<p class="text-red-600 text-sm">Por favor, digite um CEP válido com 8 dígitos.</p>';
        resultadoDiv.style.display = 'block';
        return;
    }
    
    const subtotal = carrinho.reduce((sum, item) => sum + item.price, 0);
    
    // CEPs de Brasília/DF com frete grátis
    const cepsBrasilia = {
        '70000': true, '70001': true, '70002': true, '70003': true, '70004': true, '70005': true,
        '70710': true, '70711': true, '70712': true, '70713': true, '70714': true, '70715': true,
        '71600': true, '71601': true, '71602': true, '71603': true, '71604': true, '71605': true,
        '71680': true, '71681': true, '71682': true, '71683': true, '71684': true, '71685': true
    };
    
    const cepArea = cep.substring(0, 5);
    const cepNum = parseInt(cepArea);
    const isBrasilia = (cepNum >= 70000 && cepNum <= 72999) || (cepNum >= 73000 && cepNum <= 73699);
    const isFreteGratis = cepsBrasilia[cepArea] === true;
    
    let mensagem = '';
    let valorFrete = 0;
    
    if (!isBrasilia) {
        mensagem = '<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"><strong>⚠️ Não entregamos nesta região</strong><br><small>Entregamos apenas em Brasília/DF</small></div>';
        valorFrete = 0;
    } else if (isFreteGratis && subtotal >= 100) {
        mensagem = '<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"><strong>🎉 Frete Grátis!</strong><br><small>Asa Sul, Asa Norte, Lago Sul ou Jardim Botânico + compra acima de R$ 100,00</small></div>';
        valorFrete = 0;
    } else if (isFreteGratis && subtotal < 100) {
        mensagem = `<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded"><strong>📦 Taxa de Entrega: R$ 8,00</strong><br><small>Frete grátis em Asa Sul, Asa Norte, Lago Sul e Jardim Botânico apenas para compras acima de R$ 100,00</small></div>`;
        valorFrete = 8.00;
    } else {
        mensagem = '<div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded"><strong>🚚 Entrega com Taxa</strong><br><small>Taxa será combinada via WhatsApp</small></div>';
        valorFrete = 0;
    }
    
    if (deliveryFeeSpan) {
        if (valorFrete === 0 && isFreteGratis && subtotal >= 100) {
            deliveryFeeSpan.textContent = 'Grátis';
        } else if (valorFrete > 0) {
            deliveryFeeSpan.textContent = `R$ ${valorFrete.toFixed(2)}`;
        } else if (isBrasilia && !isFreteGratis) {
            deliveryFeeSpan.textContent = 'A combinar';
        } else {
            deliveryFeeSpan.textContent = 'Não disponível';
        }
    }
    
    const totalFinal = subtotal + valorFrete;
    if (cartTotalSpan) {
        if (isBrasilia && !isFreteGratis && valorFrete === 0) {
            cartTotalSpan.textContent = `R$ ${subtotal.toFixed(2)} + frete`;
        } else {
            cartTotalSpan.textContent = `R$ ${totalFinal.toFixed(2)}`;
        }
    }
    
    resultadoDiv.innerHTML = mensagem;
    resultadoDiv.style.display = 'block';
    
    if (btnFinalizar && isBrasilia) {
        btnFinalizar.disabled = false;
        btnFinalizar.className = 'w-full bg-[#25D366] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center cursor-pointer';
    }
};

// Modal do carrinho
window.updateCartModal = function() {
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotalEl = document.getElementById('cart-total');
    
    if (!cartItems) return;
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500">Seu carrinho está vazio.</p>';
        if (cartSubtotal) cartSubtotal.textContent = 'R$ 0,00';
        if (cartTotalEl) cartTotalEl.textContent = 'R$ 0,00';
        return;
    }
    
    const total = carrinho.reduce((sum, item) => sum + item.price, 0);
    
    cartItems.innerHTML = carrinho.map((item, index) => `
        <div class="flex justify-between items-center py-2 border-b">
            <div>
                <h4 class="font-semibold">${item.name}</h4>
                <p class="text-sm text-gray-600">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button onclick="removerDoCarrinho(${index})" class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    if (cartSubtotal) cartSubtotal.textContent = `R$ ${total.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `R$ ${total.toFixed(2)}`;
};

window.removerDoCarrinho = function(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    updateCartCounter();
    updateCartModal();
};

// Finalizar pedido via WhatsApp
window.finalizarViaWhatsApp = function() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    const total = carrinho.reduce((sum, item) => sum + item.price, 0);
    const numeroPedido = `RF${Date.now().toString().slice(-8)}`;
    
    let mensagem = `🥚 RECANTO FELIZ 🐔\\n\\n`;
    mensagem += `Pedido: ${numeroPedido}\\n\\n`;
    mensagem += `ITENS:\\n`;
    carrinho.forEach(item => {
        mensagem += `• ${item.name} - R$ ${item.price.toFixed(2)}\\n`;
    });
    mensagem += `\\nTotal: R$ ${total.toFixed(2)}\\n\\n`;
    mensagem += `Obrigado por escolher nossos produtos!`;
    
    const numeroWhatsApp = '5538999247376';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
    
    // Limpar carrinho
    carrinho = [];
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    updateCartCounter();
    updateCartModal();
    
    // Fechar modal
    document.getElementById('cart-modal').classList.add('hidden');
};

// Funções para modais
window.openSustainabilityModal = function() {
    document.getElementById('sustainability-modal').classList.remove('hidden');
    document.getElementById('sustainability-modal').style.display = 'flex';
};

window.closeSustainabilityModal = function() {
    document.getElementById('sustainability-modal').classList.add('hidden');
    document.getElementById('sustainability-modal').style.display = 'none';
};

window.openEggsModal = function() {
    document.getElementById('eggs-modal').classList.remove('hidden');
    document.getElementById('eggs-modal').style.display = 'flex';
};

window.closeEggsModal = function() {
    document.getElementById('eggs-modal').classList.add('hidden');
    document.getElementById('eggs-modal').style.display = 'none';
};

window.openDeliveryModal = function() {
    document.getElementById('delivery-modal').classList.remove('hidden');
    document.getElementById('delivery-modal').style.display = 'flex';
};

window.closeDeliveryModal = function() {
    document.getElementById('delivery-modal').classList.add('hidden');
    document.getElementById('delivery-modal').style.display = 'none';
};

// Funções para banner de frete
window.openFreteBanner = function() {
    document.getElementById('frete-banner-modal').classList.remove('hidden');
    document.getElementById('frete-banner-modal').style.display = 'flex';
};

window.closeFreteBanner = function() {
    document.getElementById('frete-banner-modal').classList.add('hidden');
    document.getElementById('frete-banner-modal').style.display = 'none';
};

// Fechar modal clicando fora
document.addEventListener('DOMContentLoaded', () => {
    const freteBannerModal = document.getElementById('frete-banner-modal');
    if (freteBannerModal) {
        freteBannerModal.addEventListener('click', (e) => {
            if (e.target === freteBannerModal) {
                closeFreteBanner();
            }
        });
    }
});

console.log('✅ Scripts simplificados carregados - VERSÃO ESTÁVEL');