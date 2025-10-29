// Sistema de Otimização de Imagens
// WebP com fallback + Lazy Loading + Placeholders

class ImageOptimizer {
    constructor() {
        this.supportsWebP = false;
        this.observer = null;
        this.init();
    }
    
    async init() {
        await this.checkWebPSupport();
        this.setupLazyLoading();
        this.optimizeExistingImages();
        
        console.log('🖼️ Sistema de otimização de imagens ativo');
    }
    
    checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                this.supportsWebP = (webP.height === 2);
                console.log('WebP suportado:', this.supportsWebP);
                resolve();
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    setupLazyLoading() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observar todas as imagens lazy
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.observer.observe(img);
        });
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;
        
        // Criar placeholder SVG enquanto carrega
        this.showPlaceholder(img);
        
        // Determinar melhor formato
        const optimizedSrc = this.getOptimizedSrc(src);
        
        // Preload da imagem
        const imageLoader = new Image();
        imageLoader.onload = () => {
            img.src = optimizedSrc;
            img.classList.add('loaded');
            this.hidePlaceholder(img);
        };
        imageLoader.onerror = () => {
            // Fallback para imagem original
            img.src = src;
            img.classList.add('loaded');
            this.hidePlaceholder(img);
        };
        imageLoader.src = optimizedSrc;
    }
    
    getOptimizedSrc(src) {
        if (!this.supportsWebP) return src;
        
        // Converter para WebP se suportado
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        return webpSrc;
    }
    
    showPlaceholder(img) {
        const placeholder = this.createPlaceholder(img.width || 300, img.height || 200);
        img.style.backgroundImage = `url("${placeholder}")`;
        img.style.backgroundSize = 'cover';
        img.style.backgroundPosition = 'center';
    }
    
    hidePlaceholder(img) {
        img.style.backgroundImage = '';
    }
    
    createPlaceholder(width, height) {
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#f0f0f0;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad)"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial" font-size="14">
                    Carregando...
                </text>
            </svg>
        `;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
    
    optimizeExistingImages() {
        // Otimizar imagens já carregadas
        document.querySelectorAll('img:not([data-src])').forEach(img => {
            if (img.complete && img.naturalHeight !== 0) {
                this.applyResponsiveOptimization(img);
            } else {
                img.addEventListener('load', () => {
                    this.applyResponsiveOptimization(img);
                });
            }
        });
    }
    
    applyResponsiveOptimization(img) {
        // Aplicar otimizações responsivas
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.loading = 'lazy';
        
        // Adicionar classes para CSS otimizado
        img.classList.add('optimized-image');
    }
    
    // Método para adicionar novas imagens dinamicamente
    addLazyImage(img) {
        if (this.observer) {
            this.observer.observe(img);
        }
    }
    
    // Método para converter imagem para WebP (se necessário)
    convertToWebP(canvas, quality = 0.8) {
        if (this.supportsWebP) {
            return canvas.toDataURL('image/webp', quality);
        }
        return canvas.toDataURL('image/jpeg', quality);
    }
}

// CSS para transições suaves
const optimizedImageCSS = `
    .optimized-image {
        transition: opacity 0.3s ease;
        opacity: 0;
    }
    
    .optimized-image.loaded {
        opacity: 1;
    }
    
    .optimized-image[data-src] {
        background-color: #f5f5f5;
        background-size: cover;
        background-position: center;
    }
`;

// Injetar CSS
const style = document.createElement('style');
style.textContent = optimizedImageCSS;
document.head.appendChild(style);

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.imageOptimizer = new ImageOptimizer();
});

// Exportar para uso global
window.ImageOptimizer = ImageOptimizer;