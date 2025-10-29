// Sistema de Dados Simplificado - Granja Recanto Feliz
class DataManager {
    constructor() {
        this.produtos = [];
        this.loadProducts();
    }

    // Carregar produtos da API
    async loadProducts() {
        try {
            const response = await fetch('https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/produtos', {
                cache: 'no-store'
            });
            
            if (response.ok) {
                this.produtos = await response.json();
                console.log(`✅ Carregados ${this.produtos.length} produtos via API`);
            } else {
                console.error(`❌ API retornou status ${response.status}`);
                this.produtos = [];
            }
        } catch (err) {
            console.error('❌ Erro ao carregar produtos:', err);
            this.produtos = [];
        }
    }

    // Obter produtos
    getProducts() {
        return this.produtos;
    }

    // Obter produto por ID
    getProduct(id) {
        return this.produtos.find(p => p.id === id);
    }

    // Adicionar produto
    async addProduct(produto) {
        try {
            const response = await globalThis.granjaAPI.createProduto(produto);
            await this.loadProducts();
            return response;
        } catch (error) {
            console.error('❌ Erro ao adicionar produto:', error);
            throw error;
        }
    }

    // Atualizar produto
    async updateProduct(id, produto) {
        try {
            const response = await globalThis.granjaAPI.updateProduto(id, produto);
            await this.loadProducts();
            return response;
        } catch (error) {
            console.error('❌ Erro ao atualizar produto:', error);
            throw error;
        }
    }

    // Excluir produto
    async deleteProduct(id) {
        try {
            const response = await globalThis.granjaAPI.deleteProduto(id);
            await this.loadProducts();
            return response;
        } catch (error) {
            console.error('❌ Erro ao excluir produto:', error);
            throw error;
        }
    }
}

// Instância global do gerenciador de dados
if (globalThis.window !== undefined) {
    globalThis.dataManager = new DataManager();
}