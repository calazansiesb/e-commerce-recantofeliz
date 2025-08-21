// Módulo de Administração de Estoque
class AdminStockModule {
    constructor() {
        this.estoque = [];
        this.alertas = [];
        this.init();
    }
    
    init() {
        console.log('📦 AdminStockModule inicializado');
        this.setupEstoquePadrao();
    }
    
    setupEstoquePadrao() {
        // Estoque baseado nos produtos padrão
        this.estoque = [
            { produtoId: 1, nome: 'Substrato BioFértil 3 Anos', categoria: 'fertilizantes', quantidade: 25, minimo: 10, maximo: 50, unidade: 'saco' },
            { produtoId: 2, nome: 'FertiGota', categoria: 'fertilizantes', quantidade: 40, minimo: 15, maximo: 60, unidade: 'litro' },
            { produtoId: 3, nome: 'Ovos Caipira 10', categoria: 'ovos', quantidade: 120, minimo: 50, maximo: 200, unidade: 'bandeja' },
            { produtoId: 4, nome: 'Ovos Caipira 20', categoria: 'ovos', quantidade: 80, minimo: 30, maximo: 150, unidade: 'bandeja' },
            { produtoId: 5, nome: 'Ovos Caipira 30', categoria: 'ovos', quantidade: 50, minimo: 20, maximo: 100, unidade: 'bandeja' },
            { produtoId: 6, nome: 'Galinha Caipira Picada', categoria: 'aves', quantidade: 15, minimo: 5, maximo: 30, unidade: 'kg' },
            { produtoId: 7, nome: 'Galinha Caipira Inteira', categoria: 'aves', quantidade: 8, minimo: 3, maximo: 20, unidade: 'unidade' }
        ];
    }
    
    load() {
        console.log('📦 Carregando estoque...');
        
        try {
            const savedEstoque = localStorage.getItem('granjaRecantoFelizEstoque');
            if (savedEstoque) {
                this.estoque = JSON.parse(savedEstoque);
                console.log(`✅ ${this.estoque.length} itens de estoque carregados`);
            } else {
                console.log('⚠️ Usando estoque padrão');
            }
        } catch (e) {
            console.log('⚠️ Erro ao carregar estoque, usando padrão');
        }
        
        this.verificarAlertas();
        this.render();
    }
    
