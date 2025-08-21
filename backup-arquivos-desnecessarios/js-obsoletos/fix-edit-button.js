// Correção para botões de editar não responsivos
console.log('🔧 Carregando correção para botões de editar...');

function fixEditButtons() {
    console.log('🔄 Corrigindo botões de editar...');
    
    // Verificar se há produtos na tabela
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) {
        console.error('❌ Tabela de produtos não encontrada');
        return false;
    }
    
    // Encontrar todos os botões de editar
    const editButtons = document.querySelectorAll('button[onclick*="editProduct"]');
    console.log(`📊 Encontrados ${editButtons.length} botões de editar`);
    
    if (editButtons.length === 0) {
        console.warn('⚠️ Nenhum botão de editar encontrado - recarregando tabela...');
        if (typeof loadProductsTable === 'function') {
            loadProductsTable();
            setTimeout(fixEditButtons, 1000);
        }
        return false;
    }
    
    // Corrigir cada botão
    let fixed = 0;
    editButtons.forEach((button, index) => {
        try {
            const onclickAttr = button.getAttribute('onclick');
            const productIdMatch = onclickAttr.match(/editProduct\((\d+)\)/);
            
            if (productIdMatch) {
                const productId = parseInt(productIdMatch[1]);
                
                // Remover onclick antigo e adicionar novo event listener
                button.removeAttribute('onclick');
                
                // Criar nova função de clique
                button.onclick = function(e) {
                    e.preventDefault();
                    console.log(`✏️ Editando produto ID: ${productId}`);
                    
                    if (typeof editProduct === 'function') {
                        editProduct(productId);
                    } else if (typeof window.editProduct === 'function') {
                        window.editProduct(productId);
                    } else {
                        console.error('❌ Função editProduct não encontrada');
                        alert('Erro: Função de edição não disponível');
                    }
                };
                
                fixed++;
                console.log(`✅ Botão ${index + 1} corrigido (Produto ID: ${productId})`);
            }
        } catch (error) {
            console.error(`❌ Erro ao corrigir botão ${index + 1}:`, error);
        }
    });
    
    console.log(`✅ ${fixed} botões corrigidos com sucesso`);
    return fixed > 0;
}

// Função para verificar se editProduct existe
function checkEditFunction() {
    console.log('🔍 Verificando função editProduct...');
    
    if (typeof editProduct === 'function') {
        console.log('✅ editProduct encontrada no escopo global');
        return true;
    }
    
    if (typeof window.editProduct === 'function') {
        console.log('✅ editProduct encontrada no window');
        return true;
    }
    
    console.error('❌ Função editProduct não encontrada');
    
    // Tentar criar função básica se não existir
    if (typeof window.dataManager !== 'undefined') {
        console.log('🔧 Criando função editProduct básica...');
        
        window.editProduct = function(productId) {
            console.log(`✏️ Editando produto ${productId}`);
            
            try {
                const products = window.dataManager.getProducts();
                const product = products.find(p => p.id == productId);
                
                if (!product) {
                    alert(`Produto ${productId} não encontrado!`);
                    return;
                }
                
                // Abrir modal se existir
                if (typeof openProductModal === 'function') {
                    openProductModal(productId);
                    
                    // Preencher dados após um delay
                    setTimeout(() => {
                        try {
                            document.getElementById('modal-title').textContent = 'Editar Produto';
                            document.getElementById('product-id').value = product.id;
                            document.getElementById('product-name').value = product.name || '';
                            document.getElementById('product-price').value = product.price || 0;
                            document.getElementById('product-stock').value = product.stock || 0;
                            document.getElementById('product-category').value = product.category || '';
                            document.getElementById('product-slogan').value = product.slogan || '';
                            document.getElementById('product-description').value = product.description || '';
                            
                            console.log('✅ Dados preenchidos no formulário');
                        } catch (fillError) {
                            console.error('❌ Erro ao preencher formulário:', fillError);
                        }
                    }, 100);
                } else {
                    alert(`Editando produto: ${product.name}\nPreço: R$ ${product.price}\nEstoque: ${product.stock}`);
                }
            } catch (error) {
                console.error('❌ Erro ao editar produto:', error);
                alert('Erro ao editar produto!');
            }
        };
        
        console.log('✅ Função editProduct criada');
        return true;
    }
    
    return false;
}

// Função principal de correção
function applyEditButtonFix() {
    console.log('🚀 Aplicando correção completa dos botões de editar...');
    
    // 1. Verificar função editProduct
    checkEditFunction();
    
    // 2. Corrigir botões existentes
    fixEditButtons();
    
    // 3. Observar mudanças na tabela
    const tableBody = document.getElementById('products-table-body');
    if (tableBody) {
        const observer = new MutationObserver(() => {
            console.log('🔄 Tabela modificada, reaplicando correção...');
            setTimeout(fixEditButtons, 100);
        });
        
        observer.observe(tableBody, { childList: true, subtree: true });
        console.log('👁️ Observer configurado para monitorar mudanças na tabela');
    }
    
    return true;
}

// Aplicar correção quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(applyEditButtonFix, 2000);
    });
} else {
    setTimeout(applyEditButtonFix, 2000);
}

// Disponibilizar funções globalmente
window.fixEditButtons = fixEditButtons;
window.checkEditFunction = checkEditFunction;
window.applyEditButtonFix = applyEditButtonFix;

console.log('✅ Correção de botões de editar carregada');