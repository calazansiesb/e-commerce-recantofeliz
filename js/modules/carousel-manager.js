/**
 * CarouselManager - Gerenciador de Carrossel
 * Responsável por gerenciar temas e configurações do carrossel
 */
class CarouselManager {
    constructor() {
        this.storageKey = 'ecommerce_recantofeliz_data';
        this.defaultCarouselThemes = [
            {
                id: 'hero1',
                name: 'Produtos Naturais',
                slides: [
                    {
                        image: 'imagens/carrocel/ovos-caipira.png',
                        title: 'Ovos Caipira Frescos',
                        subtitle: 'Direto da nossa granja para sua mesa'
                    },
                    {
                        image: 'imagens/carrocel/galinhas-caipira.png',
                        title: 'Galinhas Caipira',
                        subtitle: 'Criadas livres, alimentadas naturalmente'
                    },
                    {
                        image: 'imagens/carrocel/adubo-organico.png',
                        title: 'Fertilizantes Orgânicos',
                        subtitle: 'Para sua horta crescer saudável'
                    },
                    {
                        image: 'imagens/carrocel/agricultura-familiar.png',
                        title: 'Agricultura Familiar',
                        subtitle: 'Apoiando produtores locais'
                    },
                    {
                        image: 'imagens/carrocel/Gemini_Generated_Image_c97w7dc97w7dc97w.png',
                        title: 'Qualidade Garantida',
                        subtitle: 'Produtos selecionados com carinho'
                    }
                ],
                autoPlay: true,
                interval: 5000,
                showDots: true,
                showArrows: true,
                active: true
            },
            {
                id: 'hero2',
                name: 'Produtos Premium',
                slides: [
                    {
                        image: 'imagens/carrocel/Gemini_Generated_Image_gf0zkgf0zkgf0zkg.png',
                        title: 'Linha Premium',
                        subtitle: 'O melhor da nossa produção'
                    },
                    {
                        image: 'imagens/carrocel/Gemini_Generated_Image_tt4t64tt4t64tt4t (1).png',
                        title: 'Sabor Autêntico',
                        subtitle: 'Tradição e qualidade em cada produto'
                    }
                ],
                autoPlay: true,
                interval: 4000,
                showDots: true,
                showArrows: false,
                active: false
            }
        ];
    }

