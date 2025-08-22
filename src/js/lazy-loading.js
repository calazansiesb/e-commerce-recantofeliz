// js/lazy-loading.js
class LazyLoader {
    constructor() {
        this.imageObserver = new IntersectionObserver(
            this.handleIntersection.bind(this),
            { rootMargin: '50px' }
        );
        this.init();
    }
    
    init() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.imageObserver.observe(img));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                this.loadImage(img);
                this.imageObserver.unobserve(img);
            }
        });
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;
        
        img.src = src;
        img.classList.add('loaded');
        
        img.onload = () => {
            img.classList.add('fade-in');
        };
        
        img.onerror = () => {
            img.src = 'imagens/placeholder.jpg'; // Fallback placeholder
        };
    }
}