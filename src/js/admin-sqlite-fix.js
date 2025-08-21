// Correção para o problema de salvamento no SQLite
// Este arquivo corrige a função handleProductSubmit

// Função corrigida para salvamento no SQLite
async function handleProductSubmitFixed(e) {
    e.preventDefault();
    
    try {
        console.log('💾 [CORRIGIDO] Salvando produto...');
        
        // Validar campos obrigatórios
        const productName = document.getElementById('product-name').value.trim();
        const productPrice = document.getElementById('product-price').value;
        const productStock = document.getElementById('product-stock').value;
        const productCategory = document.getElementById('product-category').value;
        
        if (!productName) {
            showNotification('Nome do produto é obrigatório!', 'error');
            return;
        }
        
        if (!productPrice || parseFloat(productPrice) <= 0) {
            showNotification('Preço deve ser maior que zero!', 'error');
            return;
        }
        
        if (!productStock || parseInt(productStock) < 0) {
            showNotification('Estoque deve ser um número válido!', 'error');
            return;
        }
        
        if (!productCategory) {
            showNotification('Categoria é obrigatória!', 'error');
            return;
        }
        
        const productId = document.getElementById('product-id').value;
        const productData = {
            name: productName,
            slogan: document.getElementById('product-slogan').value.trim(),
            description: document.getElementById('product-description').value.trim(),
            price: parseFloat(productPrice),
            stock: parseInt(productStock),
            category: productCategory,
            active: true
        };
        
        // Verificar se é produto de parceiro
        const productType = document.getElementById('product-type').value;
        if (productType === 'parceiro') {
            const partnerName = document.getElementById('partner-name').value.trim();
            if (!partnerName) {
                showNotification('Nome do parceiro é obrigatório!', 'error');
                return;
            }
            
            productData.partner = {
                name: partnerName,
                producer: document.getElementById('partner-producer').value.trim(),
                location: document.getElementById('partner-location').value.trim(),
                description: document.getElementById('partner-description').value.trim()
            };
        }
        
        // === SISTEMA DE PERSISTÊNCIA CORRIGIDO ===
        console.log('🔄 [CORRIGIDO] Iniciando salvamento...');
        
        let success = false;
        let sqliteSuccess = false;
        let dataManagerSuccess = false;
        
        // 1. Verificar se DataManager está disponível
        if (!window.dataManager) {
            console.error('❌ DataManager não disponível!');
            showNotification('Erro: Sistema de dados não disponível!', 'error');
            return;
        }
        
        // 2. Aguardar SQLite estar pronto (com timeout)
        let sqliteReady = false;
        if (window.sqliteManager) {
            try {
                // Aguardar até 3 segundos pelo SQLite
                const timeout = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('SQLite timeout')), 3000)
                );
                
                const checkSQLite = new Promise((resolve) => {
                    if (window.sqliteManager.db) {
                        resolve(true);
                    } else {
                        // Verificar periodicamente
                        const interval = setInterval(() => {
                            if (window.sqliteManager.db) {
                                clearInterval(interval);
                                resolve(true);
                            }
                        }, 100);
                        
                        // Limpar interval após timeout
                        setTimeout(() => clearInterval(interval), 3000);
                    }
                });
                
                await Promise.race([checkSQLite, timeout]);
                sqliteReady = true;
                console.log('✅ [CORRIGIDO] SQLite está pronto');
            } catch (error) {
                console.log('⚠️ [CORRIGIDO] SQLite não está pronto - usando apenas localStorage');
                sqliteReady = false;
            }
        }
        
        // 3. Tentar salvar no SQLite primeiro (se disponível)
        if (sqliteReady && window.sqliteManager.db) {
            try {
                console.log('🗄️ [CORRIGIDO] Tentando salvar no SQLite...');
                
                if (productId) {
                    sqliteSuccess = window.sqliteManager.updateProduct(parseInt(productId), productData);
                    console.log(`🔄 [CORRIGIDO] SQLite Update resultado: ${sqliteSuccess}`);
                } else {
                    sqliteSuccess = window.sqliteManager.addProduct(productData);
                    console.log(`➕ [CORRIGIDO] SQLite Add resultado: ${sqliteSuccess}`);
                }
                
                if (sqliteSuccess) {
                    console.log('✅ [CORRIGIDO] Produto salvo no SQLite com sucesso');
                    
                    // Verificar se realmente foi salvo
                    setTimeout(() => {
                        try {
                            const products = window.sqliteManager.getProducts();
                            const savedProduct = products.find(p => p.id === parseInt(productId) || p.name === productData.name);
                            if (savedProduct) {
                                console.log('✅ [VERIFICAÇÃO] Produto confirmado no SQLite:', savedProduct.name, 'R$', savedProduct.price);
                            } else {
                                console.warn('⚠️ [VERIFICAÇÃO] Produto não encontrado no SQLite após salvamento');
                            }
                        } catch (verifyError) {
                            console.error('❌ [VERIFICAÇÃO] Erro ao verificar SQLite:', verifyError);
                        }
                    }, 100);
                } else {
                    console.warn('⚠️ [CORRIGIDO] Falha ao salvar no SQLite');
                }
            } catch (sqliteError) {
                console.error('❌ [CORRIGIDO] Erro no SQLite:', sqliteError);
                sqliteSuccess = false;
            }
        }
        
        // 4. Sempre salvar no DataManager (fallback garantido)
        try {
            console.log('📊 [CORRIGIDO] Salvando no DataManager...');
            
            if (productId) {
                dataManagerSuccess = await window.dataManager.updateProduct(parseInt(productId), productData);
            } else {
                dataManagerSuccess = await window.dataManager.addProduct(productData);
            }
            
            if (dataManagerSuccess) {
                console.log('✅ [CORRIGIDO] Produto salvo no DataManager');
                
                // Verificar se realmente foi salvo
                setTimeout(() => {
                    try {
                        const products = window.dataManager.getProducts();
                        const savedProduct = products.find(p => p.id === parseInt(productId) || p.name === productData.name);
                        if (savedProduct) {
                            console.log('✅ [VERIFICAÇÃO] Produto confirmado no DataManager:', savedProduct.name, 'R$', savedProduct.price);
                        } else {
                            console.warn('⚠️ [VERIFICAÇÃO] Produto não encontrado no DataManager após salvamento');
                        }
                    } catch (verifyError) {
                        console.error('❌ [VERIFICAÇÃO] Erro ao verificar DataManager:', verifyError);
                    }
                }, 100);
            } else {
                console.warn('⚠️ [CORRIGIDO] Falha ao salvar no DataManager');
            }
        } catch (dataManagerError) {
            console.error('❌ [CORRIGIDO] Erro no DataManager:', dataManagerError);
            dataManagerSuccess = false;
        }
        
        // 5. Verificar sucesso geral
        success = sqliteSuccess || dataManagerSuccess;
        
        // 6. Log detalhado do resultado
        console.log('📋 [CORRIGIDO] Resumo do salvamento:');
        console.log(`  - SQLite: ${sqliteSuccess ? '✅ Sucesso' : '❌ Falhou'}`);
        console.log(`  - DataManager: ${dataManagerSuccess ? '✅ Sucesso' : '❌ Falhou'}`);
        console.log(`  - Resultado final: ${success ? '✅ Sucesso' : '❌ Falhou'}`);
        console.log('  - Dados salvos:', productData);
        
        if (success) {
            // Notificar sucesso
            if (productId) {
                showNotification('✅ Produto atualizado com sucesso!', 'success');
            } else {
                showNotification('✅ Produto adicionado com sucesso!', 'success');
            }
            
            // Fechar modal
            if (typeof closeProductModal === 'function') {
                closeProductModal();
            }
            
            // Atualizar interface após um delay para garantir sincronização
            setTimeout(async () => {
                try {
                    await loadProductsTable();
                    if (typeof loadEstoqueGrid === 'function') {
                        loadEstoqueGrid();
                    }
                    if (typeof updateDashboardStats === 'function') {
                        updateDashboardStats();
                    }
                    console.log('🔄 [CORRIGIDO] Interface atualizada após salvamento');
                } catch (updateError) {
                    console.error('❌ [CORRIGIDO] Erro ao atualizar interface:', updateError);
                }
            }, 200);
            
        } else {
            console.error('❌ [CORRIGIDO] Falha em ambos os sistemas de persistência');
            showNotification('❌ Erro ao salvar produto! Verifique os dados e tente novamente.', 'error');
        }
        
    } catch (error) {
        console.error('❌ [CORRIGIDO] Erro crítico ao salvar produto:', error);
        showNotification('❌ Erro crítico! Verifique o console para mais detalhes.', 'error');
    }
}

