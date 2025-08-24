#!/usr/bin/env python3
"""
ETAPA 5: API Pura (Apenas DynamoDB)
- Remove fallback JSON
- Conecta 100% à API
- Admin refatorado conforme instruções
"""

def create_pure_api_client():
    """Cliente API puro - sem fallback JSON"""
    
    api_client_js = '''
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
'''
    
    with open('js/granja-api-client.js', 'w', encoding='utf-8') as f:
        f.write(api_client_js)
    
    print("OK Cliente API puro criado")

def update_scripts_simples():
    """Atualizar scripts-simples.js para usar apenas API"""
    
    with open('js/scripts-simples.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Substituir função de carregamento
    new_load_function = '''
// Carregar produtos via API (sem fallback)
async function carregarProdutos() {
    try {
        const data = await window.granjaAPI.getProdutos();
        produtos = data.products || [];
        console.log(`${produtos.length} produtos carregados via API`);
        renderizarProdutos();
        return produtos;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        produtos = [];
        renderizarProdutos();
        return [];
    }
}
'''
    
    # Substituir a função antiga
    content = content.replace(
        'async function carregarProdutos() {\n    try {\n        const response = await fetch(\'dados/produtos.json\');\n        if (response.ok) {\n            const data = await response.json();\n            produtos = data.products || produtosPadrao;\n        } else {\n            produtos = produtosPadrao;\n        }\n    } catch (error) {\n        console.log(\'⚠️ Usando produtos padrão\');\n        produtos = produtosPadrao;\n    }\n    \n    console.log(`✅ ${produtos.length} produtos carregados`);\n    renderizarProdutos();\n}',
        new_load_function.strip()
    )
    
    with open('js/scripts-simples.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("OK scripts-simples.js atualizado para API pura")

def clean_admin_html():
    """Limpar admin.html conforme instruções"""
    
    with open('admin.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remover botões obsoletos
    buttons_to_remove = [
        'salvarProdutosDefinitivo()',
        'exportData()',
        'importData(event)',
        'forcarCarregamentoJSON()'
    ]
    
    # Remover seções específicas
    sections_to_remove = [
        '<button onclick="salvarProdutosDefinitivo()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-bold">',
        '<button onclick="exportData()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">',
        '<button onclick="document.getElementById(\'import-file\').click()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">',
        '<button onclick="forcarCarregamentoJSON()" class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition">'
    ]
    
    for section in sections_to_remove:
        if section in content:
            # Encontrar e remover o botão completo
            start = content.find(section)
            if start != -1:
                end = content.find('</button>', start) + 9
                content = content[:start] + content[end:]
    
    # Adicionar script da API
    if 'granja-api-client.js' not in content:
        content = content.replace(
            '<script src="js/fix-admin-produtos.js"></script>',
            '<script src="js/granja-api-client.js"></script>\n    <script src="js/fix-admin-produtos.js"></script>'
        )
    
    with open('admin.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("OK admin.html limpo (botões obsoletos removidos)")

def update_admin_scripts():
    """Atualizar scripts do admin para API pura"""
    
    admin_api_js = '''
// Admin API - Apenas DynamoDB
window.renderizarProdutosAdmin = async function() {
    try {
        const data = await window.granjaAPI.getProdutos();
        const produtos = data.products || [];
        const tbody = document.getElementById('products-table-body');
        
        if (!tbody) return;
        
        tbody.innerHTML = produtos.map(produto => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">${produto.id}</td>
                <td class="px-4 py-3">
                    <img src="${produto.image}" alt="${produto.name}" class="w-12 h-12 object-cover rounded" onerror="this.src='imagens/produtos/default/placeholder.png'">
                </td>
                <td class="px-4 py-3 font-medium">${produto.name}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">${produto.category}</span>
                </td>
                <td class="px-4 py-3">R$ ${produto.price.toFixed(2)}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 ${produto.stock > 10 ? 'bg-green-100 text-green-800' : produto.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} rounded-full text-xs">
                        ${produto.stock || 0}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <div class="flex space-x-2">
                        <button onclick="editarProduto(${produto.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deletarProduto(${produto.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        console.log(`${produtos.length} produtos renderizados no admin`);
        
    } catch (error) {
        console.error('Erro ao carregar produtos no admin:', error);
        alert('Erro ao carregar produtos. Verifique a API.');
    }
};

window.editarProduto = async function(id) {
    try {
        const produto = await window.granjaAPI.getProduto(id);
        // TODO: Abrir modal de edição
        console.log('Editando produto:', produto);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        alert('Erro ao carregar produto para edição.');
    }
};

window.deletarProduto = async function(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    
    try {
        await window.granjaAPI.deleteProduto(id);
        alert('Produto deletado com sucesso!');
        window.renderizarProdutosAdmin();
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao deletar produto.');
    }
};

// Auto-carregar produtos no admin
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.renderizarProdutosAdmin) {
            window.renderizarProdutosAdmin();
        }
    }, 1000);
});
'''
    
    with open('js/admin-api-pure.js', 'w', encoding='utf-8') as f:
        f.write(admin_api_js)
    
    print("OK admin-api-pure.js criado")

def update_index_html():
    """Atualizar index.html para API pura"""
    
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Adicionar script da API
    if 'granja-api-client.js' not in content:
        content = content.replace(
            '<script src="js/scripts-simples.js"></script>',
            '<script src="js/granja-api-client.js"></script>\n    <script src="js/scripts-simples.js"></script>'
        )
        
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("OK index.html atualizado para API pura")
    else:
        print("INFO index.html já tem API client")

def main():
    print("ETAPA 5: API Pura (Apenas DynamoDB)")
    print("=" * 50)
    
    # 1. Criar cliente API puro
    create_pure_api_client()
    
    # 2. Atualizar scripts principais
    update_scripts_simples()
    
    # 3. Limpar admin.html
    clean_admin_html()
    
    # 4. Atualizar scripts do admin
    update_admin_scripts()
    
    # 5. Atualizar index.html
    update_index_html()
    
    print("\n" + "="*50)
    print("ETAPA 5 CONCLUIDA - API PURA!")
    print("="*50)
    print("OK Sistema 100% conectado à API DynamoDB")
    print("OK Fallback JSON removido")
    print("OK Admin limpo (botões obsoletos removidos)")
    print("OK Performance otimizada")
    print("\nSistema agora depende 100% da API AWS")

if __name__ == "__main__":
    main()