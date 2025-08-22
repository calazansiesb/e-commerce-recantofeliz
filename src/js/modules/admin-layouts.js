// Módulo de Administração de Layouts
class AdminLayoutsModule {
    constructor() {
        this.layouts = [];
        this.activeLayoutId = 'granja-tradicional';
        this.init();
    }
    
    init() {
        console.log('🎨 AdminLayoutsModule inicializado');
        this.setupLayoutsPadrao();
    }
    
    setupLayoutsPadrao() {
        // Layouts baseados no sistema existente
        this.layouts = [
            {
                id: 'granja-tradicional',
                name: 'Granja Tradicional',
                description: 'Layout padrão com cores da natureza',
                colors: {
                    primary: '#2D5016',    // Verde escuro
                    secondary: '#8B4513',  // Marrom
                    accent: '#228B22',     // Verde médio
                    background: '#F0F8E8'  // Verde claro
                },
                fonts: {
                    heading: 'Lora',
                    body: 'Inter'
                },
                active: true,
                default: true
            },
            {
                id: 'dia-das-maes',
                name: 'Dia das Mães',
                description: 'Layout especial com tons rosados',
                colors: {
                    primary: '#8B4B6B',    // Rosa escuro
                    secondary: '#D2691E',  // Laranja
                    accent: '#FF69B4',     // Rosa vibrante
                    background: '#FFF0F5'  // Rosa claro
                },
                fonts: {
                    heading: 'Lora',
                    body: 'Inter'
                },
                active: false,
                seasonal: true,
                startDate: '2025-05-01',
                endDate: '2025-05-31'
            },
            {
                id: 'festa-junina',
                name: 'Festa Junina',
                description: 'Layout temático com cores festivas',
                colors: {
                    primary: '#FF6347',    // Vermelho
                    secondary: '#FFD700',  // Amarelo
                    accent: '#32CD32',     // Verde limão
                    background: '#FFFACD'  // Amarelo claro
                },
                fonts: {
                    heading: 'Lora',
                    body: 'Inter'
                },
                active: false,
                seasonal: true,
                startDate: '2025-06-01',
                endDate: '2025-06-30'
            },
            {
                id: 'natal',
                name: 'Natal',
                description: 'Layout natalino com verde e vermelho',
                colors: {
                    primary: '#B22222',    // Vermelho escuro
                    secondary: '#228B22',  // Verde
                    accent: '#FFD700',     // Dourado
                    background: '#F5F5DC'  // Bege
                },
                fonts: {
                    heading: 'Lora',
                    body: 'Inter'
                },
                active: false,
                seasonal: true,
                startDate: '2025-12-01',
                endDate: '2025-12-31'
            }
        ];
    }
    
    load() {
        console.log('🎨 Carregando layouts...');
        
        try {
            const savedLayouts = localStorage.getItem('granjaRecantoFelizLayouts');
            if (savedLayouts) {
                this.layouts = JSON.parse(savedLayouts);
                console.log(`✅ ${this.layouts.length} layouts carregados`);
            }
            
            const activeLayoutId = localStorage.getItem('granjaActiveLayout');
            if (activeLayoutId) {
                this.activeLayoutId = activeLayoutId;
            }
        } catch (e) {
            console.log('⚠️ Erro ao carregar layouts, usando padrão');
        }
        
        this.render();
    }
    
