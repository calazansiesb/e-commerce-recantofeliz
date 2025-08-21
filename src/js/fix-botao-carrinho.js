// Correção Final do Botão Carrinho
console.log('🔧 Correção final do botão carrinho...');

// Interceptar a função que cria o modal
const originalOpenModal = window.openProductModal;

window.openProductModal = function(productId) {
    console.log('🔄 Abrindo modal para produto:', productId);
    
    // Chamar função original se existir
    if (originalOpenModal) {
        originalOpenModal(productId);
    }
    
    // Aguardar modal ser criado e substituir o botão
    setTimeout(() => {
        const modal = document.getElementById('product-modal');
        const modalContent = modal ? modal.querySelector('#modal-content-grid') : null;
        
        if (modalContent) {
            // Encontrar o produto
            const product = window.produtos ? window.produtos.find(p => p.id == productId) : null;
            
            if (product) {
                console.log('✅ Produto encontrado:', product.name);
                
                // Substituir toda a seção de quantidade e botão
                const quantityAndButtonHTML = `
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">Quantidade:</label>
                        <div class="flex items-center space-x-3">
                            <button onclick="
                                const qty = document.getElementById('product-quantity');
                                if (qty.value > 1) qty.value = parseInt(qty.value) - 1;
                            " class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input id="product-quantity" type="number" value="1" min="1" class="w-20 text-center border rounded py-2">
                            <button onclick="
                                const qty = document.getElementById('product-quantity');
                                qty.value = parseInt(qty.value) + 1;
                            " class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button onclick="
                        console.log('🛒 BOTÃO INLINE CLICADO!');
                        const qty = document.getElementById('product-quantity').value || 1;
                        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                        const produto = {id: ${product.id}, name: '${product.name}', price: ${product.price}};
                        for(let i = 0; i < qty; i++) carrinho.push(produto);
                        localStorage.setItem('carrinho', JSON.stringify(carrinho));
                        document.getElementById('cart-count').textContent = carrinho.length;
                        const total = carrinho.reduce((s,i) => s + i.price, 0);
                        document.getElementById('cart-total-display').textContent = 'R$ ' + total.toFixed(2);
                        alert('✅ ${product.name} adicionado ao carrinho!');
                        document.getElementById('product-modal').classList.add('hidden');
                        document.getElementById('product-modal').style.display = 'none';
                    " class="w-full bg-[#4CAF50] hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                        <i class="fas fa-cart-plus mr-2"></i> Adicionar ao Carrinho
                    </button>
                `;
                
                // Remover seção de quantidade e botão existentes
                const lastDiv = modalContent.querySelector('div:last-child');
                if (lastDiv) {
                    // Remover elementos existentes
                    const qtySection = lastDiv.querySelector('.mb-4');
                    const existingButtons = lastDiv.querySelectorAll('button');
                    
                    if (qtySection) qtySection.remove();
                    existingButtons.forEach(btn => btn.remove());
                    
                    // Adicionar nova seção
                    lastDiv.innerHTML += quantityAndButtonHTML;
                    console.log('✅ Seção de quantidade e botão substituídos');
                }
            }
        }
    }, 1000);
};

console.log('✅ Correção final carregada');