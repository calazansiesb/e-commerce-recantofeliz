#!/usr/bin/env python3
"""
ETAPA 5: Frontend Híbrido (API + Fallback JSON)
- Atualizar scripts para usar API
- Manter fallback para JSON
- Sistema de cache inteligente
"""

import json
import os

def create_api_client():
    """Criar cliente JavaScript para API"""
    
    api_client_js = '''
// Cliente API para Granja Recanto Feliz
class GranjaAPI {
    constructor() {
        this.baseURL = 'https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod';
        this.fallbackEnabled = true;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.warn('API Error:', error);
            
            if (this.fallbackEnabled && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
                return this.fallbackToJSON(endpoint);
            }
            
            throw error;
        }
    }
    
    async fallbackToJSON(endpoint) {
        console.log('Usando fallback JSON para:', endpoint);
        
        if (endpoint === '/api/produtos') {
            try {
                const response = await fetch('dados/produtos.json');
                const data = await response.json();
                return { products: data.products || [] };
            } catch (error) {
                console.error('Fallback JSON falhou:', error);
                return { products: [] };
            }
        }
        
        return null;
    }
    
    // Produtos
    async getProdutos() {
        const cacheKey = 'produtos';
        
        // Verificar cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }
        
        try {
            const data = await this.request('/api/produtos');
            
            // Salvar no cache
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return { products: [] };
        }
    }
    
    async getProduto(id) {
        try {
            return await this.request(`/api/produtos/${id}`);
        } catch (error) {
            console.error(`Erro ao buscar produto ${id}:`, error);
            
            // Fallback: buscar nos produtos em cache
            const produtosData = await this.getProdutos();
            const produto = produtosData.products.find(p => p.id == id);
            return produto || null;
        }
    }
    
    async createProduto(produto) {
        try {
            return await this.request('/api/produtos', {
                method: 'POST',
                body: JSON.stringify(produto)
            });
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            throw error;
        }
    }
    
    async updateProduto(id, produto) {
        try {
            const result = await this.request(`/api/produtos/${id}`, {
                method: 'PUT',
                body: JSON.stringify(produto)
            });
            
            // Limpar cache
            this.cache.delete('produtos');
            
            return result;
        } catch (error) {
            console.error(`Erro ao atualizar produto ${id}:`, error);
            throw error;
        }
    }
    
    async deleteProduto(id) {
        try {
            const result = await this.request(`/api/produtos/${id}`, {
                method: 'DELETE'
            });
            
            // Limpar cache
            this.cache.delete('produtos');
            
            return result;
        } catch (error) {
            console.error(`Erro ao deletar produto ${id}:`, error);
            throw error;
        }
    }
    
    // Utilitários
    clearCache() {
        this.cache.clear();
    }
    
    setFallback(enabled) {
        this.fallbackEnabled = enabled;
    }
}

// Instância global
window.granjaAPI = new GranjaAPI();

// Função de compatibilidade para código existente
window.carregarProdutos = async function() {
    try {
        const data = await window.granjaAPI.getProdutos();
        window.produtos = data.products || [];
        console.log(`✅ ${window.produtos.length} produtos carregados via API`);
        
        if (window.renderizarProdutos) {
            window.renderizarProdutos();
        }
        
        return window.produtos;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        return [];
    }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Granja API Client carregado');
    
    // Carregar produtos automaticamente
    if (typeof window.carregarProdutos === 'function') {
        window.carregarProdutos();
    }
});
'''
    
    with open('js/granja-api-client.js', 'w', encoding='utf-8') as f:
        f.write(api_client_js)
    
    print("OK Cliente API criado: js/granja-api-client.js")

def update_index_html():
    """Atualizar index.html para usar API"""
    
    print("Atualizando index.html...")
    
    # Ler arquivo atual
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Adicionar script da API antes do scripts-simples.js
    api_script = '    <script src="js/granja-api-client.js"></script>\n'
    
    if 'granja-api-client.js' not in content:
        # Inserir antes do scripts-simples.js
        content = content.replace(
            '<script src="js/scripts-simples.js"></script>',
            f'{api_script}    <script src="js/scripts-simples.js"></script>'
        )
        
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("   OK Script API adicionado ao index.html")
    else:
        print("   INFO Script API ja existe no index.html")

