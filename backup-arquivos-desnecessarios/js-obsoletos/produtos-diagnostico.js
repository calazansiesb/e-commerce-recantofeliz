/**
 * Diagnóstico de Produtos - Sistema Admin
 * 
 * Esta função diagnostica problemas com carregamento de produtos
 * e tenta corrigi-los automaticamente.
 */

async function diagnosticarProblemasProdutos() {
    console.log('🔍 === INICIANDO DIAGNÓSTICO DE PRODUTOS ===');
    
    const diagnostico = {
        timestamp: new Date().toISOString(),
        dataManager: null,
        sqliteManager: null,
        localStorage: null,
        problemas: [],
        solucoes: []
    };
    
    // 1. Verificar DataManager
    console.log('📊 Verificando DataManager...');
    if (typeof DataManager !== 'undefined') {
        if (window.dataManager) {
            try {
                const produtos = window.dataManager.getProducts();
                diagnostico.dataManager = {
                    existe: true,
                    instanciado: true,
                    produtos: produtos.length,
                    funcionando: Array.isArray(produtos)
                };
                console.log(`✅ DataManager: ${produtos.length} produtos encontrados`);
            } catch (error) {
                diagnostico.dataManager = {
                    existe: true,
                    instanciado: true,
                    produtos: 0,
                    funcionando: false,
                    erro: error.message
                };
                console.error('❌ DataManager com erro:', error);
                diagnostico.problemas.push('DataManager instanciado mas com erro');
            }
        } else {
            diagnostico.dataManager = {
                existe: true,
                instanciado: false,
                produtos: 0,
                funcionando: false
            };
            console.warn('⚠️ DataManager existe mas não foi instanciado');
            diagnostico.problemas.push('DataManager não instanciado');
            
            // Tentar instanciar
            try {
                window.dataManager = new DataManager();
                console.log('✅ DataManager instanciado com sucesso!');
                diagnostico.solucoes.push('DataManager instanciado automaticamente');
                
                const produtos = window.dataManager.getProducts();
                diagnostico.dataManager.instanciado = true;
                diagnostico.dataManager.produtos = produtos.length;
                diagnostico.dataManager.funcionando = true;
            } catch (error) {
                console.error('❌ Falha ao instanciar DataManager:', error);
                diagnostico.problemas.push('Falha ao instanciar DataManager: ' + error.message);
            }
        }
    } else {
        diagnostico.dataManager = {
            existe: false,
            instanciado: false,
            produtos: 0,
            funcionando: false
        };
        console.error('❌ Classe DataManager não encontrada');
        diagnostico.problemas.push('Classe DataManager não carregada');
    }
    
    // 2. Verificar SQLiteManager
    console.log('🗄️ Verificando SQLiteManager...');
    if (window.sqliteManager) {
        try {
            const produtos = window.sqliteManager.getProducts();
            diagnostico.sqliteManager = {
                existe: true,
                funcionando: Array.isArray(produtos),
                produtos: produtos.length,
                database: !!window.sqliteManager.db
            };
            console.log(`✅ SQLiteManager: ${produtos.length} produtos encontrados`);
        } catch (error) {
            diagnostico.sqliteManager = {
                existe: true,
                funcionando: false,
                produtos: 0,
                database: !!window.sqliteManager.db,
                erro: error.message
            };
            console.error('❌ SQLiteManager com erro:', error);
            diagnostico.problemas.push('SQLiteManager com erro: ' + error.message);
        }
    } else {
        diagnostico.sqliteManager = {
            existe: false,
            funcionando: false,
            produtos: 0,
            database: false
        };
        console.warn('⚠️ SQLiteManager não disponível');
        diagnostico.problemas.push('SQLiteManager não disponível');
    }
    
    // 3. Verificar localStorage
    console.log('💾 Verificando localStorage...');
    try {
        const dadosStorage = localStorage.getItem('granjaRecantoFelizData');
        if (dadosStorage) {
            const parsed = JSON.parse(dadosStorage);
            diagnostico.localStorage = {
                existe: true,
                valido: true,
                produtos: parsed.products?.length || 0,
                ultimaAtualizacao: parsed.lastUpdate,
                tamanho: dadosStorage.length
            };
            console.log(`✅ localStorage: ${parsed.products?.length || 0} produtos encontrados`);
        } else {
            diagnostico.localStorage = {
                existe: false,
                valido: false,
                produtos: 0
            };
            console.warn('⚠️ localStorage vazio');
            diagnostico.problemas.push('localStorage vazio');
            
            // Tentar inicializar com dados padrão
            await inicializarDadosPadrao();
            diagnostico.solucoes.push('Dados padrão inicializados');
        }
    } catch (error) {
        diagnostico.localStorage = {
            existe: true,
            valido: false,
            produtos: 0,
            erro: error.message
        };
        console.error('❌ Erro no localStorage:', error);
        diagnostico.problemas.push('Erro no localStorage: ' + error.message);
    }
    
    // 4. Verificar interface
    console.log('🖥️ Verificando interface...');
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) {
        diagnostico.problemas.push('Elemento products-table-body não encontrado');
    }
    
    // 5. Relatório final
    console.log('📋 === RELATÓRIO DE DIAGNÓSTICO ===');
    console.log('DataManager:', diagnostico.dataManager);
    console.log('SQLiteManager:', diagnostico.sqliteManager);
    console.log('LocalStorage:', diagnostico.localStorage);
    console.log('Problemas encontrados:', diagnostico.problemas);
    console.log('Soluções aplicadas:', diagnostico.solucoes);
    
    // Salvar diagnóstico
    localStorage.setItem('diagnosticoProdutos', JSON.stringify(diagnostico));
    
    // Tentar corrigir automaticamente
    await aplicarCorrecoes(diagnostico);
    
    return diagnostico;
}

