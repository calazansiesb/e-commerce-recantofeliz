// src/js/modules/product-manager.js
// Responsável por toda a lógica de produtos (CRUD)

class ProductManager {
    constructor() {
        this.storageKey = 'granjaRecantoFelizData';
        this.defaultProducts = [
            {
                id: 1,
                name: "Substrato BioFértil 3 Anos",
                category: "fertilizantes",
                slogan: "Mais do que Adubo: um substrato vivo e completo.",
                description: "Com um processo de maturação de 3 anos, nosso substrato é uma terra viva e completa, rica em matéria orgânica e microrganismos benéficos.",
                price: 15,
                image: "imagens/produtos/1.1.png",
                stock: 25,
                active: true
            },
            {
                id: 2,
                name: "FertiGota",
                category: "fertilizantes",
                slogan: "Adubo de galinha líquido e potente.",
                description: "Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas. Ideal para hortas, jardins e vasos.",
                price: 5,
                image: "imagens/produtos/2.1.png",
                stock: 40,
                active: true
            },
            {
                id: 3,
                name: "Ovos Caipira 10",
                category: "ovos",
                slogan: "10 ovos frescos da granja.",
                description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 10 unidades.",
                price: 15,
                image: "imagens/produtos/3.1.jpeg",
                stock: 120,
                active: true
            },
            {
                id: 4,
                name: "Ovos Caipira 20",
                category: "ovos",
                slogan: "20 ovos frescos da granja.",
                description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 20 unidades.",
                price: 25,
                image: "imagens/produtos/4.1.jpeg",
                stock: 80,
                active: true
            },
            {
                id: 5,
                name: "Ovos Caipira 30",
                category: "ovos",
                slogan: "30 ovos frescos da granja.",
                description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 30 unidades.",
                price: 34,
                image: "imagens/produtos/5.1.png",
                stock: 50,
                active: true
            },
            {
                id: 6,
                name: "Galinha Caipira Picada",
                category: "aves",
                slogan: "Galinha caipira cortada, pronta para cozinhar.",
                description: "Galinha caipira picada, sabor autêntico da roça. Ideal para receitas tradicionais.",
                price: 45,
                image: "imagens/produtos/6.1.png",
                stock: 15,
                active: true
            },
            {
                id: 7,
                name: "Galinha Caipira Inteira",
                category: "aves",
                slogan: "Galinha caipira inteira, fresca e saborosa.",
                description: "Galinha caipira inteira, criada solta e alimentada naturalmente. Perfeita para assados e cozidos.",
                price: 40,
                image: "imagens/produtos/7.1.png",
                stock: 8,
                active: true
            }
        ];
    }

