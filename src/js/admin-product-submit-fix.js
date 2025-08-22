/**
 * Correção da função handleProductSubmit
 * 
 * Esta função substitui a função problemática no admin.js
 * Use este código para sobrescrever a função após o carregamento
 */

async function handleProductSubmit(e) {
    e.preventDefault();
    
    try {
        console.log('💾 Salvando produto...');
        
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
        
        // === SISTEMA ROBUSTO DE PERSISTÊNCIA ===
        console.log('🔄 Iniciando salvamento com sistema robusto...');
        
        // 1. Aguardar SQLite estar pronto (com timeout para não travar)
        if (window.sqliteRobustInitializer && !window.sqliteReady) {
            try {
                console.log('⏳ Aguardando SQLite inicializar...');
                await Promise.race([
                    window.sqliteRobustInitializer.waitForReady(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
                ]);
                console.log('✅ SQLite está pronto para uso');
            } catch (timeout) {
                console.log('⚠️ SQLite não ficou pronto em 3s - continuando com localStorage');
            }
        }
        
        // 2. Usar DataManager (que agora integra automaticamente com SQLite)
        if (!window.dataManager) {
            console.error('❌ DataManager não disponível!');
            showNotification('Erro: Sistema de dados não disponível!', 'error');
            return;
        }
        
        let success = false;
        
        try {
            console.log('💾 Salvando via DataManager (com integração SQLite)...');
            
            if (productId) {
                // Atualizar produto existente
                console.log(`🔄 Atualizando produto ID ${productId}...`);
                success = await window.dataManager.updateProduct(parseInt(productId), productData);
            } else {
                // Adicionar novo produto
                console.log('➕ Adicionando novo produto...');
                success = await window.dataManager.addProduct(productData);
            }
            
            if (success) {
                console.log('✅ Produto salvo com sucesso!');
                
                // Log do status de integração
                if (window.sqliteReady && window.sqliteManager) {
                    console.log('🗄️ SQLite: ✅ Integrado');
                    try {
                        const products = window.sqliteManager.getProducts();
                        console.log(`📊 SQLite agora tem ${products.length} produtos`);
                    } catch (checkError) {
                        console.warn('⚠️ Erro ao verificar SQLite:', checkError);
                    }
                } else if (window.sqliteFallbackMode) {
                    console.log('🔄 SQLite: ⚠️ Modo fallback ativo');
                } else {
                    console.log('🔄 SQLite: ⏳ Ainda inicializando');
                }
                
                // Notificar sucesso
                if (productId) {
                    showNotification('Produto atualizado com sucesso!', 'success');
                } else {
                    showNotification('Produto adicionado com sucesso!', 'success');
                }
                
                // Atualizar interface
                await showSection('produtos');
                updateDashboardStats();
                
                // Fechar modal
                if (typeof closeProductModal === 'function') {
                    closeProductModal();
                }
                
            } else {
                console.error('❌ Falha ao salvar produto');
                showNotification('Erro ao salvar produto! Verifique os dados.', 'error');
            }
            
        } catch (dataManagerError) {
            console.error('❌ Erro no DataManager:', dataManagerError);
            showNotification('Erro interno ao salvar produto!', 'error');
        }
        
    } catch (error) {
        console.error('❌ Erro crítico ao salvar produto:', error);
        showNotification('Erro crítico! Verifique o console para mais detalhes.', 'error');
    }
}

// Sobrescrever a função global
window.handleProductSubmit = handleProductSubmit;

console.log('🔧 Função handleProductSubmit corrigida e aplicada');
