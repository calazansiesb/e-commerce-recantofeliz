// CORREÇÃO DE EMERGÊNCIA - PRODUTOS NÃO ENCONTRADOS
console.log('🚨 CORREÇÃO DE EMERGÊNCIA ATIVADA');

// Produtos padrão garantidos
const PRODUTOS_EMERGENCIA = [
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
        description: "Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico.",
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
        description: "Galinha caipira inteira, criada solta e alimentada naturalmente.",
        price: 110.00,
        image: "imagens/produtos/7/1.png",
        stock: 8,
        active: true
    }
];

// Função de correção imediata
function corrigirProdutosAgora() {
    console.log('🔧 Aplicando correção imediata...');
    
    // 1. Forçar dados no localStorage
    const dadosCorrigidos = {
        products: PRODUTOS_EMERGENCIA,
        lastUpdate: new Date().toISOString(),
        source: 'emergencia',
        initialized: true
    };
    
    localStorage.setItem('granjaRecantoFelizData', JSON.stringify(dadosCorrigidos));
    console.log('✅ Dados forçados no localStorage');
    
    // 2. Recriar DataManager
    if (window.DataManager) {
        window.dataManager = new DataManager();
        console.log('✅ DataManager recriado');
    }
    
    // 3. Forçar atualização da interface
    setTimeout(() => {
        if (typeof loadProductsTable === 'function') {
            loadProductsTable();
        }
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('productsUpdated', {
            detail: { products: PRODUTOS_EMERGENCIA, source: 'emergencia' }
        }));
        
        console.log('✅ Interface atualizada');
    }, 500);
    
    return true;
}

// Executar correção automaticamente se não há produtos
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const data = localStorage.getItem('granjaRecantoFelizData');
        let needsFix = false;
        
        if (!data) {
            needsFix = true;
            console.log('⚠️ localStorage vazio');
        } else {
            try {
                const parsed = JSON.parse(data);
                if (!parsed.products || parsed.products.length === 0) {
                    needsFix = true;
                    console.log('⚠️ Nenhum produto no localStorage');
                }
            } catch (error) {
                needsFix = true;
                console.log('⚠️ Dados corrompidos no localStorage');
            }
        }
        
        if (needsFix) {
            console.log('🚨 Executando correção automática...');
            corrigirProdutosAgora();
        }
    }, 1000);
});

// Tornar função global
window.corrigirProdutosAgora = corrigirProdutosAgora;