// Correção emergencial para exibição de produtos
// Este arquivo força o carregamento e exibição dos produtos

console.log('🚨 CORREÇÃO EMERGENCIAL: Forçando carregamento de produtos...');

// Função para forçar carregamento dos produtos
async function forceLoadProducts() {
    try {
        console.log('🔧 Iniciando correção de produtos...');
        
        // 1. Verificar se DataManager existe
        if (!window.dataManager) {
            console.log('📦 Criando DataManager...');
            window.dataManager = new DataManager();
            await new Promise(resolve => setTimeout(resolve, 500)); // Aguardar inicialização
        }
        
        // 2. Tentar carregar produtos do arquivo JSON
        let products = [];
        try {
            console.log('📄 Tentando carregar do arquivo JSON...');
            const response = await fetch('data/produtos.json', { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                if (data.products && Array.isArray(data.products)) {
                    products = data.products;
                    console.log(`✅ ${products.length} produtos carregados do JSON`);
                    
                    // Salvar no localStorage
                    const saveData = {
                        products: products,
                        lastUpdate: new Date().toISOString(),
                        source: 'json-fix'
                    };
                    localStorage.setItem('granjaRecantoFelizData', JSON.stringify(saveData));
                }
            }
        } catch (jsonError) {
            console.warn('⚠️ Erro ao carregar JSON:', jsonError);
        }
        
        // 3. Se não conseguiu do JSON, usar produtos padrão
        if (products.length === 0) {
            console.log('🔄 Usando produtos padrão...');
            products = [
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
                    description: "Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas. Ideal para hortas, jardins e vasos.",
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
            
            // Salvar produtos padrão
            const saveData = {
                products: products,
                lastUpdate: new Date().toISOString(),
                source: 'default-fix'
            };
            localStorage.setItem('granjaRecantoFelizData', JSON.stringify(saveData));
            console.log(`✅ ${products.length} produtos padrão salvos`);
        }
        
        // 4. Forçar renderização dos produtos
        const productGrid = document.getElementById('product-grid');
        if (productGrid && products.length > 0) {
            console.log('🎨 Renderizando produtos...');
            
            productGrid.innerHTML = '';
            products.forEach(product => {
                const productCard = `
                    <div class="product-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl relative">
                        <img src="${product.image}" alt="${product.name}" class="w-40 h-40 object-cover rounded-lg mb-4" onerror="this.src='imagens/produtos/default/placeholder.png'">
                        <h3 class="text-xl font-bold mb-2 font-lora">${product.name}</h3>
                        <p class="text-gray-600 mb-4 flex-grow">${product.slogan}</p>
                        <span class="text-xl font-bold text-[#5D4037] mb-4">R$ ${product.price.toFixed(2)}</span>
                        <button class="detail-btn bg-[#8B4513] hover:bg-[#5D4037] text-white font-bold py-2 px-4 rounded-lg transition w-full" data-id="${product.id}">Ver Detalhes</button>
                    </div>
                `;
                productGrid.innerHTML += productCard;
            });
            
            console.log(`✅ ${products.length} produtos renderizados com sucesso!`);
            
            // Adicionar eventos aos botões
            const detailButtons = productGrid.querySelectorAll('.detail-btn');
            detailButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    console.log(`🔍 Abrindo detalhes do produto ${productId}`);
                    // Aqui você pode adicionar a lógica do modal se necessário
                });
            });
        }
        
        // 5. Disparar evento de atualização
        window.dispatchEvent(new CustomEvent('productsUpdated', {
            detail: { products: products, source: 'emergency-fix' }
        }));
        
        console.log('🎉 CORREÇÃO CONCLUÍDA: Produtos carregados e exibidos!');
        return products;
        
    } catch (error) {
        console.error('❌ Erro na correção emergencial:', error);
        
        // Fallback final: mostrar mensagem de erro
        const productGrid = document.getElementById('product-grid');
        if (productGrid) {
            productGrid.innerHTML = `
                <div class="col-span-4 text-center p-8">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h3 class="text-red-800 font-bold mb-2">Erro ao Carregar Produtos</h3>
                        <p class="text-red-600 mb-4">Não foi possível carregar os produtos. Tente recarregar a página.</p>
                        <button onclick="window.location.reload()" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Recarregar Página
                        </button>
                    </div>
                </div>
            `;
        }
        return [];
    }
}

// Executar correção quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceLoadProducts);
} else {
    // DOM já está pronto
    forceLoadProducts();
}

// Tornar função global para debug
window.forceLoadProducts = forceLoadProducts;

console.log('🔧 Correção emergencial de produtos carregada e pronta!');