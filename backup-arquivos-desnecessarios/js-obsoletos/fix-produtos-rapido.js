// CORREÇÃO RÁPIDA PARA PRODUTOS NÃO CARREGADOS
// Execute este script no console do navegador ou inclua na página

console.log('🔧 INICIANDO CORREÇÃO RÁPIDA DE PRODUTOS...');

// Função principal de correção
async function corrigirProdutosRapido() {
    try {
        console.log('1️⃣ Verificando estado atual...');
        
        // Verificar se DataManager existe
        if (!window.dataManager) {
            console.log('⚠️ DataManager não encontrado, criando...');
            window.dataManager = new DataManager();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Verificar produtos no DataManager
        let produtos = window.dataManager.getProducts();
        console.log(`📊 DataManager tem ${produtos.length} produtos`);
        
        if (produtos.length === 0) {
            console.log('2️⃣ Carregando produtos padrão...');
            
            // Produtos padrão para emergência
            const produtosPadrao = [
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
                },
                {
                    id: 4,
                    name: "Ovos Caipira 20",
                    category: "ovos",
                    slogan: "20 ovos frescos da granja.",
                    description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 20 unidades.",
                    price: 30.00,
                    image: "imagens/produtos/4/1.jpeg",
                    stock: 80,
                    active: true
                },
                {
                    id: 5,
                    name: "Ovos Caipira 30",
                    category: "ovos",
                    slogan: "30 ovos frescos da granja.",
                    description: "Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 30 unidades.",
                    price: 45.00,
                    image: "imagens/produtos/5/1.png",
                    stock: 50,
                    active: true
                },
                {
                    id: 6,
                    name: "Galinha Caipira Picada",
                    category: "aves",
                    slogan: "Galinha caipira cortada, pronta para cozinhar.",
                    description: "Galinha caipira picada, sabor autêntico da roça. Ideal para receitas tradicionais.",
                    price: 60.00,
                    image: "imagens/produtos/6/1.png",
                    stock: 15,
                    active: true
                },
                {
                    id: 7,
                    name: "Galinha Caipira Inteira",
                    category: "aves",
                    slogan: "Galinha caipira inteira, fresca e saborosa.",
                    description: "Galinha caipira inteira, criada solta e alimentada naturalmente. Perfeita para assados e cozidos.",
                    price: 110.00,
                    image: "imagens/produtos/7/1.png",
                    stock: 8,
                    active: true
                }
            ];
            
            // Salvar no localStorage
            const dadosCompletos = {
                products: produtosPadrao,
                lastUpdate: new Date().toISOString(),
                initialized: true,
                source: 'fix-rapido',
                version: '2.0.1'
            };
            
            localStorage.setItem('granjaRecantoFelizData', JSON.stringify(dadosCompletos));
            console.log('💾 Produtos salvos no localStorage');
            
            // Recriar DataManager
            window.dataManager = new DataManager();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            produtos = window.dataManager.getProducts();
            console.log(`✅ Agora temos ${produtos.length} produtos`);
        }
        
        console.log('3️⃣ Forçando atualização da interface...');
        
        // Disparar evento de atualização
        window.dispatchEvent(new CustomEvent('productsUpdated', {
            detail: { 
                products: produtos, 
                source: 'fix-rapido',
                timestamp: new Date().toISOString()
            }
        }));
        
        // Tentar renderizar produtos se a função existir
        if (typeof renderProducts === 'function') {
            renderProducts('all');
            console.log('🎨 Produtos renderizados');
        } else if (typeof initProducts === 'function') {
            initProducts();
            console.log('🎨 Sistema de produtos reinicializado');
        }
        
        console.log('✅ CORREÇÃO CONCLUÍDA!');
        console.log(`📦 ${produtos.length} produtos disponíveis`);
        console.log('🔄 Recarregue a página se necessário');
        
        // Mostrar notificação visual se possível
        if (typeof showNotification === 'function') {
            showNotification('Produtos corrigidos! Recarregue a página.', 'success');
        } else {
            alert('✅ Produtos corrigidos! Recarregue a página para ver as mudanças.');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro na correção:', error);
        alert('❌ Erro na correção: ' + error.message);
        return false;
    }
}

// Função para verificar status
function verificarStatusProdutos() {
    console.log('🔍 VERIFICANDO STATUS DOS PRODUTOS...');
    
    // DataManager
    if (window.dataManager) {
        const produtos = window.dataManager.getProducts();
        console.log(`📊 DataManager: ${produtos.length} produtos`);
        if (produtos.length > 0) {
            console.log(`💰 Primeiro produto: ${produtos[0].name} - R$ ${produtos[0].price}`);
        }
    } else {
        console.log('❌ DataManager não encontrado');
    }
    
    // localStorage
    const localData = localStorage.getItem('granjaRecantoFelizData');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            console.log(`💾 localStorage: ${parsed.products?.length || 0} produtos`);
            console.log(`📅 Última atualização: ${parsed.lastUpdate}`);
        } catch (error) {
            console.log('❌ localStorage corrompido');
        }
    } else {
        console.log('❌ localStorage vazio');
    }
    
    // SQLite
    if (window.sqliteManager && window.sqliteManager.db) {
        try {
            const sqliteProdutos = window.sqliteManager.getProducts();
            console.log(`🗄️ SQLite: ${sqliteProdutos.length} produtos`);
        } catch (error) {
            console.log('❌ Erro no SQLite:', error.message);
        }
    } else {
        console.log('⚠️ SQLite não inicializado');
    }
}

// Executar automaticamente se não houver produtos
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        verificarStatusProdutos();
        
        // Se não há produtos, executar correção automática
        if (window.dataManager) {
            const produtos = window.dataManager.getProducts();
            if (produtos.length === 0) {
                console.log('🚨 Nenhum produto encontrado, executando correção automática...');
                corrigirProdutosRapido();
            }
        }
    }, 2000);
});

// Tornar funções globais para uso no console
window.corrigirProdutosRapido = corrigirProdutosRapido;
window.verificarStatusProdutos = verificarStatusProdutos;

console.log('🔧 Script de correção carregado!');
console.log('💡 Use: corrigirProdutosRapido() ou verificarStatusProdutos()');