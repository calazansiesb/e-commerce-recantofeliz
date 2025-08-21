/**
 * 🗄️ Sistema de Gerenciamento de Pedidos - Recanto Feliz
 * 
 * Sistema robusto para persistência de pedidos usando SQLite/IndexedDB
 * com fallback para localStorage. Implementa boas práticas de desenvolvimento.
 * 
 * @author Sistema Recanto Feliz
 * @version 1.0.0
 */

class PedidosManager {
    constructor() {
        this.db = null;
        this.storageType = null;
        this.isInitialized = false;
        this.initializeDatabase();
    }

    /**
     * Inicializa o banco de dados com fallback
     */
    async initializeDatabase() {
        try {
            console.log('🔄 Inicializando sistema de pedidos...');
            
            // Tentar usar IndexedDB primeiro (mais confiável no navegador)
            await this.initIndexedDB();
            this.storageType = 'indexeddb';
            
            await this.createTables();
            this.isInitialized = true;
            
            console.log('✅ Sistema de pedidos inicializado com IndexedDB');
        } catch (error) {
            console.warn('⚠️ IndexedDB falhou, usando localStorage:', error);
            await this.initLocalStorage();
            this.storageType = 'localstorage';
            this.isInitialized = true;
        }
    }

    /**
     * Inicializa IndexedDB para persistência robusta
     */
    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('RecantoFelizDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store para pedidos
                if (!db.objectStoreNames.contains('pedidos')) {
                    const pedidosStore = db.createObjectStore('pedidos', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    pedidosStore.createIndex('numero_pedido', 'numero_pedido', { unique: true });
                    pedidosStore.createIndex('data_pedido', 'data_pedido');
                    pedidosStore.createIndex('status', 'status');
                    pedidosStore.createIndex('cliente_telefone', 'cliente_telefone');
                }
                
                // Store para itens do pedido
                if (!db.objectStoreNames.contains('itens_pedido')) {
                    const itensStore = db.createObjectStore('itens_pedido', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    itensStore.createIndex('pedido_id', 'pedido_id');
                    itensStore.createIndex('produto_nome', 'produto_nome');
                }
                
                // Store para histórico
                if (!db.objectStoreNames.contains('historico_pedidos')) {
                    const historicoStore = db.createObjectStore('historico_pedidos', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    historicoStore.createIndex('pedido_id', 'pedido_id');
                    historicoStore.createIndex('data_alteracao', 'data_alteracao');
                }
            };
        });
    }

    /**
     * Fallback para localStorage
     */
    async initLocalStorage() {
        this.db = {
            pedidos: JSON.parse(localStorage.getItem('pedidos_db') || '[]'),
            itens_pedido: JSON.parse(localStorage.getItem('itens_pedido_db') || '[]'),
            historico_pedidos: JSON.parse(localStorage.getItem('historico_pedidos_db') || '[]')
        };
    }

    /**
     * Cria as estruturas necessárias
     */
    async createTables() {
        if (this.storageType === 'localstorage') {
            // Estruturas já criadas no initLocalStorage
            return;
        }
        // IndexedDB já cria as estruturas no onupgradeneeded
    }

    /**
     * Gera número único do pedido
     */
    gerarNumeroPedido() {
        const now = new Date();
        const timestamp = now.getTime().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `RF${timestamp}${random}`;
    }

