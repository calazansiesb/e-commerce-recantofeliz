// Debug Admin - Diagnóstico de problemas
console.log('🔍 Carregando debug admin...');

// Função para diagnosticar problemas
window.diagnosticarSistema = function() {
    console.log('🔍 === DIAGNÓSTICO DO SISTEMA ===');
    
    const diagnostico = {
        timestamp: new Date().toISOString(),
        ambiente: window.location.hostname,
        apis: {},
        localStorage: {},
        elementos: {}
    };
    
    // Verificar APIs disponíveis
    diagnostico.apis.granjaAPI = !!window.granjaAPI;
    diagnostico.apis.dynamoClient = !!window.dynamoClient;
    diagnostico.apis.dataManager = !!window.dataManager;
    
    // Verificar localStorage
    try {
        const localData = localStorage.getItem('granjaRecantoFelizData');
        if (localData) {
            const parsed = JSON.parse(localData);
            diagnostico.localStorage.produtos = parsed.products?.length || 0;
            diagnostico.localStorage.lastUpdate = parsed.lastUpdate;
        } else {
            diagnostico.localStorage.produtos = 0;
        }
    } catch (error) {
        diagnostico.localStorage.erro = error.message;
    }
    
    // Verificar elementos DOM
    diagnostico.elementos.productsTable = !!document.getElementById('products-table-body');
    diagnostico.elementos.productModal = !!document.getElementById('product-modal');
    diagnostico.elementos.productForm = !!document.getElementById('product-form');
    
    console.table(diagnostico);
    
    // Mostrar resultado visual
    const resultado = `
        🔍 DIAGNÓSTICO DO SISTEMA
        
        📍 Ambiente: ${diagnostico.ambiente}
        
        🔌 APIs Disponíveis:
        - GranjaAPI: ${diagnostico.apis.granjaAPI ? '✅' : '❌'}
        - DynamoClient: ${diagnostico.apis.dynamoClient ? '✅' : '❌'}
        - DataManager: ${diagnostico.apis.dataManager ? '✅' : '❌'}
        
        💾 LocalStorage:
        - Produtos: ${diagnostico.localStorage.produtos || 0}
        - Última atualização: ${diagnostico.localStorage.lastUpdate || 'N/A'}
        
        🎯 Elementos DOM:
        - Tabela de produtos: ${diagnostico.elementos.productsTable ? '✅' : '❌'}
        - Modal de produto: ${diagnostico.elementos.productModal ? '✅' : '❌'}
        - Formulário: ${diagnostico.elementos.productForm ? '✅' : '❌'}
    `;
    
    alert(resultado);
    return diagnostico;
};

// Função para testar API
window.testarAPI = async function() {
    console.log('🧪 Testando API...');
    
    if (!window.granjaAPI) {
        alert('❌ GranjaAPI não está disponível');
        return false;
    }
    
    try {
        console.log('📡 Fazendo requisição para API...');
        const data = await window.granjaAPI.getProdutos();
        
        console.log('✅ Resposta da API:', data);
        
        const produtos = data.products || [];
        alert(`✅ API funcionando!\n📦 ${produtos.length} produtos encontrados`);
        
        return true;
    } catch (error) {
        console.error('❌ Erro na API:', error);
        alert(`❌ Erro na API:\n${error.message}`);
        return false;
    }
};

// Função para limpar cache
window.limparCache = function() {
    if (confirm('Tem certeza que deseja limpar todos os dados locais?')) {
        localStorage.removeItem('granjaRecantoFelizData');
        localStorage.removeItem('carrinho');
        
        if (window.granjaAPI && window.granjaAPI.cache) {
            window.granjaAPI.cache.clear();
        }
        
        alert('✅ Cache limpo! Recarregue a página.');
    }
};

// Função para forçar reload dos produtos
window.forcarReloadProdutos = async function() {
    console.log('🔄 Forçando reload dos produtos...');
    
    try {
        // Limpar cache da API
        if (window.granjaAPI && window.granjaAPI.cache) {
            window.granjaAPI.cache.clear();
        }
        
        // Recarregar produtos
        if (window.renderizarProdutosAdmin) {
            await window.renderizarProdutosAdmin();
            alert('✅ Produtos recarregados!');
        } else {
            alert('❌ Função de renderização não disponível');
        }
    } catch (error) {
        console.error('❌ Erro ao recarregar:', error);
        alert(`❌ Erro: ${error.message}`);
    }
};

// Adicionar botões de debug no admin
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Adicionar seção de debug
        const container = document.querySelector('.container.mx-auto.p-6');
        if (container) {
            const debugSection = document.createElement('div');
            debugSection.className = 'bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6';
            debugSection.innerHTML = `
                <h3 class="text-lg font-bold text-yellow-800 mb-3">
                    <i class="fas fa-bug mr-2"></i>Ferramentas de Debug
                </h3>
                <div class="flex flex-wrap gap-2">
                    <button onclick="diagnosticarSistema()" class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm">
                        <i class="fas fa-stethoscope mr-1"></i>Diagnóstico
                    </button>
                    <button onclick="testarAPI()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">
                        <i class="fas fa-wifi mr-1"></i>Testar API
                    </button>
                    <button onclick="forcarReloadProdutos()" class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm">
                        <i class="fas fa-sync mr-1"></i>Reload Produtos
                    </button>
                    <button onclick="limparCache()" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm">
                        <i class="fas fa-trash mr-1"></i>Limpar Cache
                    </button>
                </div>
            `;
            container.insertBefore(debugSection, container.firstChild);
        }
    }, 3000);
});

// Auto-diagnóstico na inicialização
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🔍 Executando diagnóstico automático...');
        
        // Verificar se APIs estão carregadas
        if (!window.granjaAPI) {
            console.warn('⚠️ GranjaAPI não carregada');
        }
        
        if (!window.renderizarProdutosAdmin) {
            console.warn('⚠️ Função renderizarProdutosAdmin não disponível');
        }
        
        // Verificar elementos DOM críticos
        const elementos = [
            'products-table-body',
            'product-modal',
            'product-form'
        ];
        
        elementos.forEach(id => {
            if (!document.getElementById(id)) {
                console.warn(`⚠️ Elemento ${id} não encontrado`);
            }
        });
        
        console.log('✅ Diagnóstico automático concluído');
    }, 2000);
});

console.log('✅ Debug admin carregado');