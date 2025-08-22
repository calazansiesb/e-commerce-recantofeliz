// Correção específica para problema de salvamento de produtos
// Esta correção substitui a função handleProductSubmit com uma versão simplificada e funcional

console.log('🔧 Carregando correção para salvamento de produtos...');

class ProductSaveFixer {
    constructor() {
        this.debugMode = true;
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        }[type] || 'ℹ️';
        
        console.log(`${prefix} [SAVE-FIX ${timestamp}] ${message}`);
    }

    // Função de salvamento corrigida e simplificada
    async handleProductSubmitFixed(e) {
        e.preventDefault();
        this.log('🚀 INICIANDO SALVAMENTO CORRIGIDO');
        
        try {
            // 1. Coletar dados do formulário
            const formData = this.collectFormData();
            if (!formData) {
                this.log('❌ Falha na validação dos dados', 'error');
                return;
            }
            
            this.log(`📝 Dados coletados: ${formData.name} - R$ ${formData.price}`);
            
            // 2. Determinar se é edição ou criação
            const isEdit = formData.id && formData.id !== '';
            this.log(`🔄 Modo: ${isEdit ? 'Edição' : 'Criação'}`);
            
            // 3. Salvar nos sistemas disponíveis
            const saveResult = await this.saveToAllSystems(formData, isEdit);
            
            if (saveResult.success) {
                this.log('✅ Produto salvo com sucesso!', 'success');
                this.showNotification(isEdit ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!', 'success');
                
                // 4. Atualizar interface
                await this.updateInterface();
                
                // 5. Fechar modal
                this.closeModal();
                
            } else {
                this.log('❌ Falha ao salvar produto', 'error');
                this.showNotification('Erro ao salvar produto! Verifique os dados e tente novamente.', 'error');
            }
            
        } catch (error) {
            this.log(`❌ Erro durante salvamento: ${error.message}`, 'error');
            this.showNotification('Erro interno durante salvamento!', 'error');
        }
    }

    // Coletar e validar dados do formulário
    collectFormData() {
        try {
            const productId = document.getElementById('product-id')?.value || '';
            const productName = document.getElementById('product-name')?.value?.trim() || '';
            const productPrice = document.getElementById('product-price')?.value || '';
            const productStock = document.getElementById('product-stock')?.value || '';
            const productCategory = document.getElementById('product-category')?.value || '';
            const productSlogan = document.getElementById('product-slogan')?.value?.trim() || '';
            const productDescription = document.getElementById('product-description')?.value?.trim() || '';
            const productType = document.getElementById('product-type')?.value || 'granja';
            
            // Validações
            if (!productName) {
                this.showNotification('Nome do produto é obrigatório!', 'error');
                return null;
            }
            
            if (!productPrice || parseFloat(productPrice) <= 0) {
                this.showNotification('Preço deve ser maior que zero!', 'error');
                return null;
            }
            
            if (!productStock || parseInt(productStock) < 0) {
                this.showNotification('Estoque deve ser um número válido!', 'error');
                return null;
            }
            
            if (!productCategory) {
                this.showNotification('Categoria é obrigatória!', 'error');
                return null;
            }
            
            const productData = {
                id: productId ? parseInt(productId) : null,
                name: productName,
                slogan: productSlogan,
                description: productDescription,
                price: parseFloat(productPrice),
                stock: parseInt(productStock),
                category: productCategory,
                active: true,
                lastUpdate: new Date().toISOString()
            };
            
            // Dados de parceiro se aplicável
            if (productType === 'parceiro') {
                const partnerName = document.getElementById('partner-name')?.value?.trim() || '';
                if (!partnerName) {
                    this.showNotification('Nome do parceiro é obrigatório!', 'error');
                    return null;
                }
                
                productData.partner = {
                    name: partnerName,
                    producer: document.getElementById('partner-producer')?.value?.trim() || '',
                    location: document.getElementById('partner-location')?.value?.trim() || '',
                    description: document.getElementById('partner-description')?.value?.trim() || ''
                };
            }
            
            return productData;
            
        } catch (error) {
            this.log(`❌ Erro ao coletar dados: ${error.message}`, 'error');
            return null;
        }
    }

    // Salvar em todos os sistemas disponíveis
    async saveToAllSystems(productData, isEdit) {
        const results = {
            dataManager: false,
            sqlite: false,
            localStorage: false,
            success: false
        };
        
        // 1. Tentar DataManager primeiro
        if (window.dataManager) {
            try {
                this.log('💾 Salvando via DataManager...');
                
                let dmResult;
                if (isEdit) {
                    dmResult = await window.dataManager.updateProduct(productData.id, productData);
                } else {
                    dmResult = await window.dataManager.addProduct(productData);
                }
                
                results.dataManager = !!dmResult;
                this.log(`DataManager: ${results.dataManager ? 'Sucesso' : 'Falhou'}`);
                
            } catch (dmError) {
                this.log(`❌ Erro no DataManager: ${dmError.message}`, 'error');
            }
        }
        
        // 2. Tentar SQLite se disponível
        if (window.sqliteManager && window.sqliteManager.db) {
            try {
                this.log('💾 Salvando via SQLite...');
                
                if (isEdit) {
                    results.sqlite = window.sqliteManager.updateProduct(productData);
                } else {
                    results.sqlite = window.sqliteManager.saveProduct(productData);
                }
                
                this.log(`SQLite: ${results.sqlite ? 'Sucesso' : 'Falhou'}`);
                
            } catch (sqliteError) {
                this.log(`❌ Erro no SQLite: ${sqliteError.message}`, 'error');
            }
        }
        
        // 3. Fallback para localStorage direto
        if (!results.dataManager && !results.sqlite) {
            try {
                this.log('💾 Salvando via localStorage direto...');
                results.localStorage = this.saveToLocalStorageDirect(productData, isEdit);
                this.log(`localStorage: ${results.localStorage ? 'Sucesso' : 'Falhou'}`);
            } catch (lsError) {
                this.log(`❌ Erro no localStorage: ${lsError.message}`, 'error');
            }
        }
        
        results.success = results.dataManager || results.sqlite || results.localStorage;
        
        this.log('📊 Resultado final:');
        this.log(`  - DataManager: ${results.dataManager ? '✅' : '❌'}`);
        this.log(`  - SQLite: ${results.sqlite ? '✅' : '❌'}`);
        this.log(`  - localStorage: ${results.localStorage ? '✅' : '❌'}`);
        this.log(`  - Sucesso geral: ${results.success ? '✅' : '❌'}`);
        
        return results;
    }

    // Salvamento direto no localStorage como último recurso
    saveToLocalStorageDirect(productData, isEdit) {
        try {
            const storageKey = 'granjaRecantoFelizData';
            let data = JSON.parse(localStorage.getItem(storageKey) || '{}');
            
            if (!data.products) {
                data.products = [];
            }
            
            if (isEdit) {
                const index = data.products.findIndex(p => p.id == productData.id);
                if (index !== -1) {
                    data.products[index] = { ...data.products[index], ...productData };
                } else {
                    data.products.push(productData);
                }
            } else {
                // Novo produto - gerar ID
                const maxId = Math.max(0, ...data.products.map(p => p.id || 0));
                productData.id = maxId + 1;
                data.products.push(productData);
            }
            
            data.lastUpdate = new Date().toISOString();
            localStorage.setItem(storageKey, JSON.stringify(data));
            
            return true;
        } catch (error) {
            this.log(`❌ Erro no localStorage direto: ${error.message}`, 'error');
            return false;
        }
    }

    // Atualizar interface
    async updateInterface() {
        try {
            // Recarregar seção de produtos
            if (typeof showSection === 'function') {
                await showSection('produtos');
            }
            
            // Recarregar tabela de produtos
            if (typeof loadProductsTable === 'function') {
                loadProductsTable();
            }
            
            // Atualizar estatísticas
            if (typeof updateDashboardStats === 'function') {
                updateDashboardStats();
            }
            
            this.log('✅ Interface atualizada');
        } catch (error) {
            this.log(`⚠️ Erro ao atualizar interface: ${error.message}`, 'warning');
        }
    }

    // Fechar modal
    closeModal() {
        try {
            if (typeof closeProductModal === 'function') {
                closeProductModal();
            } else {
                const modal = document.getElementById('product-modal');
                if (modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }
            }
            this.log('✅ Modal fechado');
        } catch (error) {
            this.log(`⚠️ Erro ao fechar modal: ${error.message}`, 'warning');
        }
    }

    // Mostrar notificação
    showNotification(message, type) {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            if (type === 'error') {
                alert(`Erro: ${message}`);
            } else {
                alert(message);
            }
        }
    }

    // Aplicar correção
    applyFix() {
        this.log('🔧 Aplicando correção de salvamento...');
        
        // Substituir função original
        window.handleProductSubmit = (e) => this.handleProductSubmitFixed(e);
        
        // Reconfigurar event listener do formulário
        const form = document.getElementById('product-form');
        if (form) {
            // Remover listeners existentes
            form.removeEventListener('submit', window.handleProductSubmit);
            
            // Adicionar novo listener
            form.addEventListener('submit', (e) => this.handleProductSubmitFixed(e));
            
            this.log('✅ Event listener do formulário reconfigurado');
        }
        
        this.log('✅ Correção aplicada com sucesso!', 'success');
    }
}

// Aplicar correção automaticamente
setTimeout(() => {
    const fixer = new ProductSaveFixer();
    fixer.applyFix();
    
    // Disponibilizar globalmente para debug
    window.productSaveFixer = fixer;
    window.forceSaveFix = () => fixer.applyFix();
}, 1500);

console.log('🔧 Correção de salvamento carregada. Aguarde 1.5 segundos...');
console.log('💡 Para reaplicar: forceSaveFix()');
