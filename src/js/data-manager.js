// Sistema de Dados Compartilhados - Granja Recanto Feliz
// Este arquivo gerencia a sincronização entre o site principal e a administração

class DataManager {
    constructor() {
        this.storageKey = 'granjaRecantoFelizData';
        this.historyKey = 'granjaRecantoFelizHistory';
        
        // Inicializar Managers
        this.productManager = new ProductManager();
        this.layoutManager = new LayoutManager();
        this.carouselManager = new CarouselManager();
        this.syncManager = new SyncManager();
        
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
            console.log('🚀 Inicializando DataManager...');
            const savedData = localStorage.getItem(this.storageKey);
            
            // Primeiro verificar se há dados no SQLite
            let sqliteProducts = [];
            if (typeof window !== 'undefined' && window.sqliteManager && window.sqliteManager.db) {
                try {
                    sqliteProducts = window.sqliteManager.getProducts();
                    console.log(`🗄️ SQLite: ${sqliteProducts.length} produtos encontrados`);
                } catch (sqliteError) {
                    console.warn('⚠️ Erro ao acessar SQLite:', sqliteError);
                }
            }
            
            if (!savedData) {
                console.log('🔄 localStorage vazio, inicializando...');
                
                // Se há dados no SQLite, usar eles; senão usar padrão
                const productsToUse = sqliteProducts.length > 0 ? sqliteProducts : this.productManager.defaultProducts;
                
                const initialData = {
                    products: productsToUse,
                    layouts: this.layoutManager.defaultLayouts,
                    carouselThemes: this.carouselManager.defaultCarouselThemes,
                    lastUpdate: new Date().toISOString(),
                    syncedFromSQLite: sqliteProducts.length > 0,
                    initialized: true
                };
                localStorage.setItem(this.storageKey, JSON.stringify(initialData));
                console.log(`✅ Inicializado com ${productsToUse.length} produtos`);
            } else {
                console.log('✅ Dados existentes encontrados no localStorage');
                const parsedData = JSON.parse(savedData);
                console.log(`📊 ${parsedData.products?.length || 0} produtos no localStorage`);
                
                // Verificar se os dados estão válidos
                if (!parsedData.products || !Array.isArray(parsedData.products) || parsedData.products.length === 0) {
                    console.log('⚠️ Dados inválidos no localStorage, restaurando padrão...');
                    const restoredData = {
                        products: this.productManager.defaultProducts,
                        layouts: this.layoutManager.defaultLayouts,
                        carouselThemes: this.carouselManager.defaultCarouselThemes,
                        lastUpdate: new Date().toISOString(),
                        restored: true,
                        initialized: true
                    };
                    localStorage.setItem(this.storageKey, JSON.stringify(restoredData));
                    console.log(`✅ Dados restaurados com ${this.productManager.defaultProducts.length} produtos padrão`);
                } else {
                    // Verificar se o localStorage tem menos produtos que o SQLite
                    if (sqliteProducts.length > 0 && parsedData.products.length < sqliteProducts.length) {
                        console.log('🔄 localStorage desatualizado, sincronizando com SQLite...');
                        
                        parsedData.products = sqliteProducts;
                        parsedData.lastUpdate = new Date().toISOString();
                        parsedData.syncedFromSQLite = true;
                        
                        localStorage.setItem(this.storageKey, JSON.stringify(parsedData));
                        console.log(`✅ Sincronizado: ${sqliteProducts.length} produtos do SQLite para localStorage`);
                    }
                    
                    // Marcar como inicializado
                    if (!parsedData.initialized) {
                        parsedData.initialized = true;
                        localStorage.setItem(this.storageKey, JSON.stringify(parsedData));
                    }
                    
                    // Debug: Mostrar primeiros produtos
                    if (parsedData.products && parsedData.products.length > 0) {
                        console.log('🔍 Primeiro produto:', parsedData.products[0].name, 'R$', parsedData.products[0].price);
                        console.log('🔍 Total de produtos ativos:', parsedData.products.filter(p => p.active !== false).length);
                        console.log('🔍 Último update:', parsedData.lastUpdate);
                    }
                }
            }
            
            console.log('✅ DataManager inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar DataManager:', error);
            // Fallback: garantir que há produtos padrão
            this.forceInitializeWithDefaults();
        }
    }
    
    // Método de emergência para inicializar com produtos padrão
    forceInitializeWithDefaults() {
        console.log('🆘 Inicialização de emergência com produtos padrão...');
        try {
            const emergencyData = {
                products: this.productManager.defaultProducts,
                layouts: this.defaultLayouts,
                carouselThemes: this.defaultCarouselThemes,
                lastUpdate: new Date().toISOString(),
                emergency: true,
                initialized: true
            };
            localStorage.setItem(this.storageKey, JSON.stringify(emergencyData));
            console.log(`🆘 Inicialização de emergência concluída com ${this.productManager.defaultProducts.length} produtos`);
        } catch (error) {
            console.error('❌ Falha na inicialização de emergência:', error);
        }
    }

    // Delegar para ProductManager
    async getProducts() {
        return await this.productManager.getProducts();
    }

    // Retorna grupos de categorias do arquivo `src/data/categories.json` ou fallback padrão
    async getCategories() {
        const defaultCategories = [
            { name: 'Todos', slug: 'todos', categories: [] },
            { name: 'Parceiros', slug: 'parceiros', categories: ['Mel', 'Laticinios', 'Outros'] },
            { name: 'Produtos da Granja', slug: 'produtos-da-granja', categories: ['Fertilizantes', 'Aves', 'Ovos'] }
        ];

        // tentar ler do servidor
        try {
            const resp = await fetch('data/categories.json', { cache: 'no-store' });
            if (resp.ok) {
                const json = await resp.json();
                if (json && Array.isArray(json.groups)) return json.groups;
            }
        } catch (err) {
            console.warn('Aviso: nao foi possivel carregar data/categories.json', err);
        }

        // fallback
        return defaultCategories;
    }

    // Helper: slugify a category name (remove accents, spaces, lowercase)
    slugify(text) {
        if (!text && text !== '') return '';
        return text.toString().normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-zA-Z0-9\s-]/g, '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    // Delegar para ProductManager
    async normalizeProductCategories(products) {
        return await this.productManager.normalizeProductCategories(products);
    }

    // Método para debug e verificação de integridade dos dados
    debugDataIntegrity() {
        const data = this.getData();
        console.log('🔍 DEBUG - Integridade dos dados:');
        console.log('- Total de produtos:', data.products?.length || 0);
        console.log('- Último update:', data.lastUpdate);
        console.log('- Produtos ativos:', data.products?.filter(p => p.active !== false).length || 0);
        
        if (data.products && data.products.length > 0) {
            const firstProduct = data.products[0];
            console.log('- Primeiro produto:', firstProduct.name, 'R$', firstProduct.price);
            
            const lastProduct = data.products[data.products.length - 1];
            console.log('- Último produto:', lastProduct.name, 'R$', lastProduct.price);
        }
        
        return data;
    }
    
    // Força refresh dos dados para resolver inconsistências
    forceRefresh() {
        console.log('🔄 Forçando refresh dos dados...');
        const data = this.getData();
        data.lastUpdate = new Date().toISOString();
        this.saveData(data);
        
        // Disparar evento de atualização
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('dataManagerRefreshed', {
                detail: { timestamp: data.lastUpdate, source: 'forceRefresh' }
            }));
        }
        
        return data;
    }

    // Restaurar produtos padrão se necessário
    restoreDefaultProducts() {
        console.log('🔄 Restaurando produtos padrão...');
        
        try {
            const currentData = this.getData();
            
            // Se há poucos produtos, restaurar os padrão
            if (!currentData.products || currentData.products.length < 5) {
                console.log('⚠️ Poucos produtos encontrados, restaurando padrão...');
                
                const restoredData = {
                    ...currentData,
                    products: this.productManager.defaultProducts,
                    lastUpdate: new Date().toISOString(),
                    restored: true,
                    restoredAt: new Date().toISOString()
                };
                
                localStorage.setItem(this.storageKey, JSON.stringify(restoredData));
                console.log(`✅ ${this.productManager.defaultProducts.length} produtos padrão restaurados`);
                
                return restoredData;
            } else {
                console.log('✅ Quantidade adequada de produtos, não é necessário restaurar');
                return currentData;
            }
        } catch (error) {
            console.error('❌ Erro ao restaurar produtos padrão:', error);
            return null;
        }
    }

    // Sincronizar dados do SQLite para localStorage
    syncFromSQLite() {
        console.log('🔄 Sincronizando dados do SQLite...');
        
        try {
            if (typeof window !== 'undefined' && window.sqliteManager && window.sqliteManager.db) {
                const sqliteProducts = window.sqliteManager.getProducts();
                console.log(`📊 SQLite: ${sqliteProducts.length} produtos encontrados`);
                
                if (sqliteProducts.length > 0) {
                    const currentData = this.getData();
                    currentData.products = sqliteProducts;
                    currentData.lastUpdate = new Date().toISOString();
                    currentData.syncedFromSQLite = true;
                    currentData.syncTimestamp = new Date().toISOString();
                    
                    localStorage.setItem(this.storageKey, JSON.stringify(currentData));
                    console.log(`✅ ${sqliteProducts.length} produtos sincronizados do SQLite`);
                    
                    // Disparar evento de atualização
                    window.dispatchEvent(new CustomEvent('productsUpdated', { 
                        detail: { source: 'sqliteSync', products: sqliteProducts }
                    }));
                    
                    return currentData;
                } else {
                    console.log('⚠️ SQLite está vazio, não há dados para sincronizar');
                    return null;
                }
            } else {
                console.log('⚠️ SQLiteManager não disponível');
                return null;
            }
        } catch (error) {
            console.error('❌ Erro ao sincronizar do SQLite:', error);
            return null;
        }
    }

    // MÉTODO REMOVIDO - Substituído pela versão corrigida acima
    
    // Método auxiliar para obter dados completos
    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                return JSON.parse(data);
            } else {
                // Retornar estrutura padrão
                return {
                    products: this.productManager.defaultProducts,
                    layouts: this.defaultLayouts,
                    carouselThemes: this.defaultCarouselThemes,
                    lastUpdate: new Date().toISOString(),
                    initialized: false
                };
            }
        } catch (error) {
            console.error('❌ Erro ao obter dados:', error);
            return {
                products: this.productManager.defaultProducts,
                layouts: this.defaultLayouts,
                carouselThemes: this.defaultCarouselThemes,
                lastUpdate: new Date().toISOString(),
                error: true
            };
        }
    }
    
    // Método auxiliar para salvar dados
    saveData(data) {
        try {
            data.lastUpdate = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar dados:', error);
            return false;
        }
    }

    // Obter produtos ativos
    async getActiveProducts() {
        const products = await this.getProducts();
        return products.filter(product => product.active !== false);
    }

    // Delegar para LayoutManager
    getLayouts() {
        return this.layoutManager.getLayouts();
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
    // Delegar para CarouselManager
    getCarouselThemes() {
        return this.carouselManager.getCarouselThemes();
    }

    // Delegar para CarouselManager
    addCarouselTheme(themeData) {
        // Usar o método do CarouselManager que já é mais robusto
        const themes = this.carouselManager.getCarouselThemes();
        const newTheme = {
            id: Date.now().toString(), // ID único baseado em timestamp
            ...themeData,
            active: themeData.active || false
        };
        themes.push(newTheme);
        return this.carouselManager.saveCarouselThemes(themes);
    }

    // Delegar para CarouselManager
    saveCarouselThemes(themes) {
        return this.carouselManager.saveCarouselThemes(themes);
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

    // Delegar para ProductManager
    addProduct(productData) {
        return this.productManager.addProduct(productData);
    }

    // Delegar para ProductManager
    async saveProducts(products) {
        return await this.productManager.saveProducts(products);
    }
    
    // Salvar no SQLite se disponível
    async saveToSQLiteIfAvailable(products) {
        try {
            console.log('🗄️ Tentando sincronizar com SQLite...');
            
            // Verificar se SQLite está disponível (sem depender de flags)
            if (window.sqliteManager && window.sqliteManager.db) {
                console.log('✅ SQLite disponível - sincronizando produtos...');
                
                // Para cada produto, tentar salvar/atualizar no SQLite
                for (const product of products) {
                    try {
                        // Verificar se produto já existe no SQLite
                        const existingProducts = window.sqliteManager.getProducts();
                        const existingProduct = existingProducts.find(p => p.id === product.id);
                        
                        if (existingProduct) {
                            // Atualizar produto existente
                            console.log(`🔄 Atualizando produto ${product.id} no SQLite...`);
                            const updated = window.sqliteManager.updateProduct(product.id, product);
                            if (updated) {
                                console.log(`✅ SQLite: Produto ${product.id} (${product.name}) atualizado - R$ ${product.price}`);
                            } else {
                                console.warn(`⚠️ Falha ao atualizar produto ${product.id} no SQLite`);
                            }
                        } else {
                            // Adicionar novo produto
                            console.log(`➕ Adicionando produto ${product.id} no SQLite...`);
                            const added = window.sqliteManager.addProduct(product);
                            if (added) {
                                console.log(`✅ SQLite: Produto ${product.id} (${product.name}) adicionado`);
                            } else {
                                console.warn(`⚠️ Falha ao adicionar produto ${product.id} no SQLite`);
                            }
                        }
                    } catch (productError) {
                        console.error(`❌ Erro ao processar produto ${product.id} no SQLite:`, productError);
                    }
                }
                
                // Verificar se a sincronização funcionou
                const updatedProducts = window.sqliteManager.getProducts();
                console.log(`🔍 Verificação pós-sincronização: ${updatedProducts.length} produtos no SQLite`);
                
                console.log('✅ Sincronização SQLite concluída');
                return true;
                
            } else {
                console.log('⚠️ SQLite não disponível - tentando inicializar...');
                
                // Tentar inicializar SQLite
                if (window.initSQLiteManager) {
                    try {
                        await window.initSQLiteManager();
                        // Tentar novamente após inicialização
                        if (window.sqliteManager && window.sqliteManager.db) {
                            console.log('🔄 SQLite inicializado, tentando sincronização novamente...');
                            return await this.saveToSQLiteIfAvailable(products);
                        }
                    } catch (initError) {
                        console.warn('⚠️ Falha ao inicializar SQLite:', initError);
                    }
                }
                
                console.log('ℹ️ Continuando apenas com localStorage');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Erro crítico na sincronização SQLite:', error);
            return false;
        }
    }

    // Enviar dados ao servidor (POST /admin/save-products)
    // Retorna true se o servidor respondeu com sucesso, false caso contrário
    async pushDataToServer(timeoutMs = 5000) {
        try {
            const endpoint = '/admin/save-products';
            const data = this.getData();

            // Obter token do localStorage ou perguntar ao usuário (uma vez)
            let token = localStorage.getItem('adminToken') || '';
            if (!token) {
                try {
                    token = prompt('Informe o ADMIN_TOKEN para enviar alterações ao servidor (ou deixe em branco para pular):');
                    if (token) localStorage.setItem('adminToken', token);
                } catch (promptError) {
                    console.warn('⚠️ Prompt de token não disponível:', promptError);
                }
            }

            // Se não temos token, não tentamos enviar
            if (!token) {
                console.log('ℹ️ Nenhum token fornecido — pulando envio ao servidor');
                return false;
            }

            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeoutMs);

            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Token': token
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(id);

            if (resp.ok) {
                console.log('✅ Dados enviados ao servidor com sucesso');
                return true;
            } else {
                console.warn('⚠️ Servidor respondeu com erro ao enviar dados:', resp.status, resp.statusText);
                return false;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('⚠️ Envio ao servidor abortado por timeout');
            } else {
                console.error('❌ Erro ao enviar dados ao servidor:', error);
            }
            return false;
        }
    }
    
    // Backup automático desabilitado - usando SQLite
    createAutoBackup(data) {
        console.log('💾 Backup automático desabilitado - usando SQLite');
        return true;
    }

    // Função desabilitada - usando SQLite
    saveProductsToCSV(products) {
        console.log('💾 CSV backup desabilitado - usando SQLite');
        return true;
    }

    // Delegar para ProductManager
    async updateProduct(productId, productData) {
        return await this.productManager.updateProduct(productId, productData);
    }

    // Delegar para ProductManager
    deleteProduct(productId) {
        return this.productManager.deleteProduct(productId);
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

    // Registrar histórico de alterações
    logProductChange(oldProduct, newProduct, action) {
        try {
            const history = JSON.parse(localStorage.getItem(this.historyKey) || '[]');
            const timestamp = new Date().toISOString();
            
            const logEntry = {
                id: Date.now(),
                timestamp,
                action, // CREATE, UPDATE, DELETE
                productId: newProduct?.id || oldProduct?.id,
                productName: newProduct?.name || oldProduct?.name,
                changes: []
            };
            
            if (action === 'UPDATE' && oldProduct && newProduct) {
                // Detectar mudanças específicas
                const fields = ['name', 'price', 'stock', 'category', 'slogan', 'description'];
                fields.forEach(field => {
                    if (oldProduct[field] !== newProduct[field]) {
                        logEntry.changes.push({
                            field,
                            oldValue: oldProduct[field],
                            newValue: newProduct[field]
                        });
                    }
                });
            }
            
            history.push(logEntry);
            
            // Manter apenas os últimos 1000 registros
            if (history.length > 1000) {
                history.splice(0, history.length - 1000);
            }
            
            localStorage.setItem(this.historyKey, JSON.stringify(history));
            
            console.log(`📝 Histórico registrado: ${action} - Produto ${logEntry.productId}`);
            return true;
        } catch (error) {
            console.error('Erro ao registrar histórico:', error);
            return false;
        }
    }
    
    // Obter histórico de alterações
    getProductHistory(productId = null, limit = 50) {
        try {
            const history = JSON.parse(localStorage.getItem(this.historyKey) || '[]');
            
            let filtered = history;
            if (productId) {
                filtered = history.filter(entry => entry.productId === productId);
            }
            
            return filtered
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, limit);
        } catch (error) {
            console.error('Erro ao obter histórico:', error);
            return [];
        }
    }
    
    // Exportar histórico como CSV
    exportHistoryToCSV() {
        try {
            const history = this.getProductHistory(null, 1000);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            
            const csvHeader = 'ID,Data_Hora,Acao,Produto_ID,Produto_Nome,Campo_Alterado,Valor_Anterior,Valor_Novo\n';
            
            const csvData = history.flatMap(entry => {
                if (entry.changes && entry.changes.length > 0) {
                    return entry.changes.map(change => [
                        entry.id,
                        entry.timestamp,
                        entry.action,
                        entry.productId,
                        `"${(entry.productName || '').replace(/"/g, '""')}"`,
                        change.field,
                        `"${(change.oldValue || '').toString().replace(/"/g, '""')}"`,
                        `"${(change.newValue || '').toString().replace(/"/g, '""')}"`
                    ].join(','));
                } else {
                    return [[
                        entry.id,
                        entry.timestamp,
                        entry.action,
                        entry.productId,
                        `"${(entry.productName || '').replace(/"/g, '""')}"`,
                        '',
                        '',
                        ''
                    ].join(',')];
                }
            }).join('\n');
            
            const csvContent = csvHeader + csvData;
            
            // Download do arquivo
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `historico_produtos_${timestamp}.csv`;
            link.click();
            
            return true;
        } catch (error) {
            console.error('Erro ao exportar histórico:', error);
            return false;
        }
    }
    
    // Obter backups CSV disponíveis
    getCSVBackups() {
        try {
            return JSON.parse(localStorage.getItem('csvBackups') || '[]');
        } catch (error) {
            console.error('Erro ao obter backups:', error);
            return [];
        }
    }
    
    // Download de backup específico
    downloadCSVBackup(backupIndex) {
        try {
            const backups = this.getCSVBackups();
            if (backups[backupIndex]) {
                const backup = backups[backupIndex];
                const blob = new Blob([backup.content], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = backup.filename;
                link.click();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro ao baixar backup:', error);
            return false;
        }
    }

    // Importar dados com histórico
    importData(backupData) {
        try {
            // Registrar importação no histórico
            const history = JSON.parse(localStorage.getItem(this.historyKey) || '[]');
            history.push({
                id: Date.now(),
                timestamp: new Date().toISOString(),
                action: 'IMPORT',
                productId: null,
                productName: 'Sistema',
                changes: [{
                    field: 'import',
                    oldValue: 'dados anteriores',
                    newValue: `${backupData.products?.length || 0} produtos importados`
                }]
            });
            localStorage.setItem(this.historyKey, JSON.stringify(history));
            
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
if (typeof window !== 'undefined') {
    window.dataManager = new DataManager();
}