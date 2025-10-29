// Mobile Optimizer - Otimizações específicas para dispositivos móveis
// Touch gestures, viewport dinâmico e áreas de toque otimizadas

class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartY = 0;
        this.isScrolling = false;
        
        if (this.isMobile) {
            this.init();
        }
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    init() {
        console.log('📱 Mobile Optimizer ativado');
        
        this.setupViewportHeight();
        this.optimizeTouchAreas();
        this.setupSwipeGestures();
        this.optimizeScrolling();
        this.setupFastClick();
        
        // Reotimizar em mudanças de orientação
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.setupViewportHeight();
                this.optimizeTouchAreas();
            }, 100);
        });
    }
    
    setupViewportHeight() {
        // Viewport height dinâmico para mobile (resolve problema da barra de endereço)
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        
        // Aplicar CSS customizado
        if (!document.getElementById('mobile-vh-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-vh-styles';
            style.textContent = `
                .mobile-vh {
                    height: calc(var(--vh, 1vh) * 100);
                }
                
                .mobile-safe-area {
                    padding-bottom: env(safe-area-inset-bottom);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    optimizeTouchAreas() {
        // Aumentar áreas de toque para elementos pequenos
        const smallButtons = document.querySelectorAll('button, .nav-link, .detail-btn');
        
        smallButtons.forEach(button => {
            const rect = button.getBoundingClientRect();
            
            // Se o elemento é muito pequeno, aumentar área de toque
            if (rect.width < 44 || rect.height < 44) {
                button.style.minWidth = '44px';
                button.style.minHeight = '44px';
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'center';
            }
        });
        
        // Otimizar dropdowns para touch
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const content = dropdown.querySelector('.dropdown-content');
            if (content) {
                // Aumentar padding para facilitar toque
                content.style.padding = '16px 8px';
                
                // Aumentar espaçamento entre itens
                const items = content.querySelectorAll('a');
                items.forEach(item => {
                    item.style.padding = '16px 24px';
                    item.style.minHeight = '48px';
                });
            }
        });
    }
    
    setupSwipeGestures() {
        // Swipe nativo para carrossel
        const carousel = document.getElementById('hero-carousel');
        if (!carousel) return;
        
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        let threshold = 100;
        let restraint = 100;
        let allowedTime = 300;
        let startTime = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            const touchobj = e.changedTouches[0];
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime();
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            const touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX;
            distY = touchobj.pageY - startY;
            const elapsedTime = new Date().getTime() - startTime;
            
            // Verificar se é um swipe válido
            if (elapsedTime <= allowedTime && Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    // Swipe right - slide anterior
                    this.triggerCarouselPrev();
                } else {
                    // Swipe left - próximo slide
                    this.triggerCarouselNext();
                }
            }
        }, { passive: true });
    }
    
    triggerCarouselNext() {
        const nextBtn = document.getElementById('next-slide');
        if (nextBtn) nextBtn.click();
        
        // Ou usar carrossel otimizado se disponível
        if (window.optimizedCarousel) {
            window.optimizedCarousel.next();
        }
    }
    
    triggerCarouselPrev() {
        const prevBtn = document.getElementById('prev-slide');
        if (prevBtn) prevBtn.click();
        
        // Ou usar carrossel otimizado se disponível
        if (window.optimizedCarousel) {
            window.optimizedCarousel.prev();
        }
    }
    
    optimizeScrolling() {
        // Scroll suave e otimizado para mobile
        let ticking = false;
        
        const updateScroll = () => {
            // Otimizações de scroll aqui
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }, { passive: true });
        
        // Prevenir scroll horizontal acidental
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    setupFastClick() {
        // Remover delay de 300ms em cliques (para dispositivos mais antigos)
        document.addEventListener('touchend', (e) => {
            const target = e.target.closest('button, a, .clickable');
            if (target && !target.disabled) {
                // Simular clique imediato
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                target.dispatchEvent(clickEvent);
            }
        });
    }
    
    // Otimizar modais para mobile
    optimizeModals() {
        const modals = document.querySelectorAll('.modal, [id$="-modal"]');
        
        modals.forEach(modal => {
            // Fazer modais ocuparem tela inteira em mobile
            if (this.isMobile) {
                modal.style.padding = '0';
                modal.style.margin = '0';
                
                const modalContent = modal.querySelector('.modal-content, .bg-white');
                if (modalContent) {
                    modalContent.style.maxWidth = '100vw';
                    modalContent.style.maxHeight = '100vh';
                    modalContent.style.borderRadius = '0';
                }
            }
        });
    }
    
    // Otimizar navegação para mobile
    optimizeNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        
        // Melhorar menu mobile
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            // Adicionar backdrop blur
            mobileMenu.style.backdropFilter = 'blur(10px)';
            mobileMenu.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
        
        // Otimizar botões de navegação
        const navButtons = nav.querySelectorAll('button, a');
        navButtons.forEach(button => {
            button.style.minHeight = '48px';
            button.style.padding = '12px 16px';
        });
    }
}

// Auto-inicializar em dispositivos móveis
document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimizer = new MobileOptimizer();
    
    // Aplicar otimizações específicas
    if (window.mobileOptimizer.isMobile) {
        window.mobileOptimizer.optimizeModals();
        window.mobileOptimizer.optimizeNavigation();
    }
});

export default MobileOptimizer;