    render() {
        const tbody = document.getElementById('stock-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = this.estoque.map(item => `
            <tr class="border-b hover:bg-gray-50 ${this.getRowClass(item)}">
                <td class="px-4 py-3">${item.produtoId}</td>
                <td class="px-4 py-3 font-medium">${item.nome}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${item.categoria}</span>
                </td>
                <td class="px-4 py-3">
                    <div class="flex items-center space-x-2">
                        <button onclick="window.adminStockModule.adjustStock(${item.produtoId}, -1)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">-</button>
                        <span class="font-bold ${this.getQuantityClass(item)}">${item.quantidade}</span>
                        <button onclick="window.adminStockModule.adjustStock(${item.produtoId}, 1)" class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">+</button>
                    </div>
                </td>
                <td class="px-4 py-3">${item.unidade}</td>
                <td class="px-4 py-3">
                    <div class="text-sm">
                        <div>Mín: ${item.minimo}</div>
                        <div>Máx: ${item.maximo}</div>
                    </div>
                </td>
                <td class="px-4 py-3">
                    ${this.getStatusBadge(item)}
                </td>
                <td class="px-4 py-3">
                    <div class="flex space-x-2">
                        <button onclick="window.adminStockModule.editItem(${item.produtoId})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="window.adminStockModule.adjustStockModal(${item.produtoId})" class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-plus-minus"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        this.renderAlertas();
        console.log(`✅ ${this.estoque.length} itens de estoque exibidos`);
    }
    
    renderAlertas() {
        const alertContainer = document.getElementById('stock-alerts');
        if (!alertContainer) return;
        
        if (this.alertas.length === 0) {
            alertContainer.innerHTML = '<div class="text-green-600 font-medium">✅ Todos os itens estão em níveis adequados</div>';
            return;
        }
        
        alertContainer.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-bold text-yellow-800 mb-2">⚠️ Alertas de Estoque</h4>
                <ul class="space-y-1">
                    ${this.alertas.map(alerta => `
                        <li class="text-sm text-yellow-700">
                            <strong>${alerta.nome}</strong>: ${alerta.mensagem}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    getRowClass(item) {
        if (item.quantidade <= item.minimo) return 'bg-red-50';
        if (item.quantidade >= item.maximo) return 'bg-yellow-50';
        return '';
    }
    
    getQuantityClass(item) {
        if (item.quantidade <= item.minimo) return 'text-red-600';
        if (item.quantidade >= item.maximo) return 'text-yellow-600';
        return 'text-green-600';
    }
    
    getStatusBadge(item) {
        if (item.quantidade <= item.minimo) {
            return '<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Estoque Baixo</span>';
        }
        if (item.quantidade >= item.maximo) {
            return '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Estoque Alto</span>';
        }
        return '<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span>';
    }
    
    verificarAlertas() {
        this.alertas = [];
        
        this.estoque.forEach(item => {
            if (item.quantidade <= item.minimo) {
                this.alertas.push({
                    produtoId: item.produtoId,
                    nome: item.nome,
                    tipo: 'baixo',
                    mensagem: `Quantidade atual (${item.quantidade}) está abaixo do mínimo (${item.minimo})`
                });
            }
            
            if (item.quantidade >= item.maximo) {
                this.alertas.push({
                    produtoId: item.produtoId,
                    nome: item.nome,
                    tipo: 'alto',
                    mensagem: `Quantidade atual (${item.quantidade}) está acima do máximo (${item.maximo})`
                });
            }
        });
    }
    
    adjustStock(produtoId, delta) {
        const item = this.estoque.find(i => i.produtoId === produtoId);
        if (!item) return;
        
        const novaQuantidade = Math.max(0, item.quantidade + delta);
        item.quantidade = novaQuantidade;
        
        this.saveEstoque();
        this.verificarAlertas();
        this.render();
        
        const acao = delta > 0 ? 'adicionada' : 'removida';
        this.showNotification(`Quantidade ${acao}: ${item.nome}`, 'success');
    }
    
    adjustStockModal(produtoId) {
        const item = this.estoque.find(i => i.produtoId === produtoId);
        if (!item) return;
        
        const acao = prompt(
            `${item.nome}\nQuantidade atual: ${item.quantidade}\n\nEscolha a ação:\n1 - Entrada de estoque\n2 - Saída de estoque\n3 - Definir quantidade\n\nDigite o número:`
        );
        
        if (!acao || !['1', '2', '3'].includes(acao)) return;
        
        let quantidade;
        if (acao === '1') {
            quantidade = parseInt(prompt('Quantidade a adicionar:'));
            if (quantidade > 0) {
                item.quantidade += quantidade;
                this.showNotification(`Adicionado ${quantidade} ${item.unidade}(s) de ${item.nome}`, 'success');
            }
        } else if (acao === '2') {
            quantidade = parseInt(prompt('Quantidade a remover:'));
            if (quantidade > 0) {
                item.quantidade = Math.max(0, item.quantidade - quantidade);
                this.showNotification(`Removido ${quantidade} ${item.unidade}(s) de ${item.nome}`, 'success');
            }
        } else if (acao === '3') {
            quantidade = parseInt(prompt('Nova quantidade total:'));
            if (quantidade >= 0) {
                item.quantidade = quantidade;
                this.showNotification(`Quantidade de ${item.nome} definida para ${quantidade}`, 'success');
            }
        }
        
        this.saveEstoque();
        this.verificarAlertas();
        this.render();
    }
    
    editItem(produtoId) {
        const item = this.estoque.find(i => i.produtoId === produtoId);
        if (!item) return;
        
        const novoMinimo = parseInt(prompt('Estoque mínimo:', item.minimo));
        if (novoMinimo >= 0) item.minimo = novoMinimo;
        
        const novoMaximo = parseInt(prompt('Estoque máximo:', item.maximo));
        if (novoMaximo >= item.minimo) item.maximo = novoMaximo;
        
        this.saveEstoque();
        this.verificarAlertas();
        this.render();
        this.showNotification('Configurações de estoque atualizadas!', 'success');
    }
    
    baixarRelatorio() {
        const relatorio = {
            data: new Date().toISOString(),
            estoque: this.estoque,
            alertas: this.alertas,
            resumo: {
                totalItens: this.estoque.length,
                itensComEstoqueBaixo: this.estoque.filter(i => i.quantidade <= i.minimo).length,
                itensComEstoqueAlto: this.estoque.filter(i => i.quantidade >= i.maximo).length
            }
        };
        
        const dataStr = JSON.stringify(relatorio, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `relatorio-estoque-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Relatório de estoque baixado!', 'success');
    }
    
    saveEstoque() {
        localStorage.setItem('granjaRecantoFelizEstoque', JSON.stringify(this.estoque));
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
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
    getEstoque() {
        return this.estoque;
    }
    
    getAlertas() {
        return this.alertas;
    }
    
    getItemById(produtoId) {
        return this.estoque.find(i => i.produtoId === produtoId);
    }
    
    atualizarEstoquePorVenda(produtoId, quantidade) {
        const item = this.estoque.find(i => i.produtoId === produtoId);
        if (item) {
            item.quantidade = Math.max(0, item.quantidade - quantidade);
            this.saveEstoque();
            this.verificarAlertas();
        }
    }
}

// Exportar para uso global
window.AdminStockModule = AdminStockModule;