    render() {
        const grid = document.getElementById('layouts-grid');
        if (!grid) return;
        
        const activeLayout = this.getActiveLayout();
        
        grid.innerHTML = this.layouts.map(layout => `
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${
                layout.id === activeLayout.id ? 'ring-2 ring-blue-500' : ''
            }">
                <div class="relative">
                    <div class="h-32 bg-gradient-to-br flex items-center justify-center" style="background: linear-gradient(135deg, ${layout.colors.primary}20, ${layout.colors.secondary}20)">
                        <div class="text-center p-4">
                            <div class="text-xl font-bold mb-2" style="color: ${layout.colors.primary}">${layout.name}</div>
                            <div class="text-sm opacity-75">${layout.description}</div>
                        </div>
                    </div>
                    <div class="absolute top-2 left-2 flex space-x-1">
                        ${layout.default ? '<span class="px-2 py-1 bg-blue-500 text-white rounded text-xs">Padrão</span>' : ''}
                        ${layout.seasonal ? '<span class="px-2 py-1 bg-purple-500 text-white rounded text-xs">Sazonal</span>' : ''}
                        ${layout.id === activeLayout.id ? '<span class="px-2 py-1 bg-green-500 text-white rounded text-xs">Ativo</span>' : ''}
                    </div>
                </div>
                <div class="p-4">
                    <div class="flex space-x-2 mb-3">
                        ${Object.entries(layout.colors).map(([key, color]) => 
                            `<div class="w-6 h-6 rounded-full border-2 border-gray-300" style="background-color: ${color}" title="${key}: ${color}"></div>`
                        ).join('')}
                    </div>
                    ${layout.seasonal ? `
                        <div class="text-xs text-gray-500 mb-3">
                            <i class="fas fa-calendar mr-1"></i>
                            ${layout.startDate} a ${layout.endDate}
                        </div>
                    ` : ''}
                    <div class="flex space-x-2">
                        <button onclick="window.adminLayoutsModule.activateLayout('${layout.id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex-1 ${layout.id === activeLayout.id ? 'opacity-50 cursor-not-allowed' : ''}">
                            <i class="fas fa-check mr-1"></i>Ativar
                        </button>
                        <button onclick="window.adminLayoutsModule.previewLayout('${layout.id}')" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${!layout.default ? `
                            <button onclick="window.adminLayoutsModule.editLayout('${layout.id}')" class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
        // Exibir informações do layout ativo
        this.renderActiveLayoutInfo();
        
        console.log(`✅ ${this.layouts.length} layouts renderizados`);
    }
    
    renderActiveLayoutInfo() {
        const infoContainer = document.getElementById('active-layout-info');
        if (!infoContainer) return;
        
        const activeLayout = this.getActiveLayout();
        
        infoContainer.innerHTML = `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="font-bold text-blue-800 mb-2">🎨 Layout Ativo: ${activeLayout.name}</h4>
                <p class="text-blue-700 text-sm mb-3">${activeLayout.description}</p>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>Cores:</strong>
                        <div class="mt-1 space-y-1">
                            ${Object.entries(activeLayout.colors).map(([key, color]) => 
                                `<div class="flex items-center space-x-2">
                                    <div class="w-4 h-4 rounded border" style="background-color: ${color}"></div>
                                    <span class="capitalize">${key}: ${color}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    <div>
                        <strong>Informações:</strong>
                        <div class="mt-1 space-y-1">
                            <div>Tipo: ${activeLayout.seasonal ? 'Sazonal' : 'Permanente'}</div>
                            <div>Fonte Título: ${activeLayout.fonts.heading}</div>
                            <div>Fonte Texto: ${activeLayout.fonts.body}</div>
                            ${activeLayout.seasonal ? `<div>Período: ${activeLayout.startDate} a ${activeLayout.endDate}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    activateLayout(layoutId) {
        const layout = this.layouts.find(l => l.id === layoutId);
        if (!layout) {
            this.showNotification('Layout não encontrado', 'error');
            return;
        }
        
        if (layoutId === this.activeLayoutId) {
            this.showNotification('Este layout já está ativo', 'warning');
            return;
        }
        
        this.activeLayoutId = layoutId;
        this.saveLayouts();
        this.applyLayoutToSite(layout);
        this.render();
        this.showNotification(`Layout "${layout.name}" ativado com sucesso!`, 'success');
    }
    
    applyLayoutToSite(layout) {
        // Aplicar cores CSS
        const root = document.documentElement;
        root.style.setProperty('--color-primary', layout.colors.primary);
        root.style.setProperty('--color-secondary', layout.colors.secondary);
        root.style.setProperty('--color-accent', layout.colors.accent);
        root.style.setProperty('--color-background', layout.colors.background);
        
        // Aplicar no site principal também
        if (window.layoutManager && typeof window.layoutManager.applyTheme === 'function') {
            window.layoutManager.applyTheme(layout.id);
        }
        
        // Salvar no localStorage para o site principal
        localStorage.setItem('granjaActiveLayout', layout.id);
    }
    
    previewLayout(layoutId) {
        window.open(`index.html?preview=${layoutId}`, '_blank');
    }
    
    editLayout(layoutId) {
        const layout = this.layouts.find(l => l.id === layoutId);
        if (!layout || layout.default) return;
        
        const newName = prompt('Nome do layout:', layout.name);
        if (newName) layout.name = newName;
        
        const newDescription = prompt('Descrição:', layout.description);
        if (newDescription) layout.description = newDescription;
        
        // Editar cores
        const editColors = confirm('Deseja editar as cores?');
        if (editColors) {
            Object.keys(layout.colors).forEach(key => {
                const newColor = prompt(`Cor ${key}:`, layout.colors[key]);
                if (newColor && /^#[0-9A-F]{6}$/i.test(newColor)) {
                    layout.colors[key] = newColor;
                }
            });
        }
        
        this.saveLayouts();
        this.render();
        this.showNotification('Layout atualizado com sucesso!', 'success');
    }
    
    createLayout() {
        const name = prompt('Nome do novo layout:');
        if (!name) return;
        
        const description = prompt('Descrição do layout:');
        if (!description) return;
        
        const newLayout = {
            id: `custom-${Date.now()}`,
            name: name,
            description: description,
            colors: {
                primary: '#2D5016',
                secondary: '#8B4513',
                accent: '#228B22',
                background: '#F0F8E8'
            },
            fonts: {
                heading: 'Lora',
                body: 'Inter'
            },
            active: false,
            default: false
        };
        
        this.layouts.push(newLayout);
        this.saveLayouts();
        this.render();
        this.showNotification('Novo layout criado!', 'success');
    }
    
    checkSeasonalLayouts() {
        const today = new Date().toISOString().split('T')[0];
        
        // Verificar se algum layout sazonal deve ser ativado
        const seasonalLayout = this.layouts.find(l => 
            l.seasonal && 
            l.startDate <= today && 
            l.endDate >= today
        );
        
        if (seasonalLayout && this.activeLayoutId !== seasonalLayout.id) {
            if (confirm(`O layout sazonal "${seasonalLayout.name}" está disponível. Deseja ativá-lo automaticamente?`)) {
                this.activateLayout(seasonalLayout.id);
            }
        }
    }
    
    resetToDefault() {
        const defaultLayout = this.layouts.find(l => l.default);
        if (defaultLayout) {
            this.activateLayout(defaultLayout.id);
        }
    }
    
    getActiveLayout() {
        return this.layouts.find(l => l.id === this.activeLayoutId) || this.layouts[0];
    }
    
    saveLayouts() {
        localStorage.setItem('granjaRecantoFelizLayouts', JSON.stringify(this.layouts));
        localStorage.setItem('granjaActiveLayout', this.activeLayoutId);
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
    
    // Métodos públicos
    getLayouts() {
        return this.layouts;
    }
    
    getLayoutById(id) {
        return this.layouts.find(l => l.id === id);
    }
}

// Exportar para uso global
window.AdminLayoutsModule = AdminLayoutsModule;

// Funções globais para compatibilidade
window.activateLayout = (id) => window.adminLayoutsModule?.activateLayout(id);
window.previewLayout = (id) => window.adminLayoutsModule?.previewLayout(id);
window.createLayout = () => window.adminLayoutsModule?.createLayout();
window.resetLayoutToDefault = () => window.adminLayoutsModule?.resetToDefault();