// Função para aplicar a correção
function aplicarCorrecaoSQLite() {
    console.log('🔧 Aplicando correção do SQLite...');
    
    // Substituir a função original
    if (typeof window.handleProductSubmit !== 'undefined') {
        window.handleProductSubmitOriginal = window.handleProductSubmit;
        console.log('💾 Backup da função original criado');
    }
    
    window.handleProductSubmit = handleProductSubmitFixed;
    console.log('✅ Função corrigida aplicada');
    
    // Reativar o event listener se necessário
    const productForm = document.getElementById('product-form');
    if (productForm) {
        // Remover listeners antigos
        const newForm = productForm.cloneNode(true);
        productForm.parentNode.replaceChild(newForm, productForm);
        
        // Adicionar novo listener
        newForm.addEventListener('submit', handleProductSubmitFixed);
        console.log('✅ Event listener atualizado');
    }
    
    return true;
}

// Função para reverter a correção
function reverterCorrecaoSQLite() {
    if (typeof window.handleProductSubmitOriginal !== 'undefined') {
        window.handleProductSubmit = window.handleProductSubmitOriginal;
        console.log('🔄 Função original restaurada');
        return true;
    }
    return false;
}

// Função de diagnóstico
function diagnosticarSQLite() {
    console.log('🔍 === DIAGNÓSTICO SQLITE ===');
    
    // Verificar disponibilidade dos componentes
    console.log('SQLiteManager disponível:', !!(window.sqliteManager));
    console.log('SQLite DB disponível:', !!(window.sqliteManager && window.sqliteManager.db));
    console.log('DataManager disponível:', !!(window.dataManager));
    
    // Verificar dados
    if (window.sqliteManager && window.sqliteManager.db) {
        try {
            const sqliteProducts = window.sqliteManager.getProducts();
            console.log('Produtos no SQLite:', sqliteProducts.length);
            if (sqliteProducts.length > 0) {
                console.log('Primeiro produto SQLite:', sqliteProducts[0].name, 'R$', sqliteProducts[0].price);
            }
        } catch (error) {
            console.error('Erro ao acessar SQLite:', error);
        }
    }
    
    if (window.dataManager) {
        try {
            const dataManagerProducts = window.dataManager.getProducts();
            console.log('Produtos no DataManager:', dataManagerProducts.length);
            if (dataManagerProducts.length > 0) {
                console.log('Primeiro produto DataManager:', dataManagerProducts[0].name, 'R$', dataManagerProducts[0].price);
            }
        } catch (error) {
            console.error('Erro ao acessar DataManager:', error);
        }
    }
    
    // Verificar localStorage
    const storageData = localStorage.getItem('granjaRecantoFelizData');
    if (storageData) {
        try {
            const parsed = JSON.parse(storageData);
            console.log('Produtos no localStorage:', parsed.products?.length || 0);
            console.log('Última atualização:', parsed.lastUpdate);
        } catch (error) {
            console.error('Erro ao acessar localStorage:', error);
        }
    }
    
    console.log('=== FIM DIAGNÓSTICO ===');
}

// Disponibilizar funções globalmente
window.aplicarCorrecaoSQLite = aplicarCorrecaoSQLite;
window.reverterCorrecaoSQLite = reverterCorrecaoSQLite;
window.diagnosticarSQLite = diagnosticarSQLite;
window.handleProductSubmitFixed = handleProductSubmitFixed;

console.log('🔧 Correção SQLite carregada. Use aplicarCorrecaoSQLite() para ativar.');