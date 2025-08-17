// Sistema de Dados Compartilhados - Granja Recanto Feliz
// Este arquivo gerencia a sincronização entre o site principal e a administração

class DataManager {
    constructor() {
        this.storageKey = 'granjaRecantoFelizData';
        this.defaultProducts = [
            {
                id: 1,
                name: "Substrato BioFértil 3 Anos",
                category: "fertilizantes",
                slogan: "Mais do que Adubo: um substrato vivo e completo.",
                description: "Com um processo de maturação de 3 anos, nosso substrato é uma terra viva e completa, rica em matéria orgânica e microrganismos benéficos.",
                price: 40.00,
                image: "imagens/produtos/1/1.png",
                stock: 25,
                active: true
            },
            {
                id: 2,
                name: "FertiGota",
                category: "fertilizantes",
                slogan: "Adubo de galinha líquido e potente.",
                description: "Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas. Ideal para hortas, jardins e vasos.",
                price: 25.00,
                image: "imagens/produtos/2/1.png",
                stock: 40,
                active: true
            },
            {
                id: 3,
                name: "Ovos Caipira 10",
                category: "ovos",
                slogan: "10 ovos frescos da granja.",
                description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 10 unidades.",
                price: 18.00,
                image: "imagens/produtos/3/1.jpeg",
                stock: 120,
                active: true
            },
            {
                id: 4,
                name: "Ovos Caipira 20",
                category: "ovos",
                slogan: "20 ovos frescos da granja.",
                description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 20 unidades.",
                price: 30.00,
                image: "imagens/produtos/4/1.jpeg",
                stock: 80,
                active: true
            },
            {
                id: 5,
                name: "Ovos Caipira 30",
                category: "ovos",
                slogan: "30 ovos frescos da granja.",
                description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 30 unidades.",
                price: 45.00,
                image: "imagens/produtos/5/1.png",
                stock: 50,
                active: true
            },
            {
                id: 6,
                name: "Galinha Caipira Picada",
                category: "aves",
                slogan: "Galinha caipira cortada, pronta para cozinhar.",
                description: "Galinha caipira picada, sabor autêntico da roça. Ideal para receitas tradicionais.",
                price: 60.00,
                image: "imagens/produtos/6/1.png",
                stock: 15,
                active: true
            },
            {
                id: 7,
                name: "Galinha Caipira Inteira",
                category: "aves",
                slogan: "Galinha caipira inteira, fresca e saborosa.",
                description: "Galinha caipira inteira, criada solta e alimentada naturalmente. Perfeita para assados e cozidos.",
                price: 110.00,
                image: "imagens/produtos/7/1.png",
                stock: 8,
                active: true
            }
        ];
        
        // Layouts temáticos para datas comemorativas
        this.defaultLayouts = {
            default: {
                name: "Layout Padrão",
                colors: {
                    primary: "#2D5016",
                    secondary: "#8B4513", 
                    accent: "#228B22",
                    background: "#F0F8E8"
                },
                bannerImage: "imagens/produtos/8/1.png",
                bannerText: "Granja Recanto Feliz - Produtos Frescos da Fazenda",
                hero: {
                    title: "Produtos frescos direto da granja",
                    subtitle: "Uma tradição familiar de carinho e respeito pela natureza, entregando o melhor da roça no Jardim Botânico e Lago Sul.",
                    backgroundImage: "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    buttonPrimary: "Compre agora",
                    buttonSecondary: "Conheça nossa história",
                    overlayColor: "bg-black/40"
                },
                theme: "default",
                active: true
            },
            diadasMaes: {
                name: "Dia das Mães",
                dateStart: "05-01",
                dateEnd: "05-15", 
                colors: {
                    primary: "#BE185D",
                    secondary: "#A21CAF",
                    accent: "#F472B6",
                    background: "#FDF2F8"
                },
                bannerImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                bannerText: "Especial Dia das Mães - Carinho da Fazenda para a Rainha do Lar",
                hero: {
                    title: "🌸 Especial Dia das Mães 🌸",
                    subtitle: "Homenageie a rainha do lar com produtos frescos e naturais. Sabores que expressam todo o amor e cuidado materno que só uma mãe sabe dar.",
                    backgroundImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                    buttonPrimary: "💐 Mimar a Mamãe",
                    buttonSecondary: "🎁 Cestas Especiais",
                    overlayColor: "bg-pink-900/60"
                },
                customCSS: {
                    headerBg: "linear-gradient(135deg, #BE185D, #F472B6)",
                    cardStyle: "border: 2px solid #F472B6; background: linear-gradient(145deg, #FDF2F8, #FCE7F3); box-shadow: 0 8px 25px rgba(244, 114, 182, 0.3);",
                    buttonStyle: "background: linear-gradient(135deg, #BE185D, #F472B6); border-radius: 25px; box-shadow: 0 4px 15px rgba(244, 114, 182, 0.4);",
                    textAccent: "#BE185D",
                    decorativeElements: true
                },
                sectionTitles: {
                    produtos: "🌸 Presentes Especiais para Mamãe 🌸",
                    sobre: "💐 Nossa História de Amor e Cuidado 💐",
                    contato: "🌹 Fale com Quem Cuida de Você 🌹"
                },
                carouselThemes: [
                    {
                        id: "maes-1",
                        title: "🌸 Para a Mãe Mais Especial",
                        description: "Mãe é amor em forma de cuidado. Produtos frescos e naturais para demonstrar todo seu carinho.",
                        image: "imagens/carrocel/ovos-caipira.png",
                        buttonText: "Presentes para Mamãe",
                        buttonLink: "#produtos",
                        buttonColor: "#BE185D"
                    },
                    {
                        id: "maes-2", 
                        title: "🌹 Carinho que Nutre",
                        description: "Assim como o amor de mãe alimenta nossa alma, nossos produtos nutrem o corpo com cuidado especial.",
                        image: "imagens/carrocel/agricultura-familiar.png",
                        buttonText: "Ver Produtos Naturais",
                        buttonLink: "#produtos",
                        buttonColor: "#A21CAF"
                    },
                    {
                        id: "maes-3",
                        title: "💐 Frescor e Tradição",
                        description: "Receitas passadas de mãe para filha, ingredientes frescos que preservam o sabor do amor familiar.",
                        image: "imagens/carrocel/galinhas-caipira.png",
                        buttonText: "Tradição Familiar",
                        buttonLink: "#sobre",
                        buttonColor: "#F472B6"
                    }
                ],
                theme: "diadasMaes",
                active: false
            }
        };
        
        // Temas de carrossel padrão
        this.defaultCarouselThemes = [
            {
                id: 1,
                name: "A Autenticidade do Ovo Caipira",
                category: "ovos",
                title: "🥚 Ovos Caipira Autênticos",
                description: "Galinhas criadas soltas, alimentação natural, sem hormônios. O sabor puro da natureza em cada ovo.",
                image: "imagens/carrocel/ovos-caipira.png",
                buttonText: "Ver Ovos Caipira",
                buttonLink: "#produtos",
                buttonColor: "#4CAF50",
                active: true
            },
            {
                id: 2,
                name: "Cuidado com a Terra: Adubo Líquido",
                category: "adubo",
                title: "🌱 Adubo Orgânico Natural",
                description: "Fertilizantes orgânicos produzidos na própria granja. Nutra sua terra com o que há de melhor na natureza.",
                image: "imagens/carrocel/adubo-organico.png",
                buttonText: "Ver Fertilizantes",
                buttonLink: "#produtos",
                buttonColor: "#228B22",
                active: true
            },
            {
                id: 3,
                name: "As Aves Felizes da Granja Recanto Feliz",
                category: "galinhas",
                title: "🐓 Galinhas Caipira Felizes",
                description: "Criadas com liberdade e carinho, nossas galinhas vivem soltas no pasto, resultando em carne mais saborosa e saudável.",
                image: "imagens/carrocel/galinhas-caipira.png",
                buttonText: "Ver Galinhas",
                buttonLink: "#produtos",
                buttonColor: "#8B4513",
                active: true
            },
            {
                id: 4,
                name: "A Mesa Completa da Granja",
                category: "completo",
                title: "🏡 Agricultura Familiar",
                description: "Tradição de gerações, sustentabilidade e amor pela terra. Apoie a agricultura familiar brasileira.",
                image: "imagens/carrocel/agricultura-familiar.png",
                buttonText: "Nossa História",
                buttonLink: "#sobre",
                buttonColor: "#D2691E",
                active: true
            }
        ];
        
        this.init();
    }

