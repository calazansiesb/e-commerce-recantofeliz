// js/image-optimizer.js
class ImageOptimizer {
    static createWebPFallback(imgElement) {
        const webpSrc = imgElement.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        // Testar suporte WebP
        const webp = new Image();
        webp.onload = () => {
            imgElement.src = webpSrc;
        };
        webp.onerror = () => {
            // Manter imagem original se WebP não suportado
        };
        webp.src = webpSrc;
    }
    
    static lazyLoad() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    static addPlaceholders() {
        document.querySelectorAll('img').forEach(img => {
            img.onerror = function() {
                this.src = 'imagens/placeholder.svg';
                this.classList.add('error-placeholder');
            };
        });
    }
}