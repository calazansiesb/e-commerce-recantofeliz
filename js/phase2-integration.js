// Integração da Fase 2 - Otimizações Avançadas
// Carrega e integra os módulos de otimização da Fase 2

console.log('🚀 Iniciando Fase 2 - Otimizações Avançadas');

// Carregar módulos da Fase 2 de forma assíncrona
async function loadPhase2Modules() {
    try {
        // 2.1 Code Splitting - Lazy Loader
        if (!window.lazyLoader) {
            const LazyLoader = await import('./modules/lazy-loader.js');
            window.lazyLoader = new LazyLoader.default();
        }
        
        // 2.2 Mobile Optimizations
        if (!window.mobileOptimizer) {
            const MobileOptimizer = await import('./modules/mobile-optimizer.js');
            window.mobileOptimizer = new MobileOptimizer.default();
        }
        
        // 2.3 Cache Inteligente
        if (!window.cacheManager) {
            const CacheManager = await import('./modules/cache-manager.js');
            window.cacheManager = new CacheManager.default();
        }
        
        console.log('✅ Todos os módulos da Fase 2 carregados');
        
        // Integrar com sistema existente
        integrateWithExistingSystem();
        
    } catch (error) {
        console.error('❌ Erro ao carregar módulos da Fase 2:', error);
        
        // Fallback: carregar via script tags
        loadModulesViaScriptTags();
    }
}

function integrateWithExistingSystem() {
    // Integrar cache com sistema de produtos
    if (window.cacheManager && window.renderizarProdutos) {
        const originalRenderizar = window.renderizarProdutos;
        
        window.renderizarProdutos = function() {
            // Verificar cache primeiro
            const cachedProducts = window.cacheManager.getProducts();
            if (cachedProducts) {
                console.log('📦 Usando produtos do cache');
                return Promise.resolve(cachedProducts);
            }
            
            // Se não tem cache, executar função original e cachear resultado
            return originalRenderizar().then(result => {
                if (window.produtos && window.produtos.length > 0) {
                    window.cacheManager.cacheProducts(window.produtos);
                }
                return result;
            });
        };
    }
    
    // Integrar debounce com salvamento de produtos
    if (window.cacheManager && window.salvarProdutosDefinitivo) {
        const originalSalvar = window.salvarProdutosDefinitivo;
        
        window.salvarProdutosDefinitivo = function() {
            window.cacheManager.debouncedSave('produtos_definitivo', originalSalvar, 2000);
        };
    }
    
    // Integrar mobile optimizer com modais
    if (window.mobileOptimizer && window.openProductModal) {
        const originalOpenModal = window.openProductModal;
        
        window.openProductModal = function(productId) {
            const result = originalOpenModal(productId);
            
            // Otimizar modal para mobile após abrir
            setTimeout(() => {
                if (window.mobileOptimizer.isMobile) {
                    window.mobileOptimizer.optimizeModals();
                }
            }, 100);
            
            return result;
        };
    }
    
    console.log('🔗 Integração com sistema existente concluída');
}

function loadModulesViaScriptTags() {
    console.log('🔄 Carregando módulos via script tags (fallback)');
    
    const modules = [
        'js/modules/lazy-loader.js',
        'js/modules/mobile-optimizer.js',
        'js/modules/cache-manager.js'
    ];
    
    modules.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
    });
}

// Performance monitoring para Fase 2
function setupPhase2Monitoring() {
    // Monitorar performance das otimizações
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            if (entry.name.includes('phase2') || entry.name.includes('optimization')) {
                console.log(`⚡ Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
    
    // Marcar início das otimizações
    performance.mark('phase2-start');
    
    // Medir após carregamento completo
    window.addEventListener('load', () => {
        performance.mark('phase2-end');
        performance.measure('phase2-total', 'phase2-start', 'phase2-end');
    });
}

// Verificar se Fase 1 está completa antes de iniciar Fase 2
function checkPhase1Completion() {
    const phase1Modules = [
        'carousel-optimized.js',
        'image-optimizer.js'
    ];
    
    let phase1Complete = true;
    
    phase1Modules.forEach(module => {
        const script = document.querySelector(`script[src*="${module}"]`);
        if (!script) {
            console.warn(`⚠️ Módulo da Fase 1 não encontrado: ${module}`);
            phase1Complete = false;
        }
    });
    
    return phase1Complete;
}

// Inicialização inteligente
document.addEventListener('DOMContentLoaded', () => {
    setupPhase2Monitoring();
    
    // Aguardar um pouco para garantir que Fase 1 foi carregada
    setTimeout(() => {
        if (checkPhase1Completion()) {
            console.log('✅ Fase 1 detectada, iniciando Fase 2');
            loadPhase2Modules();
        } else {
            console.log('⚠️ Fase 1 incompleta, carregando Fase 2 mesmo assim');
            loadPhase2Modules();
        }
    }, 1000);
});

// Exportar função para uso manual se necessário
window.initPhase2 = loadPhase2Modules;