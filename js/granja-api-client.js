
// Cliente API Puro - Granja Recanto Feliz
class GranjaAPI {
    constructor() {
        this.baseURL = 'https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod';
        this.cache = new Map();
        this.cacheTimeout = 2 * 60 * 1000; // 2 minutos
        this.retryCount = 3;
    }
    
    async request(endpoint, options = {}, retries = 0) {
        const url = `${this.baseURL}${endpoint}`;
        
        console.log(`API Request: ${url} (tentativa ${retries + 1})`);
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            console.log(`API Response: ${response.status}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API Error: ${response.status} - ${errorText}`);
                
                // Retry em caso de erro 500 (Internal Server Error)
                if (response.status >= 500 && retries < this.retryCount) {
                    console.log(`Tentando novamente em 2 segundos...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return this.request(endpoint, options, retries + 1);
                }
                
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log(`API Data:`, data);
            return data;
            
        } catch (error) {
            if (retries < this.retryCount && error.name !== 'SyntaxError') {
                console.log(`Erro de rede, tentando novamente...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.request(endpoint, options, retries + 1);
            }
            throw error;
        }
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
        // Aceitar tanto array direto quanto objeto { products: [...] }
        window.produtos = Array.isArray(data) ? data : (data.products || []);
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
