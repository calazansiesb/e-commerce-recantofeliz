/**
 * Script de Verificação da Integração DatabaseManager
 * 
 * Este script verifica se a integração entre o DatabaseManager e o sistema administrativo
 * está funcionando corretamente.
 */

console.log('🔍 === VERIFICAÇÃO DA INTEGRAÇÃO ===');

// Função para aguardar condição
function waitFor(condition, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const checkCondition = () => {
            if (condition()) {
                resolve(true);
            } else if (Date.now() - start > timeout) {
                reject(new Error('Timeout aguardando condição'));
            } else {
                setTimeout(checkCondition, 100);
            }
        };
        checkCondition();
    });
}

// Verificação principal
async function verifyIntegration() {
    console.log('🚀 Iniciando verificação...');
    
    try {
        // 1. Verificar se DatabaseManager está disponível
        console.log('📋 1. Verificando DatabaseManager...');
        if (typeof DatabaseManager === 'undefined') {
            throw new Error('DatabaseManager não encontrado');
        }
        console.log('✅ DatabaseManager encontrado');
        
        // 2. Aguardar inicialização
        console.log('📋 2. Aguardando inicialização...');
        await waitFor(() => window.dbManager && window.dbManager.isInitialized, 10000);
        console.log('✅ DatabaseManager inicializado');
        
        // 3. Verificar compatibilidade com admin
        console.log('📋 3. Verificando compatibilidade...');
        if (!window.sqliteManager || !window.sqliteManager.db) {
            throw new Error('Compatibilidade com admin não configurada');
        }
        console.log('✅ Compatibilidade configurada');
        
        // 4. Testar operações básicas
        console.log('📋 4. Testando operações...');
        const products = await window.sqliteManager.getProducts();
        console.log(`✅ ${products.length} produtos carregados`);
        
        // 5. Verificar interface
        console.log('📋 5. Verificando interface...');
        const tableBody = document.getElementById('products-table-body');
        if (!tableBody) {
            throw new Error('Tabela de produtos não encontrada');
        }
        console.log('✅ Interface disponível');
        
        // 6. Testar diagnóstico
        console.log('📋 6. Testando diagnóstico...');
        if (typeof diagnosticDatabase === 'function') {
            console.log('✅ Função de diagnóstico disponível');
        } else {
            console.warn('⚠️ Função de diagnóstico não disponível');
        }
        
        console.log('🎉 === VERIFICAÇÃO CONCLUÍDA COM SUCESSO ===');
        return true;
        
    } catch (error) {
        console.error('❌ Erro na verificação:', error);
        return false;
    }
}

// Executar verificação quando tudo estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(async () => {
        const success = await verifyIntegration();
        
        // Adicionar indicador visual na página
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 15px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 9999;
            ${success ? 'background-color: #4CAF50;' : 'background-color: #f44336;'}
        `;
        indicator.textContent = success ? '✅ Integração OK' : '❌ Erro na Integração';
        document.body.appendChild(indicator);
        
        // Remover indicador após 5 segundos
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 5000);
        
    }, 2000);
});

console.log('🔍 Script de verificação carregado');
