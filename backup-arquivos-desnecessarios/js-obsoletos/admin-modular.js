// Sistema de Administração Modular - Granja Recanto Feliz
// Baseado na versão funcional fix-admin-produtos.js com arquitetura modular

console.log('🔧 Inicializando Admin Modular...');

class AdminDashboard {
    constructor() {
        this.modules = new Map();
        this.currentSection = 'produtos';
        this.init();
    }
    
    async init() {
        console.log('🚀 Inicializando Dashboard Admin...');
        
        // Aguardar carregamento do DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Inicializar navegação
        this.initNavigation();
        
        // Inicializar módulos
        this.initModules();
        
        // Configurar eventos globais
        this.setupGlobalEvents();
        
        // Mostrar seção inicial
        this.showSection(this.currentSection);
        
        console.log('✅ Dashboard Admin inicializado com sucesso');
    }
    
    initNavigation() {
        // Configurar navegação entre seções
        window.showSection = (section) => this.showSection(section);
        
        // Configurar eventos dos botões de navegação
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Atualizar estado visual dos botões
                this.updateNavigationButtons(btn);
            });
        });
    }
    
    initModules() {
        console.log('📦 Inicializando módulos...');
        
        // Módulo de Produtos (baseado em fix-admin-produtos.js)
        if (window.AdminProductsModule) {
            this.modules.set('produtos', new AdminProductsModule());
            window.adminProductsModule = this.modules.get('produtos');
            console.log('✅ Módulo Produtos inicializado');
        }
        
        // Módulo de Pedidos
        if (window.AdminOrdersModule) {
            this.modules.set('pedidos', new AdminOrdersModule());
            window.adminOrdersModule = this.modules.get('pedidos');
            console.log('✅ Módulo Pedidos inicializado');
        }
        
        // Módulo de Estoque
        if (window.AdminStockModule) {
            this.modules.set('estoque', new AdminStockModule());
            window.adminStockModule = this.modules.get('estoque');
            console.log('✅ Módulo Estoque inicializado');
        }
        
        // Módulo de Layouts
        if (window.AdminLayoutsModule) {
            this.modules.set('layouts', new AdminLayoutsModule());
            window.adminLayoutsModule = this.modules.get('layouts');
            console.log('✅ Módulo Layouts inicializado');
        }
        
        // Módulo de Carrossel
        if (window.AdminCarouselModule) {
            this.modules.set('carrossel', new AdminCarouselModule());
            window.adminCarouselModule = this.modules.get('carrossel');
            console.log('✅ Módulo Carrossel inicializado');
        }
        
        console.log(`📋 Total de módulos carregados: ${this.modules.size}`);
    }
    
    showSection(section) {
        console.log(`🔄 Navegando para seção: ${section}`);
        
        // Lista de seções disponíveis
        const sections = ['produtos', 'pedidos', 'estoque', 'layouts', 'carrossel'];
        
        // Esconder todas as seções
        sections.forEach(s => {
            const el = document.getElementById(`${s}-section`);
            if (el) el.classList.add('hidden');
        });
        
        // Mostrar a seção selecionada
        const selectedSection = document.getElementById(`${section}-section`);
        if (selectedSection) {
            selectedSection.classList.remove('hidden');
            this.currentSection = section;
            
            // Carregar dados do módulo correspondente
            const module = this.modules.get(section);
            if (module && typeof module.load === 'function') {
                module.load();
            }
            
            // Atualizar navegação visual
            this.updateNavigationForSection(section);
        } else {
            console.warn(`⚠️ Seção ${section} não encontrada no DOM`);
        }
    }
    
    updateNavigationButtons(activeButton) {
        // Remover estado ativo de todos os botões
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('bg-blue-700', 'ring-2', 'ring-blue-300');
        });
        
        // Adicionar estado ativo ao botão clicado
        if (activeButton) {
            activeButton.classList.add('bg-blue-700', 'ring-2', 'ring-blue-300');
        }
    }
    
    updateNavigationForSection(section) {
        // Encontrar e destacar o botão da seção ativa
        document.querySelectorAll('.nav-btn').forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            if (onclick && onclick.includes(`'${section}'`)) {
                this.updateNavigationButtons(btn);
            }
        });
    }
    
    setupGlobalEvents() {
        // Função global para salvar produtos (compatibilidade com fix-admin-produtos.js)
        window.salvarProdutosDefinitivo = () => {
            const produtosModule = this.modules.get('produtos');
            if (produtosModule && typeof produtosModule.salvarProdutosDefinitivo === 'function') {
                produtosModule.salvarProdutosDefinitivo();
            }
        };
        
        // Outras funções globais para compatibilidade
        this.setupCompatibilityFunctions();
        
        // Event listeners do DOM
        this.setupDOMEvents();
    }
    
    setupCompatibilityFunctions() {
        // Funções globais para manter compatibilidade com a versão funcional
        
        // Produtos
        const produtosModule = this.modules.get('produtos');
        if (produtosModule) {
            window.editarProduto = (id) => produtosModule.editarProduto(id);
            window.excluirProduto = (id) => produtosModule.excluirProduto(id);
            window.openProductModal = () => produtosModule.openProductModal();
            window.closeProductModal = () => produtosModule.closeProductModal();
        }
        
        // Carrossel
        window.addCarouselSlide = () => {
            const carrosselModule = this.modules.get('carrossel');
            if (carrosselModule) carrosselModule.addSlide();
        };
        
        window.previewCarousel = () => {
            const carrosselModule = this.modules.get('carrossel');
            if (carrosselModule) carrosselModule.previewCarousel();
        };
        
        window.loadDefaultCarouselSlides = () => {
            const carrosselModule = this.modules.get('carrossel');
            if (carrosselModule) carrosselModule.loadDefaultSlides();
        };
        
        // Layouts
        window.activateLayout = (id) => {
            const layoutsModule = this.modules.get('layouts');
            if (layoutsModule) layoutsModule.activateLayout(id);
        };
        
        window.previewLayout = (id) => {
            const layoutsModule = this.modules.get('layouts');
            if (layoutsModule) layoutsModule.previewLayout(id);
        };
    }
    
    setupDOMEvents() {
        // Event listener para formulário de produtos (compatibilidade)
        const productForm = document.getElementById('product-form');
        if (productForm) {
            // O módulo de produtos já configura este evento
            console.log('📝 Formulário de produtos configurado pelo módulo');
        }
        
        // Event listeners para modais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Fechar modais abertos
                const modals = document.querySelectorAll('.modal, [id$="-modal"]');
                modals.forEach(modal => {
                    if (!modal.classList.contains('hidden')) {
                        modal.classList.add('hidden');
                    }
                });
            }
        });
    }
    
    // Métodos públicos para integração
    getModule(moduleName) {
        return this.modules.get(moduleName);
    }
    
    getCurrentSection() {
        return this.currentSection;
    }
    
    getModules() {
        return Array.from(this.modules.keys());
    }
    
    // Relatórios consolidados
    generateConsolidatedReport() {
        const report = {
            timestamp: new Date().toISOString(),
            sections: {}
        };
        
        // Dados dos produtos
        const produtosModule = this.modules.get('produtos');
        if (produtosModule) {
            report.sections.produtos = {
                total: produtosModule.getProdutos().length,
                produtos: produtosModule.getProdutos()
            };
        }
        
        // Dados dos pedidos
        const pedidosModule = this.modules.get('pedidos');
        if (pedidosModule) {
            report.sections.pedidos = pedidosModule.getEstatisticas();
        }
        
        // Dados do estoque
        const estoqueModule = this.modules.get('estoque');
        if (estoqueModule) {
            report.sections.estoque = {
                total: estoqueModule.getEstoque().length,
                alertas: estoqueModule.getAlertas().length
            };
        }
        
        // Dados dos layouts
        const layoutsModule = this.modules.get('layouts');
        if (layoutsModule) {
            report.sections.layouts = {
                total: layoutsModule.getLayouts().length,
                ativo: layoutsModule.getActiveLayout().name
            };
        }
        
        // Dados do carrossel
        const carrosselModule = this.modules.get('carrossel');
        if (carrosselModule) {
            report.sections.carrossel = {
                total: carrosselModule.getSlides().length,
                ativos: carrosselModule.getActiveSlides().length
            };
        }
        
        return report;
    }
    
    downloadConsolidatedReport() {
        const report = this.generateConsolidatedReport();
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `relatorio-admin-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Relatório consolidado baixado!', 'success');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Instância global do dashboard
let adminDashboard;

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        adminDashboard = new AdminDashboard();
        window.adminDashboard = adminDashboard;
    });
} else {
    adminDashboard = new AdminDashboard();
    window.adminDashboard = adminDashboard;
}

// Função de inicialização para compatibilidade
function initializeAdmin() {
    if (!window.adminDashboard) {
        adminDashboard = new AdminDashboard();
        window.adminDashboard = adminDashboard;
    }
}

// Exportar para uso global
window.AdminDashboard = AdminDashboard;
window.initializeAdmin = initializeAdmin;