    init() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                const initialData = {
                    products: this.defaultProducts,
                    layouts: this.defaultLayouts,
                    carouselThemes: this.defaultCarouselThemes,
                    lastUpdate: new Date().toISOString()
                };
                localStorage.setItem(this.storageKey, JSON.stringify(initialData));
            }
        } catch (error) {
            console.error('Erro ao inicializar DataManager:', error);
        }
    }

    // Obter todos os produtos
    getProducts() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data).products : this.defaultProducts;
        } catch (error) {
            console.error('Erro ao obter produtos:', error);
            return this.defaultProducts;
        }
    }

    // Obter produtos ativos
    getActiveProducts() {
        return this.getProducts().filter(product => product.active !== false);
    }

    // Obter layouts
    getLayouts() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsedData = JSON.parse(data);
                return parsedData.layouts || this.defaultLayouts;
            }
            return this.defaultLayouts;
        } catch (error) {
            console.error('Erro ao obter layouts:', error);
            return this.defaultLayouts;
        }
    }

    // Obter layout atual
    getCurrentLayout() {
        try {
            const layouts = this.getLayouts();
            return layouts.default || this.defaultLayouts.default;
        } catch (error) {
            console.error('Erro ao obter layout atual:', error);
            return this.defaultLayouts.default;
        }
    }

    // Ativar layout
    activateLayout(layoutKey) {
        try {
            const layouts = this.getLayouts();
            const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            
            data.currentLayoutKey = layoutKey;
            data.layouts = layouts;
            data.lastUpdate = new Date().toISOString();
            
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao ativar layout:', error);
            return false;
        }
    }

    // Obter temas de carrossel
    getCarouselThemes() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsedData = JSON.parse(data);
                return parsedData.carouselThemes || this.defaultCarouselThemes;
            }
            return this.defaultCarouselThemes;
        } catch (error) {
            console.error('Erro ao obter temas de carrossel:', error);
            return this.defaultCarouselThemes;
        }
    }

    // Adicionar tema de carrossel
    addCarouselTheme(themeData) {
        try {
            const themes = this.getCarouselThemes();
            const newId = Math.max(...themes.map(t => t.id), 0) + 1;
            
            const newTheme = {
                id: newId,
                ...themeData,
                active: themeData.active || false
            };
            
            themes.push(newTheme);
            return this.saveCarouselThemes(themes);
        } catch (error) {
            console.error('Erro ao adicionar tema:', error);
            return false;
        }
    }

    // Salvar temas de carrossel
    saveCarouselThemes(themes) {
        try {
            const data = localStorage.getItem(this.storageKey);
            const parsedData = data ? JSON.parse(data) : { 
                products: this.defaultProducts, 
                layouts: this.defaultLayouts 
            };
            
            parsedData.carouselThemes = themes;
            parsedData.lastUpdate = new Date().toISOString();
            
            localStorage.setItem(this.storageKey, JSON.stringify(parsedData));
            return true;
        } catch (error) {
            console.error('Erro ao salvar temas:', error);
            return false;
        }
    }

    // Atualizar tema de carrossel
    updateCarouselTheme(themeId, themeData) {
        try {
            const themes = this.getCarouselThemes();
            const index = themes.findIndex(t => t.id === themeId);
            
            if (index !== -1) {
                themes[index] = { ...themes[index], ...themeData };
                return this.saveCarouselThemes(themes);
            }
            return false;
        } catch (error) {
            console.error('Erro ao atualizar tema:', error);
            return false;
        }
    }

    // Remover tema de carrossel
    removeCarouselTheme(themeId) {
        try {
            const themes = this.getCarouselThemes();
            const filteredThemes = themes.filter(t => t.id !== themeId);
            return this.saveCarouselThemes(filteredThemes);
        } catch (error) {
            console.error('Erro ao remover tema:', error);
            return false;
        }
    }

    // Obter estatísticas
    getStats() {
        try {
            const products = this.getActiveProducts();
            const totalProducts = products.length;
            const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
            const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
            const outOfStock = products.filter(p => p.stock === 0).length;
            
            return {
                totalProducts,
                totalValue,
                lowStock,
                outOfStock
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return {
                totalProducts: 0,
                totalValue: 0,
                lowStock: 0,
                outOfStock: 0
            };
        }
    }

    // Adicionar produto
    addProduct(productData) {
        try {
            const products = this.getProducts();
            const newId = Math.max(...products.map(p => p.id), 0) + 1;
            
            const newProduct = {
                id: newId,
                ...productData,
                stock: productData.stock || 0,
                active: true,
                image: productData.image || `imagens/produtos/${newId}/1.png`
            };
            
            products.push(newProduct);
            return this.saveProducts(products);
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            return false;
        }
    }

    // Salvar produtos
    saveProducts(products) {
        try {
            const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            data.products = products;
            data.lastUpdate = new Date().toISOString();
            
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }));
            return true;
        } catch (error) {
            console.error('Erro ao salvar produtos:', error);
            return false;
        }
    }

    // Atualizar produto
    updateProduct(productId, productData) {
        try {
            const products = this.getProducts();
            const index = products.findIndex(p => p.id === productId);
            
            if (index !== -1) {
                products[index] = { ...products[index], ...productData };
                return this.saveProducts(products);
            }
            return false;
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            return false;
        }
    }

    // Deletar produto
    deleteProduct(productId) {
        try {
            const products = this.getProducts();
            const filteredProducts = products.filter(p => p.id !== productId);
            return this.saveProducts(filteredProducts);
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            return false;
        }
    }

    // Atualizar estoque
    updateStock(productId, newStock) {
        return this.updateProduct(productId, { stock: newStock });
    }

    // Ajustar estoque
    adjustStock(productId, amount) {
        try {
            const products = this.getProducts();
            const product = products.find(p => p.id === productId);
            
            if (product) {
                const newStock = Math.max(0, product.stock + amount);
                return this.updateStock(productId, newStock);
            }
            return false;
        } catch (error) {
            console.error('Erro ao ajustar estoque:', error);
            return false;
        }
    }

    // Exportar dados
    exportData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            return null;
        }
    }

    // Importar dados
    importData(backupData) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(backupData));
            window.dispatchEvent(new CustomEvent('productsUpdated', { detail: backupData.products }));
            return true;
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return false;
        }
    }
}

// Instância global do gerenciador de dados
window.dataManager = new DataManager();