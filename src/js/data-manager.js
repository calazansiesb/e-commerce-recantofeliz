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
                theme: "default",
                active: true
            },
            diaDosPais: {
                name: "Dia dos Pais",
                dateStart: "08-01",
                dateEnd: "08-15",
                colors: {
                    primary: "#1E3A8A",
                    secondary: "#7C2D12",
                    accent: "#0EA5E9",
                    background: "#EFF6FF"
                },
                bannerImage: "imagens/produtos/8/1.png",
                bannerText: "Especial Dia dos Pais - Presentes da Fazenda para o Herói da Família",
                theme: "diaDosPais",
                active: false
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
                bannerImage: "imagens/produtos/8/1.png",
                bannerText: "Especial Dia das Mães - Carinho da Fazenda para a Rainha do Lar",
                theme: "diadasMaes",
                active: false
            },
            natal: {
                name: "Natal",
                dateStart: "12-01",
                dateEnd: "12-31",
                colors: {
                    primary: "#DC2626",
                    secondary: "#059669",
                    accent: "#FBBF24",
                    background: "#FEF3C7"
                },
                bannerImage: "imagens/produtos/8/1.png",
                bannerText: "Feliz Natal - Sabores Especiais para sua Ceia de Natal",
                theme: "natal",
                active: false
            },
            pascoa: {
                name: "Páscoa",
                dateStart: "03-15",
                dateEnd: "04-15",
                colors: {
                    primary: "#7C3AED",
                    secondary: "#F59E0B",
                    accent: "#10B981",
                    background: "#F3E8FF"
                },
                bannerImage: "imagens/produtos/8/1.png",
                bannerText: "Páscoa Especial - Ovos Frescos para sua Celebração",
                theme: "pascoa",
                active: false
            }
        };
        
        this.init();
    }

    init() {
        // Carregar dados salvos ou usar padrão
        const savedData = localStorage.getItem(this.storageKey);
        if (!savedData) {
            const initialData = {
                products: this.defaultProducts,
                layouts: this.defaultLayouts,
                lastUpdate: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        } else {
            // Verificar se os layouts existem, se não, adicionar
            const data = JSON.parse(savedData);
            if (!data.layouts) {
                data.layouts = this.defaultLayouts;
                localStorage.setItem(this.storageKey, JSON.stringify(data));
            }
        }
    }

    // Obter todos os produtos
    getProducts() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data).products : this.defaultProducts;
    }

    // Obter produtos ativos (para o site principal)
    getActiveProducts() {
        return this.getProducts().filter(product => product.active !== false);
    }

    // Salvar produtos
    saveProducts(products) {
        const data = {
            products: products,
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        
        // Disparar evento para sincronização
        window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }));
        
        return true;
    }

    // Adicionar produto
    addProduct(productData) {
        const products = this.getProducts();
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        
        const newProduct = {
            id: newId,
            ...productData,
            stock: productData.stock || 0,
            active: true
        };
        
        products.push(newProduct);
        return this.saveProducts(products);
    }

    // Atualizar produto
    updateProduct(productId, productData) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === productId);
        
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            return this.saveProducts(products);
        }
        return false;
    }

    // Remover produto (soft delete)
    removeProduct(productId) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === productId);
        
        if (index !== -1) {
            products[index].active = false;
            return this.saveProducts(products);
        }
        return false;
    }

    // Deletar produto permanentemente
    deleteProduct(productId) {
        const products = this.getProducts();
        const filteredProducts = products.filter(p => p.id !== productId);
        return this.saveProducts(filteredProducts);
    }

    // Atualizar estoque
    updateStock(productId, newStock) {
        return this.updateProduct(productId, { stock: newStock });
    }

    // Ajustar estoque (adicionar/remover)
    adjustStock(productId, amount) {
        const products = this.getProducts();
        const product = products.find(p => p.id === productId);
        
        if (product) {
            const newStock = Math.max(0, product.stock + amount);
            return this.updateStock(productId, newStock);
        }
        return false;
    }

    // Obter estatísticas
    getStats() {
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
    }

    // Exportar dados para backup
    exportData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    // Importar dados de backup
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

    // Resetar para dados padrão
    reset() {
        localStorage.removeItem(this.storageKey);
        this.init();
        return this.getProducts();
    }

    // =============== MÉTODOS DE LAYOUT TEMÁTICO ===============

    // Obter configurações de layout
    getLayouts() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            const parsedData = JSON.parse(data);
            return parsedData.layouts || this.defaultLayouts;
        }
        return this.defaultLayouts;
    }

    // Salvar configurações de layout
    saveLayouts(layouts) {
        const data = localStorage.getItem(this.storageKey);
        const parsedData = data ? JSON.parse(data) : { products: this.defaultProducts };
        
        parsedData.layouts = layouts;
        parsedData.lastUpdate = new Date().toISOString();
        
        localStorage.setItem(this.storageKey, JSON.stringify(parsedData));
        
        // Disparar evento para sincronização
        window.dispatchEvent(new CustomEvent('layoutsUpdated', { detail: layouts }));
        
        return true;
    }

    // Obter layout ativo atual
    getCurrentLayout() {
        const layouts = this.getLayouts();
        const today = new Date();
        const currentDate = String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(today.getDate()).padStart(2, '0');

        // Verificar se há algum layout temático ativo para a data atual
        for (const [key, layout] of Object.entries(layouts)) {
            if (key !== 'default' && layout.active && layout.dateStart && layout.dateEnd) {
                if (this.isDateInRange(currentDate, layout.dateStart, layout.dateEnd)) {
                    return layout;
                }
            }
        }

        // Retornar layout padrão se nenhum temático estiver ativo
        return layouts.default || this.defaultLayouts.default;
    }

    // Verificar se a data está no range
    isDateInRange(currentDate, startDate, endDate) {
        const current = currentDate.replace('-', '');
        const start = startDate.replace('-', '');
        const end = endDate.replace('-', '');
        
        // Se end < start, significa que o período cruza o ano (ex: 12-15 a 01-15)
        if (end < start) {
            return current >= start || current <= end;
        } else {
            return current >= start && current <= end;
        }
    }

    // Ativar layout temático
    activateLayout(layoutKey) {
        const layouts = this.getLayouts();
        
        // Desativar todos os layouts temáticos
        Object.keys(layouts).forEach(key => {
            if (key !== 'default') {
                layouts[key].active = false;
            }
        });
        
        // Ativar o layout selecionado
        if (layouts[layoutKey] && layoutKey !== 'default') {
            layouts[layoutKey].active = true;
        }
        
        return this.saveLayouts(layouts);
    }

    // Desativar todos os layouts temáticos (volta ao padrão)
    activateDefaultLayout() {
        const layouts = this.getLayouts();
        
        Object.keys(layouts).forEach(key => {
            if (key !== 'default') {
                layouts[key].active = false;
            }
        });
        
        return this.saveLayouts(layouts);
    }

    // Atualizar layout específico
    updateLayout(layoutKey, layoutData) {
        const layouts = this.getLayouts();
        
        if (layouts[layoutKey]) {
            layouts[layoutKey] = { ...layouts[layoutKey], ...layoutData };
            return this.saveLayouts(layouts);
        }
        
        return false;
    }

    // Aplicar layout no site (método para ser chamado pelo site principal)
    applyCurrentLayout() {
        const currentLayout = this.getCurrentLayout();
        
        // Aplicar cores CSS customizadas
        if (currentLayout.colors) {
            const root = document.documentElement;
            root.style.setProperty('--primary-color', currentLayout.colors.primary);
            root.style.setProperty('--secondary-color', currentLayout.colors.secondary);
            root.style.setProperty('--accent-color', currentLayout.colors.accent);
            root.style.setProperty('--background-color', currentLayout.colors.background);
        }

        // Atualizar banner se existir
        const bannerImg = document.querySelector('#main-banner img');
        const bannerText = document.querySelector('#main-banner .banner-text');
        
        if (bannerImg && currentLayout.bannerImage) {
            bannerImg.src = currentLayout.bannerImage;
        }
        
        if (bannerText && currentLayout.bannerText) {
            bannerText.textContent = currentLayout.bannerText;
        }

        // Adicionar classe temática ao body
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${currentLayout.theme}`);

        return currentLayout;
    }
}

// Instância global do gerenciador de dados
window.dataManager = new DataManager();
