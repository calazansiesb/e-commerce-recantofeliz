
// Cliente API Puro - Granja Recanto Feliz
class GranjaAPI {
    constructor() {
        this.baseURL = 'https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod';
        this.cache = new Map();
        this.cacheTimeout = 2 * 60 * 1000; // 2 minutos
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // Produtos
    async getProdutos() {
        const cacheKey = 'produtos';
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }
        
        const data = await this.request('/api/produtos');
        
        this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });
        
        return data;
    }
    
    async getProduto(id) {
        return await this.request(`/api/produtos/${id}`);
    }
    
    async createProduto(produto) {
        const result = await this.request('/api/produtos', {
            method: 'POST',
            body: JSON.stringify(produto)
        });
        this.cache.delete('produtos');
        return result;
    }
    
    async updateProduto(id, produto) {
        const result = await this.request(`/api/produtos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(produto)
        });
        this.cache.delete('produtos');
        return result;
    }
    
    async deleteProduto(id) {
        const result = await this.request(`/api/produtos/${id}`, {
            method: 'DELETE'
        });
        this.cache.delete('produtos');
        return result;
    }
}

// Instância global
window.granjaAPI = new GranjaAPI();

// Função principal para carregar produtos
window.carregarProdutos = async function() {
    try {
        const data = await window.granjaAPI.getProdutos();
        window.produtos = data.products || [];
        console.log(`API: ${window.produtos.length} produtos carregados`);
        
        if (window.renderizarProdutos) {
            window.renderizarProdutos();
        }
        
        return window.produtos;
    } catch (error) {
        console.error('Erro API:', error);
        alert('Erro ao carregar produtos. Verifique sua conexão.');
        return [];
    }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
    console.log('API Client carregado');
    window.carregarProdutos();
});