    // CORREÇÃO CRÍTICA: Método principal para obter produtos
    async getProducts() {
        try {
            console.log('📊 ProductManager: Obtendo produtos...');
            
            // 1. SEMPRE tentar localStorage primeiro (fonte principal)
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                try {
                    const parsedData = JSON.parse(data);
                    if (parsedData.products && Array.isArray(parsedData.products) && parsedData.products.length > 0) {
                        console.log(`✅ localStorage: ${parsedData.products.length} produtos encontrados`);
                        console.log('🔍 Primeiro produto:', parsedData.products[0].name, 'R$', parsedData.products[0].price);
                        // Normalizar categorias antes de retornar
                        try {
                            const normalized = await this.normalizeProductCategories(parsedData.products);
                            parsedData.products = normalized;
                            try { localStorage.setItem(this.storageKey, JSON.stringify(parsedData)); } catch (e) { /* ignore */ }
                            return normalized;
                        } catch (normErr) {
                            console.warn('⚠️ Falha ao normalizar categorias:', normErr);
                            return parsedData.products;
                        }
                    }
                } catch (parseError) {
                    console.error('❌ Erro ao analisar localStorage:', parseError);
                }
            }
            
            console.log('⚠️ localStorage vazio ou inválido, verificando servidor...');

            // 1.5 Tentar buscar do servidor (arquivo JSON)
            try {
                const resp = await fetch('dados/produtos.json', { cache: 'no-store' });
                if (resp.ok) {
                    const serverData = await resp.json();
                    if (serverData.products && Array.isArray(serverData.products) && serverData.products.length > 0) {
                        console.log(`✅ Produtos carregados do servidor: ${serverData.products.length}`);
                        const normalized = await this.normalizeProductCategories(serverData.products);
                        const syncData = {
                            products: normalized,
                            lastUpdate: new Date().toISOString(),
                            syncedFromServer: true
                        };
                        try { localStorage.setItem(this.storageKey, JSON.stringify(syncData)); } catch (e) { /* ignore */ }
                        return normalized;
                    }
                }
            } catch (serverError) {
                console.warn('⚠️ Erro ao buscar produtos do servidor:', serverError);
            }

            console.log('⚠️ Inicializando com dados padrão...');
            
            // 3. Último recurso: dados padrão
            const defaultData = {
                products: this.defaultProducts,
                lastUpdate: new Date().toISOString(),
                initialized: true,
                source: 'default'
            };
            try {
                const normalized = await this.normalizeProductCategories(this.defaultProducts);
                defaultData.products = normalized;
                localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
                console.log(`✅ Dados padrão inicializados: ${normalized.length} produtos`);
                return normalized;
            } catch (normErr) {
                console.warn('⚠️ Falha ao normalizar categorias (padrão):', normErr);
                localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
                console.log(`✅ Dados padrão inicializados: ${this.defaultProducts.length} produtos`);
                return this.defaultProducts;
            }
            
        } catch (error) {
            console.error('❌ Erro crítico ao obter produtos:', error);
            return this.defaultProducts;
        }
    }

    // Obter produtos ativos
    async getActiveProducts() {
        const products = await this.getProducts();
        return products.filter(product => product.active !== false);
    }

    // Normalizar categories em uma lista de produtos
    async normalizeProductCategories(products) {
        if (!Array.isArray(products)) return products;

        // Construir mapa de nomes possíveis -> slug
        const map = new Map();
        map.set('parceiros', 'parceiros');
        map.set('fertilizantes', 'fertilizantes');
        map.set('aves', 'aves');
        map.set('ovos', 'ovos');

        // Normalize each product.category
        return products.map(p => {
            const prod = { ...p };
            const raw = (prod.category || '').toString();
            const slug = this.slugify(raw);

            // If the slug matches a known map entry, use it
            if (map.has(slug)) {
                prod.category = map.get(slug);
            } else if (map.has(raw.toLowerCase())) {
                prod.category = map.get(raw.toLowerCase());
            } else {
                // Heuristic: map Portuguese words to expected slugs
                if (slug.includes('ovo')) prod.category = 'ovos';
                else if (slug.includes('galinha') || slug.includes('ave') || slug.includes('aves')) prod.category = 'aves';
                else if (slug.includes('fert') || slug.includes('adubo') || slug.includes('substrato')) prod.category = 'fertilizantes';
                else prod.category = slug || 'outros';
            }

            return prod;
        });
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

    // Helper: slugify a category name
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

    // CORREÇÃO CRÍTICA: Salvar produtos com persistência garantida
    async saveProducts(products) {
        try {
            console.log(`💾 ProductManager SALVAMENTO: ${products.length} produtos...`);
            
            const saveData = {
                products: products,
                lastUpdate: new Date().toISOString(),
                savedAt: new Date().toISOString(),
                version: '2.0.1'
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            
            // Verificação imediata
            const check1 = localStorage.getItem(this.storageKey);
            if (!check1) {
                console.error('❌ FALHA CRÍTICA: localStorage não salvou!');
                return false;
            }
            
            let parsedCheck;
            try {
                parsedCheck = JSON.parse(check1);
            } catch (parseError) {
                console.error('❌ FALHA CRÍTICA: Dados corrompidos!');
                return false;
            }
            
            if (!parsedCheck.products || parsedCheck.products.length !== products.length) {
                console.error('❌ FALHA CRÍTICA: Dados incompletos!');
                return false;
            }
            
            console.log(`✅ ProductManager SUCESSO: ${parsedCheck.products.length} produtos salvos`);
            
            // Disparar evento de atualização
            window.dispatchEvent(new CustomEvent('productsUpdated', { 
                detail: { 
                    products: products, 
                    source: 'ProductManager',
                    timestamp: saveData.lastUpdate
                }
            }));
            
            return true;
            
        } catch (error) {
            console.error('❌ ERRO CRÍTICO ProductManager:', error);
            return false;
        }
    }

    // Adicionar produto
    async addProduct(productData) {
        try {
            const products = await this.getProducts();
            const newId = Math.max(...products.map(p => p.id), 0) + 1;
            
            const newProduct = {
                id: newId,
                ...productData,
                stock: productData.stock || 0,
                active: true,
                image: productData.image || `imagens/produtos/${newId}/1.png`,
                createdAt: new Date().toISOString()
            };
            
            products.push(newProduct);
            return await this.saveProducts(products);
        } catch (error) {
            console.error('❌ Erro ao adicionar produto:', error);
            return false;
        }
    }
}

// Disponibilizar globalmente
window.ProductManager = ProductManager;
