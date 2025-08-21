// Módulo de Administração do Carrossel
class AdminCarouselModule {
    constructor() {
        this.slides = [];
        this.init();
    }
    
    init() {
        console.log('🎠 AdminCarouselModule inicializado');
        this.setupSlidesDefault();
    }
    
    setupSlidesDefault() {
        // Slides padrão baseados na estrutura existente
        this.slides = [
            {
                id: 1,
                title: 'Ovos Caipira Frescos',
                description: 'Direto da nossa granja para sua mesa',
                image: 'imagens/carrocel/ovos-caipira.png',
                active: true
            },
            {
                id: 2,
                title: 'Galinhas Caipira',
                description: 'Criadas com amor e cuidado no campo',
                image: 'imagens/carrocel/galinhas-caipira.png',
                active: true
            },
            {
                id: 3,
                title: 'Agricultura Familiar',
                description: 'Tradição e qualidade há gerações',
                image: 'imagens/carrocel/agricultura-familiar.png',
                active: true
            },
            {
                id: 4,
                title: 'Adubo Orgânico',
                description: 'Para um cultivo mais natural e sustentável',
                image: 'imagens/carrocel/adubo-organico.png',
                active: true
            }
        ];
    }
    
    load() {
        console.log('🎠 Carregando slides do carrossel...');
        
        // Verificar se há slides salvos no localStorage
        try {
            const savedSlides = localStorage.getItem('carouselSlides');
            if (savedSlides) {
                this.slides = JSON.parse(savedSlides);
                console.log(`✅ ${this.slides.length} slides carregados do localStorage`);
            } else {
                console.log('⚠️ Usando slides padrão do carrossel');
            }
        } catch (e) {
            console.log('⚠️ Erro ao carregar slides, usando padrão');
        }
        
        this.render();
    }
    
    render() {
        const grid = document.getElementById('carousel-slides-grid');
        if (!grid) return;
        
        grid.innerHTML = this.slides.map(slide => `
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <div class="relative">
                    <img src="${slide.image}" alt="${slide.title}" class="w-full h-48 object-cover" onerror="this.src='imagens/LOGO 2023.jpg'">
                    <div class="absolute top-2 right-2">
                        <span class="px-2 py-1 text-xs rounded-full ${slide.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                            ${slide.active ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-gray-800 mb-2">${slide.title}</h3>
                    <p class="text-gray-600 text-sm mb-4">${slide.description}</p>
                    <div class="flex space-x-2">
                        <button onclick="window.adminCarouselModule.editSlide(${slide.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-edit mr-1"></i>Editar
                        </button>
                        <button onclick="window.adminCarouselModule.toggleSlideStatus(${slide.id})" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-toggle-${slide.active ? 'on' : 'off'} mr-1"></i>${slide.active ? 'Desativar' : 'Ativar'}
                        </button>
                        <button onclick="window.adminCarouselModule.deleteSlide(${slide.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-trash mr-1"></i>Excluir
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log(`✅ ${this.slides.length} slides renderizados`);
    }
    
    addSlide() {
        const title = prompt('Título do slide:');
        if (!title) return;
        
        const description = prompt('Descrição do slide:');
        if (!description) return;
        
        const image = prompt('URL/caminho da imagem (deixe em branco para usar padrão):') || 'imagens/LOGO 2023.jpg';
        
        const newSlide = {
            id: Math.max(...this.slides.map(s => s.id || 0)) + 1,
            title: title,
            description: description,
            image: image,
            active: true
        };
        
        this.slides.push(newSlide);
        this.saveSlides();
        this.render();
        this.showNotification('Slide adicionado com sucesso!', 'success');
    }
    
    editSlide(id) {
        const slide = this.slides.find(s => s.id === id);
        if (!slide) {
            this.showNotification('Slide não encontrado', 'error');
            return;
        }
        
        const newTitle = prompt('Novo título:', slide.title);
        if (newTitle === null) return;
        
        const newDescription = prompt('Nova descrição:', slide.description);
        if (newDescription === null) return;
        
        const newImage = prompt('Nova imagem:', slide.image);
        if (newImage === null) return;
        
        // Atualizar slide
        slide.title = newTitle;
        slide.description = newDescription;
        slide.image = newImage;
        
        this.saveSlides();
        this.render();
        this.showNotification('Slide atualizado com sucesso!', 'success');
    }
    
    toggleSlideStatus(id) {
        const slide = this.slides.find(s => s.id === id);
        if (!slide) {
            this.showNotification('Slide não encontrado', 'error');
            return;
        }
        
        slide.active = !slide.active;
        this.saveSlides();
        this.render();
        this.showNotification(`Slide ${slide.active ? 'ativado' : 'desativado'} com sucesso!`, 'success');
    }
    
    deleteSlide(id) {
        if (!confirm('Tem certeza que deseja excluir este slide?')) return;
        
        this.slides = this.slides.filter(s => s.id !== id);
        this.saveSlides();
        this.render();
        this.showNotification('Slide excluído com sucesso!', 'success');
    }
    
    previewCarousel() {
        window.open('index.html#carrossel', '_blank');
    }
    
    loadDefaultSlides() {
        if (!confirm('Isso irá substituir todos os slides atuais pelos padrões. Continuar?')) return;
        
        localStorage.removeItem('carouselSlides');
        this.setupSlidesDefault();
        this.render();
        this.showNotification('Slides padrão restaurados!', 'success');
    }
    
    saveSlides() {
        localStorage.setItem('carouselSlides', JSON.stringify(this.slides));
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
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
    getSlides() {
        return this.slides;
    }
    
    getActiveSlides() {
        return this.slides.filter(s => s.active);
    }
}

// Exportar para uso global
window.AdminCarouselModule = AdminCarouselModule;

// Funções globais para compatibilidade
window.addCarouselSlide = () => window.adminCarouselModule?.addSlide();
window.previewCarousel = () => window.adminCarouselModule?.previewCarousel();
window.loadDefaultCarouselSlides = () => window.adminCarouselModule?.loadDefaultSlides();
