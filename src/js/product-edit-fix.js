// Correção específica para problema de edição de produtos
// Diagnóstico e correção completa do fluxo de edição

console.log('🔧 Carregando correção específica para edição de produtos...');

class ProductEditFixer {
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
        
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    // Verificar se todos os elementos necessários existem
    checkModalElements() {
        this.log('=== VERIFICANDO ELEMENTOS DO MODAL ===');
        
        const elements = [
            'product-modal',
            'modal-title',
            'product-id',
            'product-name',
            'product-price',
            'product-stock',
            'product-category',
            'product-slogan',
            'product-description'
        ];
        
        const missing = [];
        const existing = [];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                existing.push(id);
                this.log(`✅ Elemento ${id} encontrado`);
            } else {
                missing.push(id);
                this.log(`❌ Elemento ${id} NÃO encontrado`, 'error');
            }
        });
        
        this.log(`Elementos existentes: ${existing.length}/${elements.length}`);
        
        if (missing.length > 0) {
            this.log(`Elementos faltando: ${missing.join(', ')}`, 'error');
            return false;
        }
        
        return true;
    }

    // Verificar se as funções necessárias existem
    checkFunctions() {
        this.log('=== VERIFICANDO FUNÇÕES ===');
        
        const functions = [
            'editProduct',
            'openProductModal',
            'closeProductModal',
            'handleProductSubmit'
        ];
        
        functions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                this.log(`✅ Função ${funcName} encontrada`);
            } else {
                this.log(`❌ Função ${funcName} NÃO encontrada`, 'error');
            }
        });
    }

    // Verificar dados do produto específico
    checkProductData(productId) {
        this.log(`=== VERIFICANDO DADOS DO PRODUTO ${productId} ===`);
        
        let product = null;
        
        // Tentar SQLite primeiro
        if (window.sqliteManager && window.sqliteManager.db) {
            try {
                const products = window.sqliteManager.getProducts();
                product = products.find(p => p.id == productId);
                if (product) {
                    this.log('✅ Produto encontrado no SQLite', 'success');
                }
            } catch (error) {
                this.log(`❌ Erro ao buscar no SQLite: ${error.message}`, 'error');
            }
        }
        
        // Tentar DataManager se não encontrou
        if (!product && window.dataManager) {
            try {
                const products = window.dataManager.getProducts();
                product = products.find(p => p.id == productId);
                if (product) {
                    this.log('✅ Produto encontrado no DataManager', 'success');
                }
            } catch (error) {
                this.log(`❌ Erro ao buscar no DataManager: ${error.message}`, 'error');
            }
        }
        
        // Tentar localStorage direto
        if (!product) {
            try {
                const storageData = localStorage.getItem('granjaRecantoFelizData');
                if (storageData) {
                    const parsed = JSON.parse(storageData);
                    product = parsed.products?.find(p => p.id == productId);
                    if (product) {
                        this.log('✅ Produto encontrado no localStorage', 'success');
                    }
                }
            } catch (error) {
                this.log(`❌ Erro ao buscar no localStorage: ${error.message}`, 'error');
            }
        }
        
        if (product) {
            this.log(`Produto: ${product.name} - R$ ${product.price} - Estoque: ${product.stock}`);
            return product;
        } else {
            this.log(`❌ Produto ${productId} não encontrado em nenhuma fonte`, 'error');
            return null;
        }
    }

    // Corrigir função editProduct se necessário
    fixEditFunction() {
        this.log('=== CORRIGINDO FUNÇÃO EDITPRODUCT ===');
        
        // Sobrescrever função editProduct com versão corrigida
        window.editProduct = async (productId) => {
            this.log(`🔧 FUNÇÃO CORRIGIDA - Editando produto ${productId}`);
            
            const product = this.checkProductData(productId);
            if (!product) {
                alert(`Produto ${productId} não encontrado!`);
                return;
            }
            
            // Verificar se modal existe
            if (!this.checkModalElements()) {
                alert('Erro: Modal de edição não está disponível!');
                return;
            }
            
            // Abrir modal
            if (typeof openProductModal === 'function') {
                openProductModal(productId);
            } else {
                // Abrir modal manualmente
                const modal = document.getElementById('product-modal');
                if (modal) {
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                }
            }
            
            // Aguardar modal abrir e preencher dados
            setTimeout(() => {
                this.fillProductForm(product);
            }, 200);
        };
        
        this.log('✅ Função editProduct corrigida', 'success');
    }

    // Preencher formulário com dados do produto
    fillProductForm(product) {
        this.log('=== PREENCHENDO FORMULÁRIO ===');
        
        try {
            // Título do modal
            const modalTitle = document.getElementById('modal-title');
            if (modalTitle) {
                modalTitle.textContent = 'Editar Produto';
                this.log('✅ Título definido');
            }
            
            // Campos básicos
            const fields = {
                'product-id': product.id,
                'product-name': product.name || '',
                'product-price': product.price || 0,
                'product-stock': product.stock || 0,
                'product-category': product.category || '',
                'product-slogan': product.slogan || '',
                'product-description': product.description || ''
            };
            
            Object.keys(fields).forEach(fieldId => {
                const element = document.getElementById(fieldId);
                if (element) {
                    element.value = fields[fieldId];
                    this.log(`✅ Campo ${fieldId}: ${fields[fieldId]}`);
                    
                    // Forçar evento change para garantir que seja detectado
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    this.log(`❌ Campo ${fieldId} não encontrado`, 'error');
                }
            });
            
            // Campo tipo
            const typeSelect = document.getElementById('product-type');
            if (typeSelect) {
                typeSelect.value = product.partner ? 'parceiro' : 'granja';
                this.log(`✅ Tipo: ${product.partner ? 'parceiro' : 'granja'}`);
                
                // Trigger change event
                typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Chamar togglePartnerFields se existir
                if (typeof togglePartnerFields === 'function') {
                    togglePartnerFields();
                }
            }
            
            // Dados do parceiro se aplicável
            if (product.partner) {
                this.log('🤝 Preenchendo dados do parceiro...');
                
                const partnerFields = {
                    'partner-name': product.partner.name || '',
                    'partner-producer': product.partner.producer || '',
                    'partner-location': product.partner.location || '',
                    'partner-description': product.partner.description || ''
                };
                
                Object.keys(partnerFields).forEach(fieldId => {
                    const element = document.getElementById(fieldId);
                    if (element) {
                        element.value = partnerFields[fieldId];
                        this.log(`✅ Parceiro ${fieldId}: ${partnerFields[fieldId]}`);
                    }
                });
            }
            
            this.log('✅ Formulário preenchido com sucesso', 'success');
            
        } catch (error) {
            this.log(`❌ Erro ao preencher formulário: ${error.message}`, 'error');
        }
    }

    // Teste específico para produto Galinha Caipira
    testGalinhaCapiraEdit() {
        this.log('=== TESTE ESPECÍFICO - GALINHA CAIPIRA ===');
        
        // Procurar produto por nome
        let galinhaProduct = null;
        
        if (window.dataManager) {
            const products = window.dataManager.getProducts();
            galinhaProduct = products.find(p => 
                p.name && p.name.toLowerCase().includes('galinha') && 
                p.name.toLowerCase().includes('caipira')
            );
        }
        
        if (galinhaProduct) {
            this.log(`✅ Galinha Caipira encontrada: ID ${galinhaProduct.id}`, 'success');
            this.log(`   Nome: ${galinhaProduct.name}`);
            this.log(`   Preço: R$ ${galinhaProduct.price}`);
            this.log(`   Estoque: ${galinhaProduct.stock}`);
            
            // Testar edição
            this.log('🔧 Testando edição...');
            if (typeof window.editProduct === 'function') {
                window.editProduct(galinhaProduct.id);
                this.log('✅ Função editProduct chamada', 'success');
            } else {
                this.log('❌ Função editProduct não disponível', 'error');
            }
        } else {
            this.log('❌ Galinha Caipira não encontrada', 'error');
        }
    }

    // Aplicar todas as correções
    applyAllFixes() {
        this.log('🚀 APLICANDO TODAS AS CORREÇÕES...');
        
        this.checkModalElements();
        this.checkFunctions();
        this.fixEditFunction();
        
        // Disponibilizar teste específico
        window.testGalinhaEdit = () => this.testGalinhaCapiraEdit();
        
        this.log('✅ Todas as correções aplicadas!', 'success');
        this.log('💡 Para testar Galinha Caipira: testGalinhaEdit()');
    }
}

// Executar correções após DOM carregar
setTimeout(() => {
    const fixer = new ProductEditFixer();
    fixer.applyAllFixes();
    
    // Disponibilizar globalmente
    window.productEditFixer = fixer;
}, 2000);

console.log('🔧 Correção de edição de produtos carregada. Aguarde 2 segundos...');
