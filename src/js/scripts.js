// Sistema de Carrossel
let currentSlide = 0;
let carouselInterval;

document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initProducts();
});

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    if (!slides.length) {
        console.log('Nenhum slide encontrado');
        return;
    }
    
    console.log(`Inicializando carrossel com ${slides.length} slides`);
    
    // Garantir que o primeiro slide está ativo
    updateCarousel();
    
    // Auto-play do carrossel (5 segundos)
    carouselInterval = setInterval(() => {
        nextSlide();
    }, 5000);
    
    // Controles manuais
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearInterval(carouselInterval);
            nextSlide();
            restartAutoPlay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearInterval(carouselInterval);
            prevSlide();
            restartAutoPlay();
        });
    }
    
    // Indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            clearInterval(carouselInterval);
            goToSlide(index);
            restartAutoPlay();
        });
    });
    
    // Pausar no hover
    const carousel = document.getElementById('hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            restartAutoPlay();
        });
    }
    
    console.log('Carrossel inicializado com sucesso');
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlide = (currentSlide + 1) % slides.length;
    console.log(`Próximo slide: ${currentSlide}`);
    updateCarousel();
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    console.log(`Slide anterior: ${currentSlide}`);
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    console.log(`Indo para slide: ${currentSlide}`);
    updateCarousel();
}

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    console.log(`Atualizando carrossel - slide ativo: ${currentSlide}`);
    
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
            slide.style.opacity = '1';
            slide.style.zIndex = '2';
        } else {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.zIndex = '1';
        }
    });
    
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
            indicator.style.backgroundColor = 'white';
            indicator.style.transform = 'scale(1.2)';
        } else {
            indicator.classList.remove('active');
            indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            indicator.style.transform = 'scale(1)';
        }
    });
}

function restartAutoPlay() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

// Sistema de Produtos
function initProducts() {
    const products = window.dataManager ? window.dataManager.getActiveProducts() : [];
    const productGrid = document.getElementById('product-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!productGrid) return;
    
    console.log('Inicializando produtos:', products.length);
    
    // Renderizar produtos
    function renderProducts(filter = 'all') {
        productGrid.innerHTML = '';
        let filtered = products;
        
        if (filter !== 'all') {
            if (filter === 'granja') {
                filtered = products.filter(p => p.category !== 'parceiros');
            } else {
                filtered = products.filter(p => p.category === filter);
            }
        }
        
        if (filtered.length === 0) {
            productGrid.innerHTML = '<p class="col-span-4 text-center text-gray-500">Nenhum produto encontrado.</p>';
            return;
        }
        
        filtered.forEach(product => {
            const partnerBadge = product.partner ? `
                <div class="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <i class="fas fa-handshake mr-1"></i> Parceiro
                </div>
            ` : '';
            
            const partnerInfo = product.partner ? `
                <div class="text-sm text-blue-600 mb-2">
                    <i class="fas fa-user mr-1"></i> ${product.partner.producer}
                </div>
            ` : '';
            
            productGrid.innerHTML += `
                <div class="product-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl relative">
                    ${partnerBadge}
                    <img src="${product.image}" alt="${product.name}" class="w-40 h-40 object-cover rounded-lg mb-4" onerror="this.src='imagens/produtos/default/placeholder.png'">
                    <h3 class="text-xl font-bold mb-2 font-lora">${product.name}</h3>
                    ${partnerInfo}
                    <p class="text-gray-600 mb-4 flex-grow">${product.slogan}</p>
                    <span class="text-xl font-bold text-[#5D4037] mb-4">R$ ${product.price.toFixed(2)}</span>
                    <button class="detail-btn bg-[#8B4513] hover:bg-[#5D4037] text-white font-bold py-2 px-4 rounded-lg transition w-full" data-id="${product.id}">Ver Detalhes</button>
                </div>
            `;
        });
    }
    
    // Event listeners para filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-[#8B4513]', 'text-white');
                b.classList.add('bg-white', 'text-[#8B4513]');
            });
            this.classList.add('active', 'bg-[#8B4513]', 'text-white');
            this.classList.remove('bg-white', 'text-[#8B4513]');
            renderProducts(this.getAttribute('data-filter'));
        });
    });
    
    // Renderizar todos os produtos inicialmente
    renderProducts('all');
}
