// Correção mínima para exibir produtos no index.html
console.log('🔧 Carregando produtos...');

let produtos = [];

async function renderizarProdutos() {
    // SEMPRE carregar do arquivo JSON primeiro (fonte canônica)
    try {
        const response = await fetch('dados/produtos.json', { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            if (data.products && data.products.length > 0) {
                produtos.splice(0, produtos.length, ...data.products.filter(p => p.active !== false));
                console.log(`✅ ${produtos.length} produtos carregados do arquivo JSON`);
            }
        }
    } catch (error) {
        console.log('⚠️ Erro ao carregar produtos.json:', error);
    }
    
    // Fallback: localStorage apenas se JSON falhar
    if (produtos.length === 0) {
        const savedData = localStorage.getItem('granjaRecantoFelizData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.products && data.products.length > 0) {
                    produtos.splice(0, produtos.length, ...data.products.filter(p => p.active !== false));
                    console.log(`✅ ${produtos.length} produtos carregados do localStorage (fallback)`);
                }
            } catch (e) {
                console.log('⚠️ Erro no localStorage também');
            }
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
            <button class="detail-btn bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-4 rounded-lg transition w-full" data-id="${p.id}">
                <i class="fas fa-shopping-cart mr-2"></i>Comprar
            </button>
        </div>
    `).join('');
    
    console.log(`✅ ${produtos.length} produtos exibidos`);
    
    // Sincronizar com localStorage
    localStorage.setItem('granjaRecantoFelizData', JSON.stringify({
        products: produtos,
        lastUpdate: new Date().toISOString()
    }));
}

// Executar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderizarProdutos);
} else {
    renderizarProdutos();
}

// Disponibilizar funções globalmente
window.renderizarProdutosMinimo = renderizarProdutos;
window.renderizarProdutos = renderizarProdutos;
window.produtos = produtos;

// Sistema de verificação automática DESABILITADO para evitar conflito com filtros
// setInterval(async () => {
//     try {
//         const response = await fetch('data/produtos.json', { cache: 'no-store' });
//         if (response.ok) {
//             const data = await response.json();
//             if (data.products && data.products.length > 0) {
//                 const currentLength = produtos.length;
//                 const currentPrice7 = produtos.find(p => p.id === 7)?.price;
//                 produtos.splice(0, produtos.length, ...data.products);
//                 const newPrice7 = produtos.find(p => p.id === 7)?.price;
//                 
//                 if (produtos.length !== currentLength || currentPrice7 !== newPrice7) {
//                     renderizarProdutos();
//                 }
//             }
//         }
//     } catch (error) {
//         // Ignorar erros
//     }
// }, 3000);

console.log('🔒 Sistema de atualização automática desabilitado para preservar filtros');