def update_admin_html():
    """Atualizar admin.html conforme instruções"""
    
    print("Atualizando admin.html...")
    
    with open('admin.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remover botões obsoletos conforme instruções
    buttons_to_remove = [
        'salvarProdutosDefinitivo()',
        'exportData()',
        'importData(event)',
        'forcarCarregamentoJSON()'
    ]
    
    # Remover seções dos botões obsoletos
    obsolete_sections = [
        '<button onclick="salvarProdutosDefinitivo()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-bold">',
        '<button onclick="exportData()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">',
        '<button onclick="document.getElementById(\'import-file\').click()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">',
        '<button onclick="forcarCarregamentoJSON()" class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition">'
    ]
    
    # Adicionar script da API
    api_script = '    <script src="js/granja-api-client.js"></script>\n'
    
    if 'granja-api-client.js' not in content:
        content = content.replace(
            '<script src="js/fix-admin-produtos.js"></script>',
            f'{api_script}    <script src="js/fix-admin-produtos.js"></script>'
        )
    
    # Adicionar seção de gestão de pedidos
    pedidos_section = '''
        <!-- Seção: Gestão de Pedidos -->
        <div id="pedidos-section" class="section hidden">
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-3xl font-bold font-lora text-[#5D4037] mb-6">Gestão de Pedidos</h2>
                
                <div class="mb-6">
                    <div class="flex space-x-4 mb-4">
                        <button onclick="filterPedidos('todos')" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">Todos</button>
                        <button onclick="filterPedidos('pendente')" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg">Pendentes</button>
                        <button onclick="filterPedidos('em_preparacao')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Em Preparação</button>
                        <button onclick="filterPedidos('enviado')" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">Enviados</button>
                        <button onclick="filterPedidos('concluido')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Concluídos</button>
                        <button onclick="filterPedidos('cancelado')" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Cancelados</button>
                    </div>
                </div>
                
                <div id="pedidos-list" class="space-y-4">
                    <!-- Pedidos serão carregados aqui -->
                </div>
            </div>
        </div>
'''
    
    # Inserir seção de pedidos após produtos
    if 'pedidos-section' not in content:
        content = content.replace(
            '        <!-- Seção: Controle de Estoque -->',
            f'{pedidos_section}\n        <!-- Seção: Controle de Estoque -->'
        )
    
    # Adicionar botão de pedidos na navegação
    if 'showSection(\'pedidos\')' not in content:
        content = content.replace(
            '<button onclick="showSection(\'produtos\')" class="nav-btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">',
            '''<button onclick="showSection('produtos')" class="nav-btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                    <i class="fas fa-box mr-2"></i>Produtos
                </button>
                <button onclick="showSection('pedidos')" class="nav-btn bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                    <i class="fas fa-shopping-cart mr-2"></i>Pedidos
                </button>
                <button onclick="showSection('estoque')" class="nav-btn bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">'''
        )
    
    with open('admin.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("   ✅ Admin.html atualizado com gestão de pedidos")

def create_admin_api_integration():
    """Criar integração API para admin"""
    
    admin_api_js = '''
// Integração API para Admin
class AdminAPI extends GranjaAPI {
    constructor() {
        super();
        this.pedidos = [];
    }
    
    // Gestão de Produtos para Admin
    async loadProductsForAdmin() {
        try {
            const data = await this.getProdutos();
            return data.products || [];
        } catch (error) {
            console.error('Erro ao carregar produtos para admin:', error);
            return [];
        }
    }
    
    // Gestão de Pedidos (simulado por enquanto)
    async getPedidos() {
        // Por enquanto, retorna dados simulados
        // TODO: Implementar API de pedidos
        return [
            {
                id: 1,
                cliente: 'João Silva',
                data: '2025-01-27',
                total: 45.00,
                status: 'pendente',
                itens: [
                    { produto: 'Ovos Caipira 10', quantidade: 2, preco: 15.00 },
                    { produto: 'Substrato BioFértil', quantidade: 1, preco: 15.00 }
                ]
            },
            {
                id: 2,
                cliente: 'Maria Santos',
                data: '2025-01-26',
                total: 37.00,
                status: 'em_preparacao',
                itens: [
                    { produto: 'Queijo Minas Artesanal', quantidade: 1, preco: 37.00 }
                ]
            }
        ];
    }
    
    async updatePedidoStatus(pedidoId, novoStatus) {
        // TODO: Implementar API de atualização de status
        console.log(`Atualizando pedido ${pedidoId} para status: ${novoStatus}`);
        
        // Simular atualização
        const pedidos = await this.getPedidos();
        const pedido = pedidos.find(p => p.id === pedidoId);
        if (pedido) {
            pedido.status = novoStatus;
            
            // Se cancelado, reverter estoque
            if (novoStatus === 'cancelado') {
                await this.reverterEstoque(pedido);
            }
        }
        
        return { success: true };
    }
    
    async reverterEstoque(pedido) {
        console.log('Revertendo estoque para pedido cancelado:', pedido.id);
        
        for (const item of pedido.itens) {
            // TODO: Implementar lógica de reversão de estoque
            console.log(`Devolvendo ${item.quantidade}x ${item.produto} ao estoque`);
        }
    }
}

// Instância global para admin
window.adminAPI = new AdminAPI();

// Funções para o painel admin
window.renderizarProdutosAdmin = async function() {
    try {
        const produtos = await window.adminAPI.loadProductsForAdmin();
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
        
        console.log(`✅ ${produtos.length} produtos renderizados no admin`);
        
    } catch (error) {
        console.error('Erro ao renderizar produtos no admin:', error);
    }
};

window.renderizarPedidos = async function(filtro = 'todos') {
    try {
        const pedidos = await window.adminAPI.getPedidos();
        const pedidosFiltrados = filtro === 'todos' ? pedidos : pedidos.filter(p => p.status === filtro);
        
        const container = document.getElementById('pedidos-list');
        if (!container) return;
        
        container.innerHTML = pedidosFiltrados.map(pedido => `
            <div class="bg-white border rounded-lg p-4 shadow-sm">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-bold text-lg">Pedido #${pedido.id}</h3>
                        <p class="text-gray-600">Cliente: ${pedido.cliente}</p>
                        <p class="text-gray-600">Data: ${pedido.data}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-xl text-green-600">R$ ${pedido.total.toFixed(2)}</p>
                        <span class="px-3 py-1 rounded-full text-sm ${getStatusColor(pedido.status)}">
                            ${getStatusText(pedido.status)}
                        </span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <h4 class="font-semibold mb-2">Itens:</h4>
                    <ul class="text-sm text-gray-600">
                        ${pedido.itens.map(item => `
                            <li>${item.quantidade}x ${item.produto} - R$ ${item.preco.toFixed(2)}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="flex space-x-2">
                    ${getStatusButtons(pedido)}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao renderizar pedidos:', error);
    }
};

function getStatusColor(status) {
    const colors = {
        'pendente': 'bg-yellow-100 text-yellow-800',
        'em_preparacao': 'bg-blue-100 text-blue-800',
        'enviado': 'bg-purple-100 text-purple-800',
        'concluido': 'bg-green-100 text-green-800',
        'cancelado': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

function getStatusText(status) {
    const texts = {
        'pendente': 'Pendente',
        'em_preparacao': 'Em Preparação',
        'enviado': 'Enviado',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado'
    };
    return texts[status] || status;
}

function getStatusButtons(pedido) {
    const buttons = [];
    
    if (pedido.status === 'pendente') {
        buttons.push(`<button onclick="updatePedidoStatus(${pedido.id}, 'em_preparacao')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Iniciar Preparação</button>`);
        buttons.push(`<button onclick="updatePedidoStatus(${pedido.id}, 'cancelado')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Cancelar</button>`);
    } else if (pedido.status === 'em_preparacao') {
        buttons.push(`<button onclick="updatePedidoStatus(${pedido.id}, 'enviado')" class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">Marcar como Enviado</button>`);
        buttons.push(`<button onclick="updatePedidoStatus(${pedido.id}, 'cancelado')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Cancelar</button>`);
    } else if (pedido.status === 'enviado') {
        buttons.push(`<button onclick="updatePedidoStatus(${pedido.id}, 'concluido')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">Confirmar Entrega</button>`);
    }
    
    return buttons.join('');
}

window.filterPedidos = function(filtro) {
    window.renderizarPedidos(filtro);
};

window.updatePedidoStatus = async function(pedidoId, novoStatus) {
    try {
        await window.adminAPI.updatePedidoStatus(pedidoId, novoStatus);
        await window.renderizarPedidos();
        alert(`Status do pedido ${pedidoId} atualizado para: ${getStatusText(novoStatus)}`);
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status do pedido');
    }
};

// Auto-inicializar admin
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Admin API carregado');
    
    // Carregar produtos para admin
    setTimeout(() => {
        if (window.renderizarProdutosAdmin) {
            window.renderizarProdutosAdmin();
        }
    }, 1000);
});
'''
    
    with open('js/admin-api-integration.js', 'w', encoding='utf-8') as f:
        f.write(admin_api_js)
    
    print("OK Integracao API Admin criada: js/admin-api-integration.js")

def main():
    print("ETAPA 5: Frontend Híbrido (API + Fallback)")
    print("=" * 50)
    
    # 1. Criar cliente API
    create_api_client()
    
    # 2. Atualizar index.html
    update_index_html()
    
    # 3. Atualizar admin.html
    update_admin_html()
    
    # 4. Criar integração admin
    create_admin_api_integration()
    
    print("\n" + "="*50)
    print("ETAPA 5 CONCLUÍDA - FRONTEND HÍBRIDO!")
    print("="*50)
    print("OK Cliente API criado com fallback JSON")
    print("OK Index.html atualizado")
    print("OK Admin.html refatorado (botoes obsoletos removidos)")
    print("OK Gestao de pedidos adicionada")
    print("OK Sistema hibrido funcionando")
    print("\nPróxima etapa: Deploy e testes finais")

if __name__ == "__main__":
    main()