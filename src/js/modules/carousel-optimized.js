// Carrossel Ultra-Leve - Otimizado para Performance
// Implementa lazy loading inteligente e GPU acceleration

class OptimizedCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.slides = [];
        this.currentSlide = 0;
        this.isPlaying = true;
        this.interval = null;
        this.observer = null;
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.slides = Array.from(this.container.querySelectorAll('.carousel-slide'));
        this.setupGPUAcceleration();
        this.setupIntersectionObserver();
        this.setupEventListeners();
        this.preloadCriticalSlides();
        this.startAutoPlay();
        
        console.log('🎠 Carrossel otimizado inicializado');
    }
    
    setupGPUAcceleration() {
        // Força GPU acceleration para transições suaves
        this.container.style.transform = 'translateZ(0)';
        this.container.style.willChange = 'transform';
        
        this.slides.forEach(slide => {
            slide.style.transform = 'translateZ(0)';
            slide.style.backfaceVisibility = 'hidden';
        });
    }
    
    setupIntersectionObserver() {
        // Pausa carrossel quando não está visível
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.resume();
                } else {
                    this.pause();
                }
            });
        }, { threshold: 0.1 });
        
        this.observer.observe(this.container);
    }
    
    preloadCriticalSlides() {
        // Carrega apenas slide atual e próximo
        this.loadSlide(this.currentSlide);
        this.loadSlide((this.currentSlide + 1) % this.slides.length);
    }
    
    loadSlide(index) {
        const slide = this.slides[index];
        if (!slide || slide.dataset.loaded) return;
        
        const img = slide.querySelector('img[data-src]');
        if (img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
        
        slide.dataset.loaded = 'true';
    }
    
    setupEventListeners() {
        // Touch otimizado para mobile
        let startX = 0;
        let isDragging = false;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pause();
        }, { passive: true });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        }, { passive: false });
        
        this.container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            isDragging = false;
            this.resume();
        }, { passive: true });
        
        // Controles de navegação
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prev();
                this.resetAutoPlay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.next();
                this.resetAutoPlay();
            });
        }
        
        // Indicadores
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goTo(index);
                this.resetAutoPlay();
            });
        });
    }
    
    next() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goTo(nextIndex);
    }
    
    prev() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goTo(prevIndex);
    }
    
    goTo(index) {
        if (index === this.currentSlide) return;
        
        // Preload próximo slide
        this.loadSlide(index);
        this.loadSlide((index + 1) % this.slides.length);
        
        // Transição otimizada
        this.slides[this.currentSlide].style.opacity = '0';
        this.slides[this.currentSlide].style.zIndex = '1';
        
        this.slides[index].style.opacity = '1';
        this.slides[index].style.zIndex = '2';
        
        this.currentSlide = index;
        this.updateIndicators();
    }
    
    updateIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
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
    
    startAutoPlay() {
        this.interval = setInterval(() => {
            if (this.isPlaying) {
                this.next();
            }
        }, 5000);
    }
    
    pause() {
        this.isPlaying = false;
    }
    
    resume() {
        this.isPlaying = true;
    }
    
    resetAutoPlay() {
        clearInterval(this.interval);
        this.startAutoPlay();
    }
    
    destroy() {
        if (this.interval) clearInterval(this.interval);
        if (this.observer) this.observer.disconnect();
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.optimizedCarousel = new OptimizedCarousel('hero-carousel');
});

// Exportar para uso global
window.OptimizedCarousel = OptimizedCarousel;