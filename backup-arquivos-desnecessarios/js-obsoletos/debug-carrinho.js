// Debug do Carrinho - Identificar problema
console.log('🔍 DEBUG: Iniciando diagnóstico do carrinho...');

// Aguardar DOM
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🔍 DEBUG: Verificando elementos...');
        
        // Verificar se modal existe
        const modal = document.getElementById('product-modal');
        console.log('Modal encontrado:', modal ? '✅' : '❌');
        
        if (modal) {
            // Verificar conteúdo do modal
            console.log('Modal HTML:', modal.innerHTML.substring(0, 200) + '...');
            
            // Adicionar listener de debug
            modal.addEventListener('click', function(e) {
                console.log('🖱️ DEBUG: Clique no modal detectado!');
                console.log('Target:', e.target);
                console.log('Target ID:', e.target.id);
                console.log('Target classes:', e.target.className);
                console.log('Target text:', e.target.textContent);
                
                // Verificar se é o botão
                if (e.target.id === 'add-to-cart-modal') {
                    console.log('🎯 DEBUG: É o botão add-to-cart-modal!');
                }
                
                if (e.target.textContent && e.target.textContent.includes('Adicionar')) {
                    console.log('🎯 DEBUG: Contém texto "Adicionar"!');
                }
            });
        }
        
        // Verificar produtos
        console.log('window.produtos:', window.produtos ? '✅' : '❌');
        if (window.produtos) {
            console.log('Quantidade de produtos:', window.produtos.length);
        }
        
        // Verificar carrinho
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        console.log('Carrinho atual:', carrinho.length, 'itens');
        
    }, 5000);
});

console.log('✅ DEBUG: Script carregado');