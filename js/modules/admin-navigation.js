// Módulo de Navegação Admin - Sistema centralizado de controle de seções
class AdminNavigationManager {
    constructor() {
        this.sections = ['produtos', 'estoque', 'layouts', 'carrossel'];
        this.currentSection = 'produtos';
        this.modules = new Map();
        
        console.log('🗂️ AdminNavigationManager inicializado');
        this.init();
    }
    
    init() {
        // Configurar eventos de navegação
        this.setupNavigationEvents();
        
        // Mostrar seção inicial
        this.showSection(this.currentSection);
    }
    
    // Registrar módulos administrativos
    registerModule(sectionName, moduleInstance) {
        this.modules.set(sectionName, moduleInstance);
        console.log(`📦 Módulo ${sectionName} registrado`);
    }
    
    // Função principal para mostrar/esconder seções
    showSection(section) {
        console.log(`🔄 Navegando para seção: ${section}`);
        
        // Esconder todas as seções
        this.sections.forEach(s => {
            const el = document.getElementById(`${s}-section`);
            if (el) el.classList.add('hidden');
        });
        
        // Atualizar botões de navegação
        this.updateNavigationButtons(section);
        
        // Mostrar a seção selecionada
        const selectedSection = document.getElementById(`${section}-section`);
        if (selectedSection) {
            selectedSection.classList.remove('hidden');
            this.currentSection = section;
            
            // Carregar conteúdo específico do módulo
            const module = this.modules.get(section);
            if (module && typeof module.load === 'function') {
                module.load();
            }
        } else {
            console.warn(`⚠️ Seção ${section} não encontrada`);
        }
    }
    
    updateNavigationButtons(activeSection) {
        // Atualizar estado visual dos botões
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('bg-blue-700', 'ring-2', 'ring-blue-300');
            
            // Se é o botão ativo, destacar
            const section = this.extractSectionFromButton(btn);
            if (section === activeSection) {
                btn.classList.add('bg-blue-700', 'ring-2', 'ring-blue-300');
            }
        });
    }
    
    extractSectionFromButton(button) {
        // Extrair seção do onclick do botão
        const onclick = button.getAttribute('onclick');
        if (onclick) {
            const match = onclick.match(/showSection\('(\w+)'\)/);
            return match ? match[1] : null;
        }
        return null;
    }
    
    setupNavigationEvents() {
        // Expor função global para compatibilidade
        window.showSection = (section) => this.showSection(section);
    }
    
    getCurrentSection() {
        return this.currentSection;
    }
    
    getRegisteredModules() {
        return Array.from(this.modules.keys());
    }
}

// Exportar para uso global
window.AdminNavigationManager = AdminNavigationManager;
