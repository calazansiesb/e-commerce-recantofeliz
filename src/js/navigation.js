// Sistema de Navegação Fixa - Granja Recanto Feliz
// Controla os três botões principais e seus dropdowns

class NavigationManager {
    constructor() {
        this.currentFilter = 'all';
        this.products = [];
        this.init();
    }

    init() {
        console.log('🧭 Inicializando NavigationManager...');
        
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
        } else {
            this.setupNavigation();
        }
    }

    setupNavigation() {
        console.log('🔧 Configurando navegação...');
        
        // Configurar eventos de hover para dropdowns
        this.setupDropdowns();
        
        // Configurar eventos de clique
        this.setupClickEvents();
        
        // Configurar navegação por teclado
        this.setupKeyboardNavigation();
        
        // Carregar produtos iniciais
        this.loadProducts();
    }

    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('.nav-button');
            const content = dropdown.querySelector('.dropdown-content');
            
            if (!button || !content) return;
            
            let hoverTimeout;
            
            // Hover events com delay
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                content.classList.add('show');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    content.classList.remove('show');
                }, 150); // Delay de 150ms
            });
            
            // Manter aberto quando hover no conteúdo
            content.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                content.classList.add('show');
            });
            
            content.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    content.classList.remove('show');
                }, 150);
            });
            
            // Clique no botão principal
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                content.classList.toggle('show');
            });
        });
        
        // Fechar dropdowns ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    content.classList.remove('show');
                });
            }
        });
    }

    setupClickEvents() {
        // Eventos para links dos dropdowns
        document.addEventListener('click', (e) => {
            if (e.target.matches('.dropdown-content a') || e.target.closest('.dropdown-content a')) {
                e.preventDefault();
                e.stopPropagation();
                
                // Fechar dropdown
                const dropdown = e.target.closest('.dropdown');
                if (dropdown) {
                    dropdown.querySelector('.dropdown-content').classList.remove('show');
                }
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC para fechar dropdowns
            if (e.key === 'Escape') {
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    content.classList.remove('show');
                });
            }
            
            // Atalhos de teclado para filtros
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.filterProducts('all');
                        break;
                    case '2':
                        e.preventDefault();
                        this.filterProducts('granja');
                        break;
                    case '3':
                        e.preventDefault();
                        this.filterProducts('parceiros');
                        break;
                }
            }
        });
    }

    async loadProducts() {
        try {
            if (window.dataManager) {
                this.products = await window.dataManager.getActiveProducts();
                console.log(`📦 NavigationManager: ${this.products.length} produtos carregados`);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar produtos no NavigationManager:', error);
        }
    }

    setActiveButton(button) {
        // Remover classe active de todos os botões
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Adicionar classe active ao botão clicado
        if (button) {
            button.classList.add('active');
        }
        
        console.log('🎯 Botão ativo definido:', button?.textContent?.trim());
    }

    async filterProducts(category) {
        console.log('🔍 NavigationManager filtrando por:', category);
        
        this.currentFilter = category;
        
        // Sempre recarregar produtos para garantir dados atualizados
        await this.loadProducts();
        
        let filtered = [];
        
        switch(category) {
            case 'all':
                filtered = this.products;
                break;
                
            case 'granja':
                filtered = this.products.filter(p => 
                    p.category === 'fertilizantes' || 
                    p.category === 'aves' || 
                    p.category === 'ovos'
                );
                break;
                
            case 'parceiros':
                filtered = this.products.filter(p => 
                    p.category === 'parceiros' ||
                    p.category === 'mel' ||
                    p.category === 'laticinios' ||
                    p.category === 'outros-parceiros'
                );
                break;
                
            default:
                filtered = this.products.filter(p => p.category === category);
                break;
        }
        
        console.log(`📊 Produtos filtrados: ${filtered.length} de ${this.products.length}`);
        
        // Renderizar produtos
        this.renderProducts(filtered);
        
        // Atualizar URL (opcional)
        this.updateURL(category);
        
        // Salvar filtro atual para evitar sobrescrita
        sessionStorage.setItem('currentFilter', category);
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('productsFiltered', {
            detail: { category, products: filtered }
        }));
        
        console.log(`✅ NavigationManager: Filtro ${category} aplicado e mantido`);
    }

    renderProducts(products) {
        const productGrid = document.getElementById('product-grid');
        
        if (!productGrid) {
            console.error('❌ Grid de produtos não encontrado');
            return;
        }
        
        if (products.length === 0) {
            productGrid.innerHTML = `
                <div class="col-span-4 text-center py-12">
                    <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-bold text-gray-500 mb-2">Nenhum produto encontrado</h3>
                    <p class="text-gray-400">Tente selecionar uma categoria diferente</p>
                </div>
            `;
            return;
        }
        
        productGrid.innerHTML = products.map(product => {
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
            
            return `
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
        }).join('');
        
        // Scroll suave para a seção de produtos
        document.getElementById('produtos').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    updateURL(category) {
        // Atualizar URL sem recarregar a página
        const url = new URL(window.location);
        if (category === 'all') {
            url.searchParams.delete('categoria');
        } else {
            url.searchParams.set('categoria', category);
        }
        window.history.replaceState({}, '', url);
    }

    // Método para ser chamado externamente
    getCurrentFilter() {
        return this.currentFilter;
    }

    // Método para recarregar produtos
    async refresh() {
        await this.loadProducts();
        await this.filterProducts(this.currentFilter);
    }
}

// Instância global
let navigationManager;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    navigationManager = new NavigationManager();
    
    // Tornar funções globais para compatibilidade
    window.setActiveButton = (button) => navigationManager.setActiveButton(button);
    window.filterProducts = (category) => {
        navigationManager.filterProducts(category);
        // Bloquear outros sistemas de recarregamento
        window.filterLocked = true;
        setTimeout(() => {
            window.filterLocked = false;
        }, 10000); // 10 segundos de bloqueio
    };
    
    // Verificar se há categoria na URL ou sessão
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria') || sessionStorage.getItem('currentFilter');
    if (categoria && categoria !== 'all') {
        setTimeout(() => {
            navigationManager.filterProducts(categoria);
        }, 1000);
    }
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.NavigationManager = NavigationManager;
    window.navigationManager = navigationManager;
}