async function inicializarDadosPadrao() {
    console.log('🔧 Inicializando dados padrão...');
    
    const dadosPadrao = {
        products: [
            {
                id: 1,
                name: "Substrato BioFértil 3 Anos",
                category: "fertilizantes",
                slogan: "Mais do que Adubo: um substrato vivo e completo.",
                description: "Com um processo de maturação de 3 anos, nosso substrato é uma terra viva e completa, rica em matéria orgânica e microrganismos benéficos.",
                price: 40.00,
                image: "imagens/produtos/1/1.png",
                stock: 25,
                active: true
            },
            {
                id: 2,
                name: "FertiGota",
                category: "fertilizantes",
                slogan: "Adubo de galinha líquido e potente.",
                description: "Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas.",
                price: 25.00,
                image: "imagens/produtos/2/1.png",
                stock: 40,
                active: true
            },
            {
                id: 3,
                name: "Ovos Caipira 10",
                category: "ovos",
                slogan: "10 ovos frescos da granja.",
                description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 10 unidades.",
                price: 18.00,
                image: "imagens/produtos/3/1.jpeg",
                stock: 120,
                active: true
            }
        ],
        lastUpdate: new Date().toISOString(),
        version: '2.0.0'
    };
    
    localStorage.setItem('granjaRecantoFelizData', JSON.stringify(dadosPadrao));
    console.log('✅ Dados padrão inicializados com', dadosPadrao.products.length, 'produtos');
}

async function aplicarCorrecoes(diagnostico) {
    console.log('🔧 Aplicando correções automáticas...');
    
    // Correção 1: Instanciar DataManager se necessário
    if (!diagnostico.dataManager.instanciado && diagnostico.dataManager.existe) {
        try {
            window.dataManager = new DataManager();
            console.log('✅ DataManager instanciado');
        } catch (error) {
            console.error('❌ Falha ao instanciar DataManager:', error);
        }
    }
    
    // Correção 2: Recarregar tabela
    try {
        await loadProductsTable();
        console.log('✅ Tabela de produtos recarregada');
    } catch (error) {
        console.error('❌ Falha ao recarregar tabela:', error);
    }
    
    // Correção 3: Atualizar estatísticas
    try {
        updateDashboardStats();
        console.log('✅ Estatísticas atualizadas');
    } catch (error) {
        console.error('❌ Falha ao atualizar estatísticas:', error);
    }
}

// Função global para corrigir problemas (chamada pelo botão de erro)
window.fixProductLoadingIssue = async function() {
    console.log('🚨 Correção manual iniciada...');
    const diagnostico = await diagnosticarProblemasProdutos();
    
    // Mostrar resultados na interface
    const tableBody = document.getElementById('products-table-body');
    if (tableBody && diagnostico.dataManager?.produtos > 0) {
        console.log('🔄 Recarregando interface após correção...');
        await loadProductsTable();
    }
};

// Executar diagnóstico na inicialização
console.log('📦 Sistema de Diagnóstico de Produtos carregado');

// Auto-executar se não há produtos na tela após 2 segundos
setTimeout(async () => {
    const tableBody = document.getElementById('products-table-body');
    if (tableBody && tableBody.innerHTML.includes('Carregando')) {
        console.log('⚠️ Produtos ainda carregando após 2s - executando diagnóstico');
        await diagnosticarProblemasProdutos();
    }
}, 2000);
