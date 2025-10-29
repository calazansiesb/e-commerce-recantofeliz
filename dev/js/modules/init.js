// Garantir que os managers estejam globalmente disponíveis
window.GranjaManagers = {};

// Classe ProductManager
class ProductManager {
    constructor() {
        this.storageKey = 'granjaRecantoFelizData';
        this.products = [];
        this.initialized = false;
        this.initPromise = null;
    }

    async init() {
        if (this.initialized) return this.initPromise;
        if (this.initPromise) return this.initPromise;
        
        this.initPromise = (async () => {
            try {
                console.log('🚀 Inicializando ProductManager...');
                await this.loadProducts();
                this.initialized = true;
                console.log(`✅ ProductManager iniciado com ${this.products.length} produtos`);
                return this.products;
            } catch (error) {
                console.error('❌ Erro ao inicializar ProductManager:', error);
                this.initialized = false;
                this.initPromise = null;
                throw error;
            }
        })();
        
        return this.initPromise;
    }

    async loadProducts() {
        try {
            const response = await fetch('https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/produtos', {
                cache: 'no-store'
            });

            if (response.ok) {
                const data = await response.json();
                this.products = Array.isArray(data) ? data : (data.products || []);
                console.log(`✅ ${this.products.length} produtos carregados da API`);
                return this.products;
            }
        } catch (error) {
            console.error('❌ Erro ao carregar produtos:', error);
            this.products = [];
        }
        return this.products;
    }

    async getProducts() {
        if (!this.initialized) await this.init();
        return this.products;
    }
}

// Inicializar e expor globalmente
window.GranjaManagers.ProductManager = ProductManager;
window.ProductManager = new ProductManager();

// Iniciar carregamento
window.ProductManager.init().catch(console.error);