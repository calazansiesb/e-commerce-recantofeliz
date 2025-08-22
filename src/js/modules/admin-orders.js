// Módulo de Administração de Pedidos
class AdminOrdersModule {
    constructor() {
        this.pedidos = [];
        this.init();
    }
    
    init() {
        console.log('📋 AdminOrdersModule inicializado');
        this.setupPedidosPadrao();
    }
    
    setupPedidosPadrao() {
        // Pedidos padrão para demonstração
        this.pedidos = [
            {
                id: 1,
                cliente: 'João Silva',
                email: 'joao@email.com',
                telefone: '(11) 99999-9999',
                items: [
                    { produtoId: 3, nome: 'Ovos Caipira 10', quantidade: 2, preco: 18.00 }
                ],
                total: 36.00,
                status: 'pendente',
                data: '2025-08-20',
                observacoes: 'Entregar pela manhã'
            },
            {
                id: 2,
                cliente: 'Maria Santos',
                email: 'maria@email.com',
                telefone: '(11) 88888-8888',
                items: [
                    { produtoId: 1, nome: 'Substrato BioFértil 3 Anos', quantidade: 1, preco: 40.00 },
                    { produtoId: 4, nome: 'Ovos Caipira 20', quantidade: 1, preco: 30.00 }
                ],
                total: 70.00,
                status: 'confirmado',
                data: '2025-08-21',
                observacoes: ''
            }
        ];
    }
    
    load() {
        console.log('📋 Carregando pedidos...');
        
        try {
            const savedPedidos = localStorage.getItem('granjaRecantoFelizPedidos');
            if (savedPedidos) {
                this.pedidos = JSON.parse(savedPedidos);
                console.log(`✅ ${this.pedidos.length} pedidos carregados do localStorage`);
            } else {
                console.log('⚠️ Usando pedidos padrão');
            }
        } catch (e) {
            console.log('⚠️ Erro ao carregar pedidos, usando padrão');
        }
        
        this.render();
    }
    
    render() {
        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = this.pedidos.map(pedido => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">#${pedido.id}</td>
                <td class="px-4 py-3">
                    <div class="font-medium">${pedido.cliente}</div>
                    <div class="text-sm text-gray-500">${pedido.email}</div>
                </td>
                <td class="px-4 py-3">${pedido.telefone}</td>
                <td class="px-4 py-3">
                    <div class="text-sm">
                        ${pedido.items.map(item => 
                            `${item.quantidade}x ${item.nome}`
                        ).join('<br>')}
                    </div>
                </td>
                <td class="px-4 py-3 font-bold text-green-600">R$ ${pedido.total.toFixed(2)}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs ${this.getStatusClass(pedido.status)}">
                        ${this.getStatusText(pedido.status)}
                    </span>
                </td>
                <td class="px-4 py-3">${pedido.data}</td>
                <td class="px-4 py-3">
                    <div class="flex space-x-2">
                        <button onclick="window.adminOrdersModule.viewOrder(${pedido.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="window.adminOrdersModule.updateStatus(${pedido.id})" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-check"></i>
                        </button>
                        <button onclick="window.adminOrdersModule.deleteOrder(${pedido.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        console.log(`✅ ${this.pedidos.length} pedidos exibidos`);
    }
    
    getStatusClass(status) {
        const classes = {
            'pendente': 'bg-yellow-100 text-yellow-800',
            'confirmado': 'bg-blue-100 text-blue-800',
            'enviado': 'bg-purple-100 text-purple-800',
            'entregue': 'bg-green-100 text-green-800',
            'cancelado': 'bg-red-100 text-red-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }
    
    getStatusText(status) {
        const texts = {
            'pendente': 'Pendente',
            'confirmado': 'Confirmado',
            'enviado': 'Enviado',
            'entregue': 'Entregue',
            'cancelado': 'Cancelado'
        };
        return texts[status] || status;
    }
    
    viewOrder(id) {
        const pedido = this.pedidos.find(p => p.id === id);
        if (!pedido) return;
        
        const detalhes = `
PEDIDO #${pedido.id}

Cliente: ${pedido.cliente}
Email: ${pedido.email}
Telefone: ${pedido.telefone}
Data: ${pedido.data}
Status: ${this.getStatusText(pedido.status)}

ITENS:
${pedido.items.map(item => 
    `${item.quantidade}x ${item.nome} - R$ ${(item.quantidade * item.preco).toFixed(2)}`
).join('\n')}

TOTAL: R$ ${pedido.total.toFixed(2)}

Observações: ${pedido.observacoes || 'Nenhuma'}
        `;
        
        alert(detalhes);
    }
    
    updateStatus(id) {
        const pedido = this.pedidos.find(p => p.id === id);
        if (!pedido) return;
        
        const novoStatus = prompt(
            `Status atual: ${this.getStatusText(pedido.status)}\n\nNovo status:\n1 - Pendente\n2 - Confirmado\n3 - Enviado\n4 - Entregue\n5 - Cancelado\n\nDigite o número:`,
            pedido.status
        );
        
        const statusMap = {
            '1': 'pendente',
            '2': 'confirmado',
            '3': 'enviado',
            '4': 'entregue',
            '5': 'cancelado'
        };
        
        if (statusMap[novoStatus]) {
            pedido.status = statusMap[novoStatus];
            this.savePedidos();
            this.render();
            this.showNotification('Status atualizado com sucesso!', 'success');
        }
    }
    
    deleteOrder(id) {
        if (!confirm('Tem certeza que deseja excluir este pedido?')) return;
        
        this.pedidos = this.pedidos.filter(p => p.id !== id);
        this.savePedidos();
        this.render();
        this.showNotification('Pedido excluído com sucesso!', 'success');
    }
    
    addOrder(orderData) {
        const newOrder = {
            id: Math.max(...this.pedidos.map(p => p.id || 0)) + 1,
            status: 'pendente',
            data: new Date().toISOString().split('T')[0],
            ...orderData
        };
        
        this.pedidos.push(newOrder);
        this.savePedidos();
        this.render();
        this.showNotification('Pedido adicionado com sucesso!', 'success');
    }
    
    savePedidos() {
        localStorage.setItem('granjaRecantoFelizPedidos', JSON.stringify(this.pedidos));
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Métodos públicos
    getPedidos() {
        return this.pedidos;
    }
    
    getPedidosPorStatus(status) {
        return this.pedidos.filter(p => p.status === status);
    }
    
    getEstatisticas() {
        return {
            total: this.pedidos.length,
            pendentes: this.pedidos.filter(p => p.status === 'pendente').length,
            confirmados: this.pedidos.filter(p => p.status === 'confirmado').length,
            entregues: this.pedidos.filter(p => p.status === 'entregue').length,
            receita: this.pedidos.reduce((sum, p) => sum + p.total, 0)
        };
    }
}

// Exportar para uso global
window.AdminOrdersModule = AdminOrdersModule;
