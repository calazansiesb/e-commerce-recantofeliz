// Correção Simples do Carrinho
console.log('🛒 Carregando correção simples do carrinho...');

// Função global para adicionar ao carrinho
window.adicionarProdutoCarrinho = function(produtoNome, produtoPreco) {
    console.log('🛒 Adicionando produto:', produtoNome, 'R$', produtoPreco);
    
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Encontrar produto completo
    let produto = null;
    if (window.produtos) {
        produto = window.produtos.find(p => p.name === produtoNome);
    }
    
    if (!produto) {
        produto = {
            id: Date.now(),
            name: produtoNome,
            price: produtoPreco
        };
    }
    
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Atualizar contador
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = carrinho.length;
    
    // Atualizar total
    const cartTotal = document.getElementById('cart-total-display');
    if (cartTotal) {
        const total = carrinho.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
    
    // Mostrar alerta simples
    alert(`✅ ${produtoNome} adicionado ao carrinho!`);
    
    // Fechar modal
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
    
    console.log('✅ Produto adicionado com sucesso!');
};

// Interceptar criação do modal para adicionar onclick direto
const originalOpenModal = window.openProductModal;
if (originalOpenModal) {
    window.openProductModal = function(productId) {
        console.log('🔄 Interceptando abertura do modal para produto:', productId);
        
        // Chamar função original
        originalOpenModal(productId);
        
        // Aguardar modal ser criado e adicionar onclick
        setTimeout(() => {
            const modal = document.getElementById('product-modal');
            const addButton = modal ? modal.querySelector('#add-to-cart-modal') : null;
            
            if (addButton) {
                console.log('🎯 Botão encontrado, adicionando onclick direto...');
                
                // Remover listeners existentes
                addButton.onclick = null;
                
                // Adicionar onclick direto
                addButton.onclick = function() {
                    console.log('🛒 ONCLICK DIRETO: Botão clicado!');
                    
                    const productTitle = modal.querySelector('#modal-product-title');
                    const qtyInput = modal.querySelector('#product-quantity');
                    
                    if (productTitle) {
                        const productName = productTitle.textContent;
                        const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
                        
                        // Encontrar produto
                        const product = window.produtos ? window.produtos.find(p => p.name === productName) : null;
                        
                        if (product) {
                            for (let i = 0; i < quantity; i++) {
                                window.adicionarProdutoCarrinho(product.name, product.price);
                            }
                        }
                    }
                };
                
                console.log('✅ Onclick direto adicionado!');
            } else {
                console.log('❌ Botão não encontrado no modal');
            }
        }, 500);
    };
}

console.log('✅ Correção simples do carrinho carregada');