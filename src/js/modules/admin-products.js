// Módulo de Administração de Produtos - Baseado na versão funcional fix-admin-produtos.js
class AdminProductsModule {
    constructor() {
        this.produtos = [];
        this.init();
    }
    
    init() {
        console.log('📦 AdminProductsModule inicializado');
        this.setupProdutosPadrao();
        
        // Configurar eventos após um pequeno delay para garantir que o DOM esteja pronto
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
    }
    
    // Produtos padrão baseados na versão funcional
    setupProdutosPadrao() {
        this.produtos = [
            { id: 1, name: "Substrato BioFértil 3 Anos", category: "fertilizantes", slogan: "Mais do que Adubo: um substrato vivo e completo.", description: "Com um processo de maturação de 3 anos, nosso substrato é uma terra viva e completa, rica em matéria orgânica e microrganismos benéficos.", price: 40.00, image: "imagens/produtos/1/1.png", stock: 25, active: true },
            { id: 2, name: "FertiGota", category: "fertilizantes", slogan: "Adubo de galinha líquido e potente.", description: "Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas. Ideal para hortas, jardins e vasos.", price: 25.00, image: "imagens/produtos/2/1.png", stock: 40, active: true },
            { id: 3, name: "Ovos Caipira 10", category: "ovos", slogan: "10 ovos frescos da granja.", description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 10 unidades.", price: 18.00, image: "imagens/produtos/3/1.jpeg", stock: 120, active: true },
            { id: 4, name: "Ovos Caipira 20", category: "ovos", slogan: "20 ovos frescos da granja.", description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 20 unidades.", price: 30.00, image: "imagens/produtos/4/1.jpeg", stock: 80, active: true },
            { id: 5, name: "Ovos Caipira 30", category: "ovos", slogan: "30 ovos frescos da granja.", description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 30 unidades.", price: 45.00, image: "imagens/produtos/5/1.png", stock: 50, active: true },
            { id: 6, name: "Galinha Caipira Picada", category: "aves", slogan: "Galinha caipira cortada, pronta para cozinhar.", description: "Galinha caipira picada, sabor autêntico da roça. Ideal para receitas tradicionais.", price: 60.00, image: "imagens/produtos/6/1.png", stock: 15, active: true },
            { id: 7, name: "Galinha Caipira Inteira", category: "aves", slogan: "Galinha caipira inteira, fresca e saborosa.", description: "Galinha caipira inteira, criada solta e alimentada naturalmente. Perfeita para assados e cozidos.", price: 110.00, image: "imagens/produtos/7/1.png", stock: 8, active: true }
        ];
    }
    
    // Carregar dados do localStorage ou arquivo JSON (como versão funcional)
    async load() {
        console.log('📦 Carregando produtos...');
        
        try {
            // Tentar carregar do localStorage primeiro
            const savedData = localStorage.getItem('granjaRecantoFelizData');
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    if (data.products && data.products.length > 0) {
                        this.produtos = data.products;
                        console.log(`✅ ${data.products.length} produtos carregados do localStorage`);
                        this.render();
                        return;
                    }
                } catch (e) {
                    console.log('⚠️ Erro no localStorage, tentando arquivo JSON');
                }
            }
            
            // Se não tem localStorage, carregar do arquivo JSON
            const response = await fetch('data/produtos.json', { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                if (data.products && data.products.length > 0) {
                    this.produtos = data.products;
                    console.log(`✅ ${data.products.length} produtos carregados do arquivo JSON`);
                    
                    // Salvar no localStorage para sincronizar
                    localStorage.setItem('granjaRecantoFelizData', JSON.stringify({
                        products: this.produtos,
                        lastUpdate: new Date().toISOString()
                    }));
                }
            }
        } catch (error) {
            console.error('❌ Erro ao carregar produtos:', error);
            console.log('🔄 Usando produtos padrão');
        }
        
        this.render();
    }
    
    // Renderizar tabela de produtos (igual à versão funcional)
    render() {
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = this.produtos.map(p => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">${p.id}</td>
                <td class="px-4 py-3">
                    <img src="${p.image}" alt="${p.name}" class="w-16 h-16 object-cover rounded">
                </td>
                <td class="px-4 py-3 font-medium">${p.name}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${p.category}</span>
                </td>
                <td class="px-4 py-3 font-bold text-green-600">R$ ${p.price.toFixed(2)}</td>
                <td class="px-4 py-3">${p.stock}</td>
                <td class="px-4 py-3">
                    <div class="flex space-x-2">
                        <button onclick="window.adminProductsModule.editarProduto(${p.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="window.adminProductsModule.excluirProduto(${p.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        console.log(`✅ ${this.produtos.length} produtos exibidos no admin`);
    }
    
    editarProduto(id) {
        const produto = this.produtos.find(p => p.id === id);
        if (!produto) return;
        
        document.getElementById('product-id').value = produto.id;
        document.getElementById('product-name').value = produto.name;
        document.getElementById('product-category').value = produto.category;
        document.getElementById('product-slogan').value = produto.slogan;
        document.getElementById('product-description').value = produto.description || '';
        document.getElementById('product-price').value = produto.price;
        document.getElementById('product-stock').value = produto.stock;
        
        document.getElementById('modal-title').textContent = 'Editar Produto';
        document.getElementById('product-modal').classList.remove('hidden');
    }
    
    excluirProduto(id) {
        if (confirm(`Excluir produto ${id}?`)) {
            const index = this.produtos.findIndex(p => p.id === id);
            if (index > -1) {
                this.produtos.splice(index, 1);
                this.salvarNoLocalStorage(); // Salvar após excluir
                this.render();
                this.showNotification('Produto excluído!', 'success');
            }
        }
    }
    
    openProductModal() {
        const form = document.getElementById('product-form');
        if (form) form.reset();
        
        document.getElementById('product-id').value = '';
        document.getElementById('modal-title').textContent = 'Novo Produto';
        document.getElementById('product-modal').classList.remove('hidden');
    }
    
    closeProductModal() {
        document.getElementById('product-modal').classList.add('hidden');
    }
    
    setupEventListeners() {
        // Setup do formulário (igual à versão funcional)
        const form = document.getElementById('product-form');
        if (form) {
            // Remover listeners anteriores para evitar duplicação
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const id = document.getElementById('product-id').value;
                const produtoData = {
                    name: document.getElementById('product-name').value,
                    category: document.getElementById('product-category').value,
                    slogan: document.getElementById('product-slogan').value,
                    description: document.getElementById('product-description').value,
                    price: parseFloat(document.getElementById('product-price').value),
                    stock: parseInt(document.getElementById('product-stock').value),
                    active: true
                };
                
                if (id) {
                    // Editar produto existente
                    const produto = this.produtos.find(p => p.id == id);
                    if (produto) {
                        Object.assign(produto, produtoData);
                        this.showNotification('Produto atualizado!', 'success');
                    }
                } else {
                    // Novo produto
                    const novoId = Math.max(...this.produtos.map(p => p.id)) + 1;
                    this.produtos.push({
                        id: novoId,
                        image: `imagens/produtos/${novoId}/1.png`,
                        ...produtoData
                    });
                    this.showNotification('Produto adicionado!', 'success');
                }
                
                // CRÍTICO: Salvar no localStorage após qualquer alteração
                this.salvarNoLocalStorage();
                this.render();
                this.closeProductModal();
            });
        } else {
            console.warn('⚠️ Formulário product-form não encontrado');
        }
        
        // Tornar funções globais para compatibilidade
        window.editarProduto = (id) => this.editarProduto(id);
        window.excluirProduto = (id) => this.excluirProduto(id);
        window.openProductModal = () => this.openProductModal();
        window.closeProductModal = () => this.closeProductModal();
    }
    
    // Sistema de download igual à versão funcional
    salvarProdutosDefinitivo() {
        const dadosParaSalvar = {
            products: this.produtos,
            lastUpdate: new Date().toISOString(),
            version: "1.0"
        };
        
        const dataStr = JSON.stringify(dadosParaSalvar, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'produtos.json';
        
        const instrucoes = `Para tornar as alterações DEFINITIVAS:

1. Um arquivo 'produtos.json' será baixado
2. Substitua o arquivo em 'src/data/produtos.json'
3. As alterações ficarão permanentes

Baixar arquivo agora?`;
        
        if (confirm(instrucoes)) {
            link.click();
            this.showNotification('✅ Arquivo baixado! Substitua o arquivo em src/data/produtos.json', 'success');
        }
    }
    
    showNotification(message, type = 'info') {
        // Sistema de notificação simples
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
    
    // Salvar produtos no localStorage (compatível com fix-admin-produtos.js)
    salvarNoLocalStorage() {
        try {
            const dadosParaSalvar = {
                products: this.produtos,
                lastUpdate: new Date().toISOString(),
                version: "2.0-modular"
            };
            
            localStorage.setItem('granjaRecantoFelizData', JSON.stringify(dadosParaSalvar));
            console.log(`✅ ${this.produtos.length} produtos salvos no localStorage`);
            
            // Sincronizar com o arquivo JSON também
            this.sincronizarComArquivo();
            
        } catch (error) {
            console.error('❌ Erro ao salvar no localStorage:', error);
            this.showNotification('Erro ao salvar produtos!', 'error');
        }
    }
    
    // Sincronizar dados com arquivo JSON (para backup)
    sincronizarComArquivo() {
        try {
            // Esta função mantém compatibilidade com o sistema existente
            if (window.syncManager && typeof window.syncManager.syncProducts === 'function') {
                window.syncManager.syncProducts(this.produtos);
            }
        } catch (error) {
            console.log('⚠️ SyncManager não disponível:', error);
        }
    }
    
    // Métodos públicos para integração
    getProdutos() {
        return this.produtos;
    }
    
    addProduto(produto) {
        const novoId = Math.max(...this.produtos.map(p => p.id)) + 1;
        this.produtos.push({ id: novoId, ...produto });
        this.salvarNoLocalStorage();
        this.render();
    }
}

// Exportar para uso global
window.AdminProductsModule = AdminProductsModule;
