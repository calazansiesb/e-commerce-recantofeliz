/**
 * LayoutManager - Gerenciador de Layouts e Temas
 * Responsável por gerenciar todos os aspectos visuais e de layout do site
 */
class LayoutManager {
    constructor() {
        this.storageKey = 'ecommerce_recantofeliz_data';
        this.defaultLayouts = [
            {
                id: 'moderno',
                name: 'Layout Moderno',
                description: 'Design clean e contemporâneo',
                heroType: 'gradient',
                colorScheme: 'blue',
                fontFamily: 'Inter',
                active: true
            },
            {
                id: 'rustico',
                name: 'Layout Rústico',
                description: 'Design acolhedor e tradicional',
                heroType: 'image',
                colorScheme: 'earth',
                fontFamily: 'Georgia',
                active: false
            },
            {
                id: 'clean',
                name: 'Layout Clean',
                description: 'Minimalista e elegante',
                heroType: 'solid',
                colorScheme: 'minimal',
                fontFamily: 'Roboto',
                active: false
            }
        ];
    }

    // Obter layouts disponíveis
    getLayouts() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsedData = JSON.parse(data);
                if (parsedData.layouts && Array.isArray(parsedData.layouts)) {
                    return parsedData.layouts;
                }
            }
            return this.defaultLayouts;
        } catch (error) {
            console.error('❌ Erro ao obter layouts:', error);
            return this.defaultLayouts;
        }
    }

    // Obter layout ativo
    getActiveLayout() {
        const layouts = this.getLayouts();
        return layouts.find(layout => layout.active) || layouts[0];
    }

    // Ativar layout específico
    activateLayout(layoutId) {
        try {
            const layouts = this.getLayouts();
            const updatedLayouts = layouts.map(layout => ({
                ...layout,
                active: layout.id === layoutId
            }));

            return this.saveLayouts(updatedLayouts);
        } catch (error) {
            console.error('❌ Erro ao ativar layout:', error);
            return false;
        }
    }

    // Salvar layouts
    saveLayouts(layouts) {
        try {
            const data = localStorage.getItem(this.storageKey);
            const parsedData = data ? JSON.parse(data) : {};
            
            parsedData.layouts = layouts;
            parsedData.lastUpdate = new Date().toISOString();
            
            localStorage.setItem(this.storageKey, JSON.stringify(parsedData));
            
            // Disparar evento de atualização
            window.dispatchEvent(new CustomEvent('layoutsUpdated', { 
                detail: { layouts: layouts }
            }));
            
            console.log('✅ Layouts salvos com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar layouts:', error);
            return false;
        }
    }

    // Aplicar tema ao documento
    applyTheme(layoutId) {
        try {
            const layout = this.getLayouts().find(l => l.id === layoutId);
            if (!layout) {
                console.warn('⚠️ Layout não encontrado:', layoutId);
                return false;
            }

            // Aplicar esquema de cores
            this.applyColorScheme(layout.colorScheme);
            
            // Aplicar fonte
            this.applyFontFamily(layout.fontFamily);
            
            // Aplicar tipo de hero
            this.applyHeroType(layout.heroType);
            
            // Marcar como ativo
            this.activateLayout(layoutId);
            
            console.log(`✅ Tema aplicado: ${layout.name}`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao aplicar tema:', error);
            return false;
        }
    }

    // Aplicar esquema de cores
    applyColorScheme(scheme) {
        const root = document.documentElement;
        
        const colorSchemes = {
            blue: {
                '--primary-color': '#3B82F6',
                '--secondary-color': '#1E40AF',
                '--accent-color': '#60A5FA',
                '--background-color': '#F8FAFC',
                '--text-color': '#1F2937'
            },
            earth: {
                '--primary-color': '#92400E',
                '--secondary-color': '#451A03',
                '--accent-color': '#D97706',
                '--background-color': '#FFFBEB',
                '--text-color': '#292524'
            },
            minimal: {
                '--primary-color': '#374151',
                '--secondary-color': '#111827',
                '--accent-color': '#6B7280',
                '--background-color': '#FFFFFF',
                '--text-color': '#1F2937'
            }
        };

        const colors = colorSchemes[scheme] || colorSchemes.blue;
        
        Object.entries(colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }

    // Aplicar família de fontes
    applyFontFamily(fontFamily) {
        const root = document.documentElement;
        const fontMap = {
            'Inter': '"Inter", sans-serif',
            'Georgia': 'Georgia, serif',
            'Roboto': '"Roboto", sans-serif'
        };
        
        const font = fontMap[fontFamily] || fontMap['Inter'];
        root.style.setProperty('--font-family', font);
    }

    // Aplicar tipo de hero
    applyHeroType(heroType) {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        // Remover classes existentes
        heroSection.classList.remove('hero-gradient', 'hero-image', 'hero-solid');
        
        // Adicionar nova classe
        heroSection.classList.add(`hero-${heroType}`);
    }

    // Restaurar tema padrão
    resetToDefault() {
        try {
            this.saveLayouts(this.defaultLayouts);
            this.applyTheme('moderno');
            
            console.log('✅ Tema restaurado para padrão');
            return true;
        } catch (error) {
            console.error('❌ Erro ao restaurar tema padrão:', error);
            return false;
        }
    }
}

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
    window.LayoutManager = LayoutManager;
}
