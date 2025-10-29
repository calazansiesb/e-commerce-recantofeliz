// Cliente API de Categorias - MESMA ESTRUTURA DOS PRODUTOS
class CategoriesAPI {
    constructor() {
        this.baseURL = 'https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod';
        this.cache = new Map();
        this.cacheTimeout = 2 * 60 * 1000; // 2 minutos
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        console.log(`Categories API Request: ${url}`);
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        console.log(`Categories API Response: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Categories API Error: ${response.status} - ${errorText}`);
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Categories API Data:`, data);
        return data;
    }
    
    // Categorias - MESMA LÓGICA DOS PRODUTOS
    async getCategorias() {
        const cacheKey = 'categorias';
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }
        
        // TEMPORÁRIO: Usar endpoint de produtos que funciona
        const data = await this.request('/api/produtos');
        // Simular categorias a partir dos produtos
        const categories = [
            { id: 'fertilizantes', name: 'fertilizantes', display: 'Fertilizantes', icon: 'fas fa-seedling', type: 'granja', active: true },
            { id: 'ovos', name: 'ovos', display: 'Ovos', icon: 'fas fa-egg', type: 'granja', active: true },
            { id: 'aves', name: 'aves', display: 'Aves', icon: 'fas fa-drumstick-bite', type: 'granja', active: true },
            { id: 'mel', name: 'mel', display: 'Mel e Derivados', icon: 'fas fa-cookie-bite', type: 'parceiro', active: true },
            { id: 'laticinios', name: 'laticinios', display: 'Laticínios', icon: 'fas fa-wine-glass', type: 'parceiro', active: true },
            { id: 'bebidas', name: 'bebidas', display: 'Bebidas', icon: 'fas fa-coffee', type: 'parceiro', active: true }
        ];
        const result = { categories: categories, total: categories.length };
        
        this.cache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
        });
        
        return result;
    }
    
    async getCategoria(id) {
        return await this.request(`/api/categorias/${id}`);
    }
    
    async createCategoria(categoria) {
        // TEMPORÁRIO: Simular criação
        console.log('Simulando criação de categoria:', categoria);
        this.cache.delete('categorias');
        return { message: 'Categoria criada (simulado)', category: categoria };
    }
    
    async updateCategoria(id, categoria) {
        // TEMPORÁRIO: Simular atualização
        console.log('Simulando atualização de categoria:', id, categoria);
        this.cache.delete('categorias');
        return { message: 'Categoria atualizada (simulado)', category: categoria };
    }
    
    async deleteCategoria(id) {
        // TEMPORÁRIO: Simular deleção
        console.log('Simulando deleção de categoria:', id);
        this.cache.delete('categorias');
        return { message: 'Categoria deletada (simulado)' };
    }
}

// Instância global
window.categoriesAPI = new CategoriesAPI();

// Função principal para carregar categorias
window.carregarCategorias = async function() {
    try {
        const data = await window.categoriesAPI.getCategorias();
        window.categorias = data.categories || [];
        console.log(`Categories API: ${window.categorias.length} categorias carregadas`);
        
        if (window.renderizarCategoriasAdmin) {
            window.renderizarCategoriasAdmin();
        }
        
        return window.categorias;
    } catch (error) {
        console.error('Erro Categories API:', error);
        alert('Erro ao carregar categorias. Verifique sua conexão.');
        return [];
    }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
    console.log('Categories API Client carregado');
    if (window.location.pathname.includes('admin')) {
        window.carregarCategorias();
    }
});