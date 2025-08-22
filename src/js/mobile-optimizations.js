// js/mobile-optimizations.js
class MobileOptimizer {
    static init() {
        this.optimizeTouch();
        this.optimizeViewport();
        // this.optimizeImages(); // Image optimization handled by ImageOptimizer class
    }
    
    static optimizeTouch() {
        // Aumentar área de toque em dispositivos móveis
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Otimizar carrossel para swipe
            let startX, startY, distX, distY;
            const carousel = document.querySelector('.carousel-container');
            
            if (carousel) {
                carousel.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                });
                
                carousel.addEventListener('touchmove', (e) => {
                    if (startX === null || startY === null) return;
                    
                    distX = e.touches[0].clientX - startX;
                    distY = e.touches[0].clientY - startY;
                    
                    // Prevenir scroll vertical se swipe horizontal
                    if (Math.abs(distX) > Math.abs(distY)) {
                        e.preventDefault();
                    }
                });
                
                carousel.addEventListener('touchend', () => {
                    if (Math.abs(distX) > 50 && window.carousel) { // Check if window.carousel is available
                        window.carousel.transition(distX > 0 ? 'prev' : 'next');
                    }
                    startX = startY = distX = distY = null;
                });
            }
        }
    }
    
    static optimizeViewport() {
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        setVH();
        window.addEventListener('resize', setVH);
    }
}