    // Obter temas do carrossel
    getCarouselThemes() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsedData = JSON.parse(data);
                if (parsedData.carouselThemes && Array.isArray(parsedData.carouselThemes)) {
                    return parsedData.carouselThemes;
                }
            }
            return this.defaultCarouselThemes;
        } catch (error) {
            console.error('❌ Erro ao obter temas do carrossel:', error);
            return this.defaultCarouselThemes;
        }
    }

    // Obter tema ativo do carrossel
    getActiveCarouselTheme() {
        const themes = this.getCarouselThemes();
        return themes.find(theme => theme.active) || themes[0];
    }

    // Ativar tema do carrossel
    activateCarouselTheme(themeId) {
        try {
            const themes = this.getCarouselThemes();
            const updatedThemes = themes.map(theme => ({
                ...theme,
                active: theme.id === themeId
            }));

            return this.saveCarouselThemes(updatedThemes);
        } catch (error) {
            console.error('❌ Erro ao ativar tema do carrossel:', error);
            return false;
        }
    }

    // Salvar temas do carrossel
    saveCarouselThemes(themes) {
        try {
            const data = localStorage.getItem(this.storageKey);
            const parsedData = data ? JSON.parse(data) : {};
            
            parsedData.carouselThemes = themes;
            parsedData.lastUpdate = new Date().toISOString();
            
            localStorage.setItem(this.storageKey, JSON.stringify(parsedData));
            
            // Disparar evento de atualização
            window.dispatchEvent(new CustomEvent('carouselThemesUpdated', { 
                detail: { themes: themes }
            }));
            
            console.log('✅ Temas do carrossel salvos com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar temas do carrossel:', error);
            return false;
        }
    }

    // Inicializar carrossel com tema ativo
    initializeCarousel() {
        try {
            console.log('🎠 CarouselManager: Inicializando carrossel...');
            
            // Verificar se já existe estrutura HTML do carrossel
            const existingCarousel = document.querySelector('#hero-carousel');
            if (existingCarousel) {
                console.log('✅ Estrutura de carrossel existente encontrada, configurando eventos...');
                this.setupExistingCarouselEvents();
                return true;
            }
            
            // Se não existe, criar do zero
            const activeTheme = this.getActiveCarouselTheme();
            this.renderCarousel(activeTheme);
            this.setupCarouselEvents(activeTheme);
            
            console.log(`✅ Carrossel inicializado com tema: ${activeTheme.name}`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao inicializar carrossel:', error);
            return false;
        }
    }

    // Configurar eventos no carrossel existente
    setupExistingCarouselEvents() {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        
        if (!slides.length) {
            console.warn('⚠️ Nenhum slide encontrado');
            return;
        }
        
        console.log(`🎠 Configurando eventos para ${slides.length} slides`);
        
        // Função para mudar slide
        const changeSlide = (newSlide) => {
            // Remover classe ativa do slide atual
            slides[currentSlide].classList.remove('active');
            slides[currentSlide].style.opacity = '0';
            
            // Remover classe ativa do indicador atual
            if (indicators[currentSlide]) {
                indicators[currentSlide].classList.remove('active');
                indicators[currentSlide].classList.add('bg-white/50');
                indicators[currentSlide].classList.remove('bg-white');
            }
            
            currentSlide = newSlide;
            
            // Ativar novo slide
            slides[currentSlide].classList.add('active');
            slides[currentSlide].style.opacity = '1';
            
            // Ativar novo indicador
            if (indicators[currentSlide]) {
                indicators[currentSlide].classList.add('active');
                indicators[currentSlide].classList.remove('bg-white/50');
                indicators[currentSlide].classList.add('bg-white');
            }
        };

        // Função para próximo slide
        const nextSlide = () => {
            const newSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
            changeSlide(newSlide);
        };

        // Função para slide anterior
        const prevSlide = () => {
            const newSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            changeSlide(newSlide);
        };

        // Navegação por setas
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextSlide();
            });
        }

        // Navegação por indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                changeSlide(index);
            });
        });

        // Auto-play
        const activeTheme = this.getActiveCarouselTheme();
        if (activeTheme.autoPlay) {
            this.carouselInterval = setInterval(() => {
                nextSlide();
            }, activeTheme.interval || 5000);
        }

        // Pausar auto-play ao hover
        const carouselContainer = document.querySelector('#hero-carousel');
        if (carouselContainer && activeTheme.autoPlay) {
            carouselContainer.addEventListener('mouseenter', () => {
                if (this.carouselInterval) {
                    clearInterval(this.carouselInterval);
                }
            });

            carouselContainer.addEventListener('mouseleave', () => {
                this.carouselInterval = setInterval(() => {
                    nextSlide();
                }, activeTheme.interval || 5000);
            });
        }

        // Expor funções globalmente para compatibilidade
        window.nextSlide = nextSlide;
        window.prevSlide = prevSlide;
        window.changeSlide = changeSlide;
        
        console.log('✅ Eventos do carrossel configurados');
    }

    // Renderizar carrossel
    renderCarousel(theme) {
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer) {
            console.warn('⚠️ Container do carrossel não encontrado');
            return;
        }

        const slidesHTML = theme.slides.map((slide, index) => `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${slide.image}')">
                <div class="carousel-content">
                    <h2 class="carousel-title">${slide.title}</h2>
                    <p class="carousel-subtitle">${slide.subtitle}</p>
                </div>
            </div>
        `).join('');

        const dotsHTML = theme.showDots ? theme.slides.map((_, index) => `
            <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>
        `).join('') : '';

        const arrowsHTML = theme.showArrows ? `
            <button class="carousel-arrow carousel-prev">‹</button>
            <button class="carousel-arrow carousel-next">›</button>
        ` : '';

        carouselContainer.innerHTML = `
            <div class="carousel-slides">
                ${slidesHTML}
            </div>
            ${arrowsHTML}
            <div class="carousel-dots">
                ${dotsHTML}
            </div>
        `;
    }

    // Configurar eventos do carrossel
    setupCarouselEvents(theme) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');

        // Função para mudar slide
        const changeSlide = (newSlide) => {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide]?.classList.remove('active');
            
            currentSlide = newSlide;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide]?.classList.add('active');
        };

        // Navegação por setas
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
                changeSlide(newSlide);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
                changeSlide(newSlide);
            });
        }

        // Navegação por dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                changeSlide(index);
            });
        });

        // Auto-play
        if (theme.autoPlay) {
            setInterval(() => {
                const newSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
                changeSlide(newSlide);
            }, theme.interval);
        }
    }

    // Adicionar novo slide
    addSlide(themeId, slideData) {
        try {
            const themes = this.getCarouselThemes();
            const themeIndex = themes.findIndex(t => t.id === themeId);
            
            if (themeIndex !== -1) {
                themes[themeIndex].slides.push(slideData);
                return this.saveCarouselThemes(themes);
            }
            
            return false;
        } catch (error) {
            console.error('❌ Erro ao adicionar slide:', error);
            return false;
        }
    }

    // Remover slide
    removeSlide(themeId, slideIndex) {
        try {
            const themes = this.getCarouselThemes();
            const themeIndex = themes.findIndex(t => t.id === themeId);
            
            if (themeIndex !== -1 && themes[themeIndex].slides.length > 1) {
                themes[themeIndex].slides.splice(slideIndex, 1);
                return this.saveCarouselThemes(themes);
            }
            
            return false;
        } catch (error) {
            console.error('❌ Erro ao remover slide:', error);
            return false;
        }
    }

    // Restaurar temas padrão
    resetToDefault() {
        try {
            this.saveCarouselThemes(this.defaultCarouselThemes);
            this.initializeCarousel();
            
            console.log('✅ Temas do carrossel restaurados para padrão');
            return true;
        } catch (error) {
            console.error('❌ Erro ao restaurar temas padrão:', error);
            return false;
        }
    }
}

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
    window.CarouselManager = CarouselManager;
    
    // Inicializar automaticamente quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🎠 DOM carregado, verificando CarouselManager...');
        if (!window.carouselManager) {
            console.log('🎠 Criando nova instância do CarouselManager...');
            window.carouselManager = new CarouselManager();
            
            // Aguardar um pouco para garantir que o HTML esteja pronto
            setTimeout(() => {
                window.carouselManager.initializeCarousel();
                console.log('✅ CarouselManager inicializado automaticamente');
            }, 100);
        } else {
            console.log('✅ CarouselManager já existe');
        }
    });
}
