// Correção Direta: Botão Adicionar ao Carrinho
console.log('🔧 Carregando correção direta do carrinho...');

// Aguardar DOM estar pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando correção direta do carrinho...');
    
    // Aguardar modal estar disponível
    setTimeout(() => {
        const modal = document.getElementById('product-modal');
        if (modal) {
            console.log('✅ Modal encontrado, aplicando correção...');
            
            // Remover todos os event listeners existentes do modal
            const newModal = modal.cloneNode(true);
            modal.parentNode.replaceChild(newModal, modal);
            
            // Adicionar event listener limpo
            newModal.addEventListener('click', function(e) {
                console.log('🖱️ Clique no modal:', e.target.id, e.target.tagName);
                
                // Botão adicionar ao carrinho
                if (e.target.id === 'add-to-cart-modal' || 
                    e.target.closest('#add-to-cart-modal') ||
                    (e.target.tagName === 'BUTTON' && e.target.textContent.includes('Adicionar ao Carrinho'))) {
                    
                    console.log('🛒 CORREÇÃO DIRETA: Botão adicionar clicado!');
                    
                    const qtyInput = newModal.querySelector('#product-quantity');
                    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
                    
                    const productTitle = newModal.querySelector('#modal-product-title');
                    if (productTitle) {
                        const productName = productTitle.textContent;
                        const product = window.produtos ? window.produtos.find(p => p.name === productName) : null;
                        
                        if (product) {
                            // Adicionar ao carrinho
                            const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                            
                            for (let i = 0; i < quantity; i++) {
                                carrinho.push(product);
                            }
                            
                            localStorage.setItem('carrinho', JSON.stringify(carrinho));
                            
                            // Atualizar display
                            const cartCount = document.getElementById('cart-count');
                            const cartTotal = document.getElementById('cart-total-display');
                            
                            if (cartCount) cartCount.textContent = carrinho.length;
                            if (cartTotal) {
                                const total = carrinho.reduce((sum, item) => sum + item.price, 0);
                                cartTotal.textContent = `R$ ${total.toFixed(2)}`;
                            }
                            
                            // Mostrar notificação
                            const notification = document.createElement('div');
                            notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
                            notification.innerHTML = `✅ ${product.name} adicionado ao carrinho!`;
                            document.body.appendChild(notification);
                            
                            setTimeout(() => notification.remove(), 3000);
                            
                            // Fechar modal
                            newModal.classList.add('hidden');
                            newModal.style.display = 'none';
                            
                            console.log(`✅ SUCESSO: ${quantity}x ${product.name} adicionado!`);
                        }
                    }
                }
                
                // Botões de quantidade
                if (e.target.id === 'qty-minus') {
                    const qtyInput = newModal.querySelector('#product-quantity');
                    if (qtyInput && qtyInput.value > 1) {
                        qtyInput.value = parseInt(qtyInput.value) - 1;
                    }
                }
                
                if (e.target.id === 'qty-plus') {
                    const qtyInput = newModal.querySelector('#product-quantity');
                    if (qtyInput) {
                        qtyInput.value = parseInt(qtyInput.value) + 1;
                    }
                }
            });
            
            console.log('✅ Correção direta aplicada com sucesso!');
        } else {
            console.log('❌ Modal não encontrado');
        }
    }, 3000);
});

console.log('✅ Correção direta do carrinho carregada');