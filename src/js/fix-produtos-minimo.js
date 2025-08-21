// Correção mínima para exibir produtos no index.html
console.log('🔧 Carregando produtos...');

const produtos = [
    { id: 1, name: "Substrato BioFértil 3 Anos", category: "fertilizantes", slogan: "Mais do que Adubo: um substrato vivo e completo.", price: 40.00, image: "imagens/produtos/1/1.png" },
    { id: 2, name: "FertiGota", category: "fertilizantes", slogan: "Adubo de galinha líquido e potente.", price: 25.00, image: "imagens/produtos/2/1.png" },
    { id: 3, name: "Ovos Caipira 10", category: "ovos", slogan: "10 ovos frescos da granja.", price: 18.00, image: "imagens/produtos/3/1.jpeg" },
    { id: 4, name: "Ovos Caipira 20", category: "ovos", slogan: "20 ovos frescos da granja.", price: 30.00, image: "imagens/produtos/4/1.jpeg" },
    { id: 5, name: "Ovos Caipira 30", category: "ovos", slogan: "30 ovos frescos da granja.", price: 45.00, image: "imagens/produtos/5/1.png" },
    { id: 6, name: "Galinha Caipira Picada", category: "aves", slogan: "Galinha caipira cortada, pronta para cozinhar.", price: 60.00, image: "imagens/produtos/6/1.png" },
    { id: 7, name: "Galinha Caipira Inteira", category: "aves", slogan: "Galinha caipira inteira, fresca e saborosa.", price: 110.00, image: "imagens/produtos/7/1.png" }
];

async function renderizarProdutos() {
    // PRIORIDADE: localStorage (alterações temporárias) depois arquivo JSON
    const savedData = localStorage.getItem('granjaRecantoFelizData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            if (data.products && data.products.length > 0) {
                produtos.splice(0, produtos.length, ...data.products);
                console.log(`✅ ${data.products.length} produtos carregados do localStorage (temporário)`);
            }
        } catch (e) {
            console.log('⚠️ Erro no localStorage, tentando arquivo JSON');
        }
    }
    
    // Se não tem localStorage, carregar do arquivo JSON
    if (produtos.length === 0) {
        try {
            const response = await fetch('data/produtos.json', { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                if (data.products && data.products.length > 0) {
                    produtos.splice(0, produtos.length, ...data.products);
                    console.log(`✅ ${data.products.length} produtos carregados do arquivo JSON`);
                }
            }
        } catch (error) {
            console.log('⚠️ Erro ao carregar produtos.json, usando padrão');
        }
    }
    
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = produtos.map(p => `
        <div class="product-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl">
            <img src="${p.image}" alt="${p.name}" class="w-40 h-40 object-cover rounded-lg mb-4" onerror="this.src='imagens/produtos/default/placeholder.png'">
            <h3 class="text-xl font-bold mb-2 font-lora">${p.name}</h3>
            <p class="text-gray-600 mb-4 flex-grow">${p.slogan}</p>
            <span class="text-xl font-bold text-[#5D4037] mb-4">R$ ${p.price.toFixed(2)}</span>
            <button class="detail-btn bg-[#8B4513] hover:bg-[#5D4037] text-white font-bold py-2 px-4 rounded-lg transition w-full" data-id="${p.id}">Ver Detalhes</button>
        </div>
    `).join('');
    
    console.log(`✅ ${produtos.length} produtos exibidos`);
    
    // Salvar no localStorage se não existir
    if (!localStorage.getItem('granjaRecantoFelizData')) {
        localStorage.setItem('granjaRecantoFelizData', JSON.stringify({
            products: produtos,
            lastUpdate: new Date().toISOString()
        }));
    }
}

// Executar quando DOM estiver pronto - DESABILITADO para evitar conflito com index.html
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', renderizarProdutos);
// } else {
//     renderizarProdutos();
// }

// Disponibilizar função globalmente
window.renderizarProdutosMinimo = renderizarProdutos;

// Verificar atualizações do arquivo a cada 3 segundos
setInterval(async () => {
    try {
        const response = await fetch('data/produtos.json', { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            if (data.products && data.products.length > 0) {
                const currentLength = produtos.length;
                const currentPrice7 = produtos.find(p => p.id === 7)?.price;
                produtos.splice(0, produtos.length, ...data.products);
                const newPrice7 = produtos.find(p => p.id === 7)?.price;
                
                if (produtos.length !== currentLength || currentPrice7 !== newPrice7) {
                    renderizarProdutos();
                }
            }
        }
    } catch (error) {
        // Ignorar erros
    }
}, 3000);