    /**
     * Calcula total do carrinho
     */
    calcularTotal(itensCarrinho) {
        return itensCarrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    /**
     * Valida dados do cliente
     */
    validarDadosCliente(dados) {
        const errors = [];
        
        if (!dados.nome || dados.nome.trim().length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (!dados.telefone || dados.telefone.trim().length < 10) {
            errors.push('Telefone deve ter pelo menos 10 dígitos');
        }
        
        if (!dados.endereco || dados.endereco.trim().length < 10) {
            errors.push('Endereço deve ser mais detalhado (mínimo 10 caracteres)');
        }
        
        if (!dados.documento || !this.validarDocumento(dados.documento)) {
            errors.push('Documento inválido');
        }
        
        return errors;
    }

    /**
     * Valida documento conforme tipo
     */
    validarDocumento(documento) {
        const [tipo, numero] = documento.split(':').map(s => s.trim());
        
        switch (tipo.toUpperCase()) {
            case 'CPF':
                return numero && numero.replace(/\D/g, '').length === 11;
            case 'RG':
                return numero && numero.trim().length >= 7;
            case 'CNH':
                return numero && numero.trim().length >= 9;
            default:
                return false;
        }
    }

    /**
     * Sanitiza dados de entrada
     */
    sanitizarDados(dados) {
        return {
            nome: this.sanitizeString(dados.nome),
            telefone: this.sanitizePhone(dados.telefone),
            endereco: this.sanitizeString(dados.endereco),
            documento: this.sanitizeString(dados.documento)
        };
    }

    sanitizeString(str) {
        if (!str) return '';
        return str.trim()
                  .replace(/[<>\"'\\]/g, '')
                  .substring(0, 255);
    }

    sanitizePhone(phone) {
        if (!phone) return '';
        return phone.replace(/[^\d\(\)\s\-]/g, '').substring(0, 20);
    }

    /**
     * Obtém IP do cliente (simulado para ambiente local)
     */
    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'localhost';
        }
    }

    /**
     * CRUD - Criar novo pedido
     */
    async criarPedido(dadosCliente, itensCarrinho) {
        if (!this.isInitialized) {
            throw new Error('Sistema de pedidos não inicializado');
        }

        // Validar dados
        const erros = this.validarDadosCliente(dadosCliente);
        if (erros.length > 0) {
            throw new Error('Dados inválidos: ' + erros.join(', '));
        }

        // Sanitizar dados
        const dadosLimpos = this.sanitizarDados(dadosCliente);
        
        const numeroPedido = this.gerarNumeroPedido();
        const valorTotal = this.calcularTotal(itensCarrinho);
        const agora = new Date().toISOString();

        const pedido = {
            numero_pedido: numeroPedido,
            data_pedido: agora,
            status: 'pendente',
            
            // Dados do Cliente
            cliente_nome: dadosLimpos.nome,
            cliente_telefone: dadosLimpos.telefone,
            cliente_endereco: dadosLimpos.endereco,
            cliente_documento_tipo: dadosLimpos.documento.split(':')[0].trim(),
            cliente_documento_numero: dadosLimpos.documento.split(':')[1].trim(),
            
            // Totais
            valor_total: valorTotal,
            quantidade_itens: itensCarrinho.length,
            
            // Metadados
            whatsapp_enviado: false,
            data_whatsapp: null,
            data_confirmacao: null,
            data_entrega: null,
            
            // Auditoria
            ip_origem: await this.getClientIP(),
            user_agent: navigator.userAgent.substring(0, 255),
            data_criacao: agora,
            data_atualizacao: agora
        };

        try {
            const pedidoId = await this.insertPedido(pedido);
            await this.inserirItensPedido(pedidoId, itensCarrinho);
            await this.registrarHistorico(pedidoId, null, 'pendente', 'Pedido criado via site');
            
            // Backup automático
            await this.realizarBackup();
            
            console.log(`✅ Pedido ${numeroPedido} criado com sucesso (ID: ${pedidoId})`);
            
            return { 
                id: pedidoId, 
                numero: numeroPedido,
                valor_total: valorTotal,
                quantidade_itens: itensCarrinho.length
            };
            
        } catch (error) {
            console.error('❌ Erro ao criar pedido:', error);
            throw new Error('Falha ao salvar pedido no banco de dados');
        }
    }

    /**
     * Insere pedido no banco
     */
    async insertPedido(pedido) {
        if (this.storageType === 'indexeddb') {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['pedidos'], 'readwrite');
                const store = transaction.objectStore('pedidos');
                const request = store.add(pedido);
                
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            const pedidos = this.db.pedidos;
            const id = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id || 0)) + 1 : 1;
            pedido.id = id;
            pedidos.push(pedido);
            localStorage.setItem('pedidos_db', JSON.stringify(pedidos));
            return id;
        }
    }

    /**
     * Insere itens do pedido
     */
    async inserirItensPedido(pedidoId, itensCarrinho) {
        for (const item of itensCarrinho) {
            const itemPedido = {
                pedido_id: pedidoId,
                produto_id: item.id,
                produto_nome: item.nome,
                quantidade: item.quantidade,
                preco_unitario: item.preco,
                preco_total: item.preco * item.quantidade
            };

            if (this.storageType === 'indexeddb') {
                await new Promise((resolve, reject) => {
                    const transaction = this.db.transaction(['itens_pedido'], 'readwrite');
                    const store = transaction.objectStore('itens_pedido');
                    const request = store.add(itemPedido);
                    
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
            } else {
                const itens = this.db.itens_pedido;
                const id = itens.length > 0 ? Math.max(...itens.map(i => i.id || 0)) + 1 : 1;
                itemPedido.id = id;
                itens.push(itemPedido);
                localStorage.setItem('itens_pedido_db', JSON.stringify(itens));
            }
        }
    }

    /**
     * Registra histórico de alterações
     */
    async registrarHistorico(pedidoId, statusAnterior, statusNovo, observacoes) {
        const historico = {
            pedido_id: pedidoId,
            status_anterior: statusAnterior,
            status_novo: statusNovo,
            observacoes: observacoes,
            data_alteracao: new Date().toISOString()
        };

        if (this.storageType === 'indexeddb') {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['historico_pedidos'], 'readwrite');
                const store = transaction.objectStore('historico_pedidos');
                const request = store.add(historico);
                
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } else {
            const historicos = this.db.historico_pedidos;
            const id = historicos.length > 0 ? Math.max(...historicos.map(h => h.id || 0)) + 1 : 1;
            historico.id = id;
            historicos.push(historico);
            localStorage.setItem('historico_pedidos_db', JSON.stringify(historicos));
        }
    }

    /**
     * Marca pedido como enviado via WhatsApp
     */
    async marcarWhatsAppEnviado(pedidoId) {
        const agora = new Date().toISOString();
        
        if (this.storageType === 'indexeddb') {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['pedidos'], 'readwrite');
                const store = transaction.objectStore('pedidos');
                const getRequest = store.get(pedidoId);
                
                getRequest.onsuccess = () => {
                    const pedido = getRequest.result;
                    pedido.whatsapp_enviado = true;
                    pedido.data_whatsapp = agora;
                    pedido.data_atualizacao = agora;
                    
                    const putRequest = store.put(pedido);
                    putRequest.onsuccess = () => resolve();
                    putRequest.onerror = () => reject(putRequest.error);
                };
                getRequest.onerror = () => reject(getRequest.error);
            });
        } else {
            const pedido = this.db.pedidos.find(p => p.id === pedidoId);
            if (pedido) {
                pedido.whatsapp_enviado = true;
                pedido.data_whatsapp = agora;
                pedido.data_atualizacao = agora;
                localStorage.setItem('pedidos_db', JSON.stringify(this.db.pedidos));
            }
        }
    }

    /**
     * Obtém todos os pedidos
     */
    async obterPedidos(limite = 50) {
        if (this.storageType === 'indexeddb') {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['pedidos'], 'readonly');
                const store = transaction.objectStore('pedidos');
                const index = store.index('data_pedido');
                const request = index.openCursor(null, 'prev'); // Mais recentes primeiro
                
                const pedidos = [];
                request.onsuccess = () => {
                    const cursor = request.result;
                    if (cursor && pedidos.length < limite) {
                        pedidos.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(pedidos);
                    }
                };
                request.onerror = () => reject(request.error);
            });
        } else {
            return this.db.pedidos
                .sort((a, b) => new Date(b.data_pedido) - new Date(a.data_pedido))
                .slice(0, limite);
        }
    }

    /**
     * Obtém itens de um pedido específico
     */
    async obterItensPedido(pedidoId) {
        if (this.storageType === 'indexeddb') {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['itens_pedido'], 'readonly');
                const store = transaction.objectStore('itens_pedido');
                const index = store.index('pedido_id');
                const request = index.getAll(pedidoId);
                
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } else {
            return this.db.itens_pedido.filter(item => item.pedido_id === pedidoId);
        }
    }

    /**
     * Realiza backup dos dados
     */
    async realizarBackup() {
        try {
            const dados = {
                pedidos: await this.obterPedidos(1000),
                timestamp: new Date().toISOString(),
                versao: '1.0.0'
            };
            
            const backup = JSON.stringify(dados);
            const chave = `backup_pedidos_${Date.now()}`;
            
            localStorage.setItem(chave, backup);
            
            // Manter apenas os 5 backups mais recentes
            this.limparBackupsAntigos();
            
            console.log(`💾 Backup realizado: ${chave}`);
        } catch (error) {
            console.error('❌ Erro ao realizar backup:', error);
        }
    }

    /**
     * Remove backups antigos
     */
    limparBackupsAntigos() {
        const backups = Object.keys(localStorage)
            .filter(key => key.startsWith('backup_pedidos_'))
            .sort()
            .reverse();
            
        // Remove backups além dos 5 mais recentes
        backups.slice(5).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    /**
     * Obtém métricas do sistema
     */
    async obterMetricas() {
        const pedidos = await this.obterPedidos(1000);
        const hoje = new Date().toDateString();
        
        const pedidosHoje = pedidos.filter(p => 
            new Date(p.data_pedido).toDateString() === hoje
        );
        
        const faturamentoHoje = pedidosHoje.reduce((total, p) => total + p.valor_total, 0);
        
        const statusDistribuicao = {};
        pedidos.forEach(p => {
            statusDistribuicao[p.status] = (statusDistribuicao[p.status] || 0) + 1;
        });
        
        return {
            totalPedidos: pedidos.length,
            pedidosHoje: pedidosHoje.length,
            faturamentoHoje,
            statusDistribuicao,
            ultimoBackup: this.obterUltimoBackup()
        };
    }

    /**
     * Obtém data do último backup
     */
    obterUltimoBackup() {
        const backups = Object.keys(localStorage)
            .filter(key => key.startsWith('backup_pedidos_'))
            .sort()
            .reverse();
            
        if (backups.length > 0) {
            const timestamp = backups[0].replace('backup_pedidos_', '');
            return new Date(parseInt(timestamp)).toLocaleString('pt-BR');
        }
        return 'Nunca';
    }

    /**
     * Exporta pedidos para CSV
     */
    async exportarCSV(dataInicio = null, dataFim = null) {
        let pedidos = await this.obterPedidos(1000);
        
        if (dataInicio) {
            pedidos = pedidos.filter(p => new Date(p.data_pedido) >= new Date(dataInicio));
        }
        
        if (dataFim) {
            pedidos = pedidos.filter(p => new Date(p.data_pedido) <= new Date(dataFim));
        }
        
        let csv = 'Número,Data,Cliente,Telefone,Endereço,Documento,Valor Total,Status,WhatsApp Enviado\n';
        
        for (const pedido of pedidos) {
            const linha = [
                pedido.numero_pedido,
                new Date(pedido.data_pedido).toLocaleString('pt-BR'),
                pedido.cliente_nome,
                pedido.cliente_telefone,
                `"${pedido.cliente_endereco}"`,
                `${pedido.cliente_documento_tipo}: ${pedido.cliente_documento_numero}`,
                `R$ ${pedido.valor_total.toFixed(2)}`,
                pedido.status,
                pedido.whatsapp_enviado ? 'Sim' : 'Não'
            ].join(',');
            
            csv += linha + '\n';
        }
        
        // Download do arquivo
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `pedidos_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`📊 Exportação CSV concluída: ${pedidos.length} pedidos`);
    }
}

// Inicializar sistema globalmente
window.pedidosManager = new PedidosManager();

console.log('🗄️ Sistema de Gerenciamento de Pedidos carregado');
