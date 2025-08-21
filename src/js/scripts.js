// Sistema de Carrossel
let currentSlide = 0;
let carouselInterval;

// Variável global para produtos (usada pelos filtros)
let produtos = [];

document.addEventListener('DOMContentLoaded', function() {
    // Aguardar DataManager carregar
    setTimeout(() => {
        console.log('🔍 Site principal: Verificando DataManager...');
        if (!window.dataManager) {
            console.log('⚠️ DataManager não encontrado, criando nova instância...');
            window.dataManager = new DataManager();
        } else {
            console.log('✅ DataManager já existe, reutilizando instância');
        }
        
        // Verificar dados no localStorage
        const storageData = localStorage.getItem('granjaRecantoFelizData');
        if (storageData) {
            const parsed = JSON.parse(storageData);
            console.log('💾 Site principal: Dados no localStorage:', parsed.products?.length, 'produtos');
            console.log('💰 Primeiro produto no storage:', parsed.products?.[0]);
        }
        
        // Verificar dados persistentes
        if (window.persistenceManager) {
            const persistentData = window.persistenceManager.loadPersistentData();
            if (persistentData && persistentData.products && persistentData.products.length > 0) {
                console.log('🔄 Site principal: Dados persistentes encontrados, aplicando...');
                
                // Não recriar DataManager, apenas garantir sincronização
                const produtos = window.dataManager.getProducts();
                if (produtos.length === 0 || persistentData.lastUpdate > (produtos.lastUpdate || '')) {
                    console.log('🔄 Sincronizando com dados persistentes...');
                    localStorage.setItem('granjaRecantoFelizData', JSON.stringify(persistentData));
                }
            }
        }
        
        initCarousel();
        initProducts();
        
        // Verificar mudanças no localStorage periodicamente
        setInterval(() => {
            const currentData = localStorage.getItem('granjaRecantoFelizData');
            if (currentData && window.dataManager) {
                try {
                    const parsed = JSON.parse(currentData);
                    const currentProducts = window.dataManager.getActiveProducts();
                    
                    // Verificar se precisa atualizar (sem recriar o DataManager)
                    if (parsed.products && parsed.products.length > 0 && currentProducts.length > 0) {
                        const storageProduct = parsed.products[0];
                        const currentProduct = currentProducts[0];
                        
                        if (storageProduct && currentProduct && 
                            (storageProduct.price !== currentProduct.price || 
                             storageProduct.name !== currentProduct.name)) {
                            console.log('🔄 Diferenças detectadas nos produtos, disparando evento de atualização...');
                            
                            // Disparar evento para o index.html atualizar
                            window.dispatchEvent(new CustomEvent('productsUpdated', {
                                detail: { source: 'localStorage', timestamp: Date.now() }
                            }));
                        }
                    }
                } catch (error) {
                    console.log('⚠️ Erro ao verificar mudanças no localStorage:', error);
                }
            }
        }, 3000);
    }, 100);
});

// Função para adicionar produto ao carrinho (escopo global)
function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const existente = carrinho.find(item => item.id === produto.id);
    
    if (existente) {
        existente.quantidade += 1;
        console.log(`✅ Quantidade atualizada: ${produto.name} (${existente.quantidade}x)`);
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.name,
            preco: produto.price,
            quantidade: 1
        });
        console.log(`✅ Produto adicionado: ${produto.name}`);
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    console.log('🛒 Carrinho atualizado:', carrinho);
    
    // Mostrar notificação melhorada
    showCartNotification(`${produto.name} adicionado ao carrinho!`);
    
    // Atualizar contador do carrinho
    updateCartCounter();
}

// Adiciona evento ao botão "Adicionar ao Carrinho" após renderizar produtos
function adicionarEventosCarrinho() {
    // Eventos para botões do modal (que já são tratados na função openProductModal)
    // Esta função pode ser usada para adicionar eventos a outros botões se necessário
    console.log('Eventos do carrinho configurados');
}

// Função para solicitar dados complementares
function solicitarDadosComplementares() {
    return new Promise((resolve) => {
        // Criar formulário modal
        const formularioHTML = `
            <div id="modal-dados-cliente" style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
                align-items: center; justify-content: center;
            ">
                <div style="
                    background: white; padding: 30px; border-radius: 10px; 
                    max-width: 500px; width: 90%; max-height: 80%; overflow-y: auto;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                ">
                    <h3 style="margin-bottom: 20px; color: #5D4037; text-align: center;">📦 Dados para Entrega</h3>
                    <form id="form-dados-cliente">
                        <!-- Seção de Endereço PRIMEIRO -->
                        <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
                            <h4 style="margin-bottom: 15px; font-weight: bold; color: #333;">📍 Confirme seu endereço de entrega:</h4>
                            
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">CEP</label>
                                <input type="text" id="cep-cliente-final" maxlength="9" style="
                                    width: 70%; padding: 10px; border: 2px solid #ddd; 
                                    border-radius: 6px; font-size: 14px; box-sizing: border-box;
                                " placeholder="00000-000">
                                <button type="button" id="buscar-endereco-final" style="
                                    width: 25%; margin-left: 5%; padding: 10px; background: #007bff; color: white;
                                    border: none; border-radius: 6px; cursor: pointer; font-size: 14px;
                                ">🔍 Buscar</button>
                            </div>
                            
                            <div id="endereco-fields-final" style="display: none;">
                                <input type="text" id="rua-cliente" readonly style="
                                    width: 100%; padding: 10px; border: 2px solid #ddd; margin-bottom: 10px;
                                    border-radius: 6px; font-size: 14px; box-sizing: border-box; background: #f9f9f9;
                                " placeholder="Rua">
                                <input type="text" id="numero-cliente" required style="
                                    width: 48%; padding: 10px; border: 2px solid #ddd; margin-bottom: 10px;
                                    border-radius: 6px; font-size: 14px; box-sizing: border-box;
                                " placeholder="Número *">
                                <input type="text" id="complemento-cliente" style="
                                    width: 48%; margin-left: 4%; padding: 10px; border: 2px solid #ddd; margin-bottom: 10px;
                                    border-radius: 6px; font-size: 14px; box-sizing: border-box;
                                " placeholder="Complemento">
                                <input type="text" id="bairro-cliente" readonly style="
                                    width: 48%; padding: 10px; border: 2px solid #ddd; margin-bottom: 10px;
                                    border-radius: 6px; font-size: 14px; box-sizing: border-box; background: #f9f9f9;
                                " placeholder="Bairro">
                                <input type="text" id="cidade-cliente" readonly style="
                                    width: 48%; margin-left: 4%; padding: 10px; border: 2px solid #ddd; margin-bottom: 10px;
                                    border-radius: 6px; font-size: 14px; box-sizing: border-box; background: #f9f9f9;
                                " placeholder="Cidade">
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">👤 Nome Completo *</label>
                            <input type="text" id="nome-cliente" required style="
                                width: 100%; padding: 10px; border: 2px solid #ddd; 
                                border-radius: 6px; font-size: 14px; box-sizing: border-box;
                            " placeholder="Digite seu nome completo">
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">📱 Telefone para Contato *</label>
                            <input type="tel" id="telefone-cliente" required style="
                                width: 100%; padding: 10px; border: 2px solid #ddd; 
                                border-radius: 6px; font-size: 14px; box-sizing: border-box;
                            " placeholder="(38) 99999-9999">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">🆔 Documento de Identificação *</label>
                            <select id="tipo-documento" required style="
                                width: 100%; padding: 10px; border: 2px solid #ddd; 
                                border-radius: 6px; font-size: 14px; margin-bottom: 10px; box-sizing: border-box;
                            ">
                                <option value="">Selecione o tipo de documento</option>
                                <option value="CPF">CPF</option>
                                <option value="RG">RG</option>
                                <option value="CNH">CNH</option>
                            </select>
                            <input type="text" id="numero-documento" required style="
                                width: 100%; padding: 10px; border: 2px solid #ddd; 
                                border-radius: 6px; font-size: 14px; box-sizing: border-box;
                            " placeholder="Número do documento">
                        </div>
                        
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button type="button" id="btn-cancelar" style="
                                padding: 12px 24px; background: #ccc; color: #333; 
                                border: none; border-radius: 6px; cursor: pointer;
                                font-size: 14px; font-weight: bold;
                            ">Cancelar</button>
                            <button type="submit" style="
                                padding: 12px 24px; background: #25D366; color: white; 
                                border: none; border-radius: 6px; cursor: pointer;
                                font-size: 14px; font-weight: bold;
                            ">📱 Enviar via WhatsApp</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Adicionar formulário ao DOM
        document.body.insertAdjacentHTML('beforeend', formularioHTML);
        
        // Função para fechar modal
        function fecharModal() {
            const modal = document.getElementById('modal-dados-cliente');
            if (modal) modal.remove();
        }
        
        // Preencher CEP se já foi verificado no carrinho
        const cepSalvo = localStorage.getItem('cepEntrega');
        if (cepSalvo) {
            const cepFormatado = cepSalvo.replace(/(\d{5})(\d{3})/, '$1-$2');
            document.getElementById('cep-cliente-final').value = cepFormatado;
            // Buscar automaticamente
            buscarEnderecoPorCEP(cepSalvo);
        }
        
        // Máscara para CEP
        document.getElementById('cep-cliente-final').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
        
        // Evento para buscar endereço
        document.getElementById('buscar-endereco-final').addEventListener('click', () => {
            const cep = document.getElementById('cep-cliente-final').value.replace(/\D/g, '');
            buscarEnderecoPorCEP(cep);
        });
        
        // Função para buscar endereço
        async function buscarEnderecoPorCEP(cep) {
            if (cep.length !== 8) {
                alert('Por favor, digite um CEP válido com 8 dígitos.');
                return;
            }
            
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                
                if (data.erro) {
                    alert('CEP não encontrado. Por favor, verifique o CEP digitado.');
                    return;
                }
                
                // Preencher campos
                document.getElementById('rua-cliente').value = data.logradouro || '';
                document.getElementById('bairro-cliente').value = data.bairro || '';
                document.getElementById('cidade-cliente').value = data.localidade || '';
                
                // Mostrar campos de endereço
                document.getElementById('endereco-fields-final').style.display = 'block';
                
                // Focar no campo número
                document.getElementById('numero-cliente').focus();
                
            } catch (error) {
                alert('Erro ao buscar CEP. Tente novamente.');
                console.error('Erro na busca do CEP:', error);
            }
        }
        
        // Evento para cancelar
        document.getElementById('btn-cancelar').addEventListener('click', () => {
            fecharModal();
            resolve(null);
        });
        
        // Evento para enviar formulário
        document.getElementById('form-dados-cliente').addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Coletar dados
            const nome = document.getElementById('nome-cliente').value.trim();
            const telefone = document.getElementById('telefone-cliente').value.trim();
            const tipoDoc = document.getElementById('tipo-documento').value;
            const numeroDoc = document.getElementById('numero-documento').value.trim();
            
            let endereco = '';
            
            // Coletar dados de endereço
            const rua = document.getElementById('rua-cliente').value.trim();
            const numero = document.getElementById('numero-cliente').value.trim();
            const complemento = document.getElementById('complemento-cliente').value.trim();
            const bairro = document.getElementById('bairro-cliente').value.trim();
            const cidade = document.getElementById('cidade-cliente').value.trim();
            const cep = document.getElementById('cep-cliente-final').value.trim();
            
            if (!rua || !numero || !bairro || !cidade || !cep) {
                alert('Por favor, preencha todos os campos de endereço obrigatórios.');
                return;
            }
            
            endereco = `${rua}, ${numero}${complemento ? ', ' + complemento : ''}, ${bairro}, ${cidade} - CEP: ${cep}`;
            
            // Validar campos obrigatórios
            if (!nome || !telefone || !endereco || !tipoDoc || !numeroDoc) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Retornar dados
            const dados = {
                nome,
                telefone,
                endereco,
                documento: `${tipoDoc}: ${numeroDoc}`
            };
            
            fecharModal();
            resolve(dados);
        });
        
        // Focar no primeiro campo (CEP se não estiver preenchido, senão nome)
        setTimeout(() => {
            const cepInput = document.getElementById('cep-cliente-final');
            if (!cepInput.value) {
                cepInput.focus();
            } else {
                document.getElementById('nome-cliente').focus();
            }
        }, 100);
    });
}

// Função para registrar pedido realizado
async function registrarPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    // Verificar se o sistema de pedidos está pronto
    if (!window.pedidosManager || !window.pedidosManager.isInitialized) {
        console.log('⏳ Aguardando sistema de pedidos...');
        
        // Aguardar inicialização (máximo 5 segundos)
        let tentativas = 0;
        while ((!window.pedidosManager || !window.pedidosManager.isInitialized) && tentativas < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            tentativas++;
        }
        
        if (!window.pedidosManager || !window.pedidosManager.isInitialized) {
            alert('Erro: Sistema de pedidos não disponível. Tente novamente.');
            return;
        }
    }
    
    // Solicitar dados complementares
    const dadosComplementares = await solicitarDadosComplementares();
    if (!dadosComplementares) {
        return; // Usuário cancelou
    }
    
    try {
        // Salvar pedido no banco de dados usando o novo sistema
        const resultadoPedido = await window.pedidosManager.criarPedido(dadosComplementares, carrinho);
        
        console.log(`✅ Pedido ${resultadoPedido.numero} criado com sucesso!`);
        
        // Gerar mensagem reformulada para WhatsApp
        let mensagem = `🥚 • • • RECANTO FELIZ • • • 🐔\n\n`;
        mensagem += `Olá, ${dadosComplementares.nome}! 😊\n`;
        mensagem += `Muito obrigado por escolher os produtos Recanto Feliz!\n\n`;
        mensagem += `Seu pedido foi confirmado e já está sendo preparado com todo carinho!\n\n`;
        
        mensagem += `🛒 *RESUMO DO PEDIDO*\n`;
        mensagem += `Pedido: ${resultadoPedido.numero}\n\n`;
        
        mensagem += `🍃 *ITENS:*\n`;
        carrinho.forEach(item => {
            mensagem += `*${item.nome}*\n`;
            mensagem += `R$ ${item.preco.toFixed(2)}\n`;
        });
        mensagem += `—————————————\n`;
        mensagem += `Total: *R$ ${resultadoPedido.valor_total.toFixed(2)}*\n\n`;
        
        mensagem += `📍 *ENTREGA*\n`;
        mensagem += `Seu pedido será entregue no endereço:\n`;
        mensagem += `${dadosComplementares.endereco}\n\n`;
        
        mensagem += `🚜 *Da nossa roça para sua casa!*\n`;
        mensagem += `Agradecemos sua preferência por nossos produtos 100% naturais, onde o bem-estar das nossas galinhas é prioridade. Cada ovo carrega o sabor autêntico e a qualidade de quem cuida da origem!\n\n`;
        
        mensagem += `Qualquer dúvida, é só falar conosco! Este é o número de contato oficial.\n`;
        mensagem += `Tenha um dia abençoado! 🌿\n\n`;
        mensagem += `— Recanto Feliz`;
        
        // Abrir WhatsApp com mensagem
        const numeroWhatsApp = '5538999247376';
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        window.open(urlWhatsApp, '_blank');
        
        // Marcar como enviado via WhatsApp no banco
        await window.pedidosManager.marcarWhatsAppEnviado(resultadoPedido.id);
        
        // Limpa carrinho após registrar
        localStorage.removeItem('carrinho');
        // Mostrar mensagem de agradecimento personalizada
        mostrarMensagemAgradecimento(resultadoPedido.numero, dadosComplementares.nome);
        
        // Atualizar exibição do carrinho
        if (window.location.pathname.endsWith('carrinho.html')) {
            location.reload();
        }
        
    } catch (error) {
        console.error('❌ Erro ao processar pedido:', error);
        alert('❌ Erro ao processar pedido: ' + error.message + '\n\nTente novamente ou entre em contato conosco.');
    }
}

// Adiciona botão e evento para registrar pedido na página do carrinho
if (window.location.pathname.endsWith('carrinho.html')) {
    function exibirCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const container = document.getElementById('carrinho-itens');
        
        if (carrinho.length === 0) {
            container.innerHTML = '<p>Seu carrinho está vazio.</p>';
            return;
        }
        
        let total = 0;
        let html = '<div class="carrinho-lista">';
        
        carrinho.forEach(item => {
            const subtotal = item.preco * item.quantidade;
            total += subtotal;
            html += `
                <div class="item-carrinho" style="border:1px solid #ddd; padding:15px; margin:10px 0; border-radius:8px;">
                    <h4>${item.nome}</h4>
                    <p>Preço unitário: R$ ${item.preco.toFixed(2)}</p>
                    <p>Quantidade: ${item.quantidade}</p>
                    <p><strong>Subtotal: R$ ${subtotal.toFixed(2)}</strong></p>
                    <button onclick="removerDoCarrinho('${item.id}')" style="background:#f44336;color:white;padding:5px 10px;border:none;border-radius:4px;cursor:pointer;">Remover</button>
                </div>
            `;
        });
        
        html += `</div>
            <div class="total-carrinho" style="margin:20px 0; padding:15px; background:#f5f5f5; border-radius:8px;">
                <h3>Total: R$ ${total.toFixed(2)}</h3>
                <p>Itens: ${carrinho.length}</p>
            </div>`;
        
        container.innerHTML = html;
    }
    
    // Função para remover item do carrinho
    window.removerDoCarrinho = function(id) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho = carrinho.filter(item => item.id !== id);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        exibirCarrinho();
        updateCartCounter();
    };
    
    // Tornar funções globais
    window.removerItemCarrinho = removerItemCarrinho;
    window.finalizarPedido = finalizarPedido;
    window.updateCartModal = updateCartModal;
    
    window.addEventListener('DOMContentLoaded', function() {
        exibirCarrinho();
        const btn = document.createElement('button');
        btn.textContent = 'Enviar Pedido via WhatsApp';
        btn.style = 'margin:20px;padding:10px 20px;background:#25D366;color:#fff;font-size:18px;border:none;border-radius:8px;cursor:pointer;';
        btn.onclick = registrarPedido;
        document.getElementById('carrinho-itens').appendChild(btn);
    });
}

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    if (!slides.length) {
        console.log('Nenhum slide encontrado');
        return;
    }
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-play
    carouselInterval = setInterval(nextSlide, 5000);
    
    // Pausar auto-play ao passar o mouse
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Mostrar primeiro slide
    showSlide(0);
}

// Sistema de Produtos
async function initProducts() {
    // Garantir que está usando os mesmos dados do admin
    const products = window.dataManager ? await window.dataManager.getActiveProducts() : [];
    
    // Definir produtos globalmente para usar nos filtros
    produtos = products;
    
    // Tornar produtos disponível globalmente para o index.html
    window.produtos = produtos;
    
    console.log('🔍 Site principal carregando produtos:', products.length);
    console.log('📊 Primeiro produto:', products[0]);
    console.log('🌍 Produtos definidos globalmente:', window.produtos?.length);
    
    // Disparar evento de produtos carregados
    window.dispatchEvent(new CustomEvent('produtosCarregados', {
        detail: { produtos: products, count: products.length }
    }));
    
    const productGrid = document.getElementById('product-grid');
    
    if (!productGrid) return;
    
    console.log('Inicializando produtos:', products.length);
    
    // Remover sistema de filtros antigo (renderProducts) e usar apenas filterProducts do index.html
    // Renderizar todos os produtos inicialmente usando a função unificada
    if (window.filterProducts) {
        console.log('🔄 Usando filterProducts do index.html');
        window.filterProducts('all');
    } else {
        console.log('⚠️ filterProducts não encontrado, renderizando manualmente...');
        // Fallback: renderizar manualmente
        renderProductsManually(products, productGrid);
    }
    
    // Função de fallback para renderizar produtos manualmente
    function renderProductsManually(products, productGrid) {
        console.log('🔧 Renderização manual de produtos...');
        productGrid.innerHTML = products.map(product => `
            <div class="product-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl">
                <img src="${product.image}" alt="${product.name}" class="w-40 h-40 object-cover rounded-lg mb-4" onerror="this.src='imagens/produtos/default/placeholder.png'">
                <h3 class="text-xl font-bold mb-2 font-lora">${product.name}</h3>
                <p class="text-gray-600 mb-4 flex-grow">${product.slogan}</p>
                <span class="text-xl font-bold text-[#5D4037] mb-4">R$ ${product.price.toFixed(2)}</span>
                <button class="detail-btn bg-[#8B4513] hover:bg-[#5D4037] text-white font-bold py-2 px-4 rounded-lg transition w-full" data-id="${product.id}">Ver Detalhes</button>
            </div>
        `).join('');
    }
    
    // Ver detalhes do produto
    productGrid.addEventListener('click', function(e) {
        if (e.target.classList.contains('detail-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            openProductModal(productId);
        }
    });
    
    // Adicionar eventos do carrinho após renderizar produtos
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        setTimeout(() => {
            adicionarEventosCarrinho();
        }, 500);
    }
    
    // Debug: Verificar se os dados estão corretos
    console.log('🔍 Produtos renderizados no site:', products.map(p => ({ id: p.id, name: p.name, price: p.price })));
}

// Função para abrir modal de detalhes do produto
async function openProductModal(productId) {
    const products = window.dataManager ? await window.dataManager.getActiveProducts() : [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Produto não encontrado:', productId);
        return;
    }
    
    // Descobrir imagens do produto
    discoverProductImages(productId).then(gallery => {
        const productModal = document.getElementById('product-modal');
        const modalContent = productModal.querySelector('#modal-content-grid');
        
        // Criar conteúdo do modal
        modalContent.innerHTML = `
            <div class="p-6 relative">
                <div id="carousel-container" class="relative overflow-hidden rounded-lg">
                    <div id="carousel-track" class="flex transition-transform duration-300 ease-in-out">
                        ${gallery.map((imgSrc, index) => `
                            <div class="w-full flex-shrink-0">
                                <img src="${imgSrc}" alt="${product.name} - ${index + 1}" class="w-full h-80 object-cover">
                            </div>
                        `).join('')}
                    </div>
                    ${gallery.length > 1 ? `
                        <button id="prev-btn" class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button id="next-btn" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            ${gallery.map((_, index) => `
                                <div class="carousel-dot w-2 h-2 rounded-full bg-white/50 cursor-pointer hover:bg-white transition" data-index="${index}"></div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="p-6 flex flex-col">
                <h3 class="text-3xl font-bold mb-4 font-lora text-[#5D4037]">${product.name}</h3>
                ${product.partner ? `
                    <div class="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                        <h4 class="font-bold text-blue-700 mb-2 flex items-center">
                            <i class="fas fa-handshake mr-2"></i> Produzido por Parceiro
                        </h4>
                        <div class="text-sm text-blue-600">
                            <p><strong>Produtor:</strong> ${product.partner.producer}</p>
                            <p><strong>Local:</strong> ${product.partner.location}</p>
                            <p><strong>Sobre:</strong> ${product.partner.description}</p>
                        </div>
                    </div>
                ` : ''}
                <p class="text-gray-600 mb-6 leading-relaxed flex-grow">${product.description}</p>
                <span class="text-2xl font-bold text-[#5D4037] mb-6 block">R$ ${product.price.toFixed(2)}</span>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Quantidade:</label>
                    <div class="flex items-center space-x-3">
                        <button id="qty-minus" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input id="product-quantity" type="number" value="1" min="1" class="w-20 text-center border rounded py-2">
                        <button id="qty-plus" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button id="btn-add-carrinho" class="w-full bg-[#4CAF50] hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                    <i class="fas fa-cart-plus mr-2"></i> Adicionar ao Carrinho
                </button>
            </div>
        `;
        
        // Controles de quantidade
        const qtyInput = modalContent.querySelector('#product-quantity');
        const qtyMinus = modalContent.querySelector('#qty-minus');
        const qtyPlus = modalContent.querySelector('#qty-plus');
        const btnAdd = modalContent.querySelector('#btn-add-carrinho');
        
        if (qtyMinus) {
            qtyMinus.addEventListener('click', () => {
                const current = parseInt(qtyInput.value);
                if (current > 1) qtyInput.value = current - 1;
            });
        }
        
        if (qtyPlus) {
            qtyPlus.addEventListener('click', () => {
                const current = parseInt(qtyInput.value);
                qtyInput.value = current + 1;
            });
        }
        
        if (btnAdd) {
            btnAdd.addEventListener('click', function() {
                const quantidade = parseInt(qtyInput.value) || 1;
                const id = product.id || product.name.replace(/\s+/g, '-').toLowerCase();
                
                for (let i = 0; i < quantidade; i++) {
                    adicionarAoCarrinho({id, name: product.name, price: product.price});
                }
                
                productModal.classList.add('hidden');
                productModal.style.display = 'none';
            });
        }
        
        // Implementar carrossel de imagens
        let currentIndex = 0;
        const track = modalContent.querySelector('#carousel-track');
        const dots = modalContent.querySelectorAll('.carousel-dot');
        const prevBtn = modalContent.querySelector('#prev-btn');
        const nextBtn = modalContent.querySelector('#next-btn');
        
        function updateCarousel() {
            if (track) track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('bg-white', index === currentIndex);
                dot.classList.toggle('bg-white/50', index !== currentIndex);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = currentIndex === 0 ? gallery.length - 1 : currentIndex - 1;
                updateCarousel();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = currentIndex === gallery.length - 1 ? 0 : currentIndex + 1;
                updateCarousel();
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        updateCarousel();
        productModal.classList.remove('hidden');
        productModal.style.display = 'flex';
    });
}

// Função para descobrir imagens do produto
async function discoverProductImages(productId) {
    const gallery = [];
    const extensions = ['png', 'jpeg', 'jpg'];
    
    for (let i = 1; i <= 10; i++) {
        let foundImage = false;
        
        for (const ext of extensions) {
            const imagePath = `imagens/produtos/${productId}/${i}.${ext}`;
            
            try {
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        gallery.push(imagePath);
                        foundImage = true;
                        resolve();
                    };
                    img.onerror = () => reject();
                    img.src = imagePath;
                });
                break;
            } catch (error) {
                continue;
            }
        }
        
        if (!foundImage) break;
    }
    
    // Se não encontrar nenhuma imagem, usar placeholder
    if (gallery.length === 0) {
        gallery.push('imagens/placeholder.jpg');
    }
    
    return gallery;
}

// Modal de produto
const productModal = document.getElementById('product-modal');
if (productModal) {
    const closeBtn = productModal.querySelector('[data-modal-hide="product-modal"]');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            productModal.classList.add('hidden');
            productModal.style.display = 'none';
        });
    }
    
    // Fechar modal clicando fora
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.classList.add('hidden');
            productModal.style.display = 'none';
        }
    });
}

// Verificar se DataManager está disponível periodicamente
setInterval(() => {
    if (window.dataManager && document.getElementById('product-grid')) {
        initProducts();
    }
}, 1000);

// Função para mostrar notificação do carrinho
function showCartNotification(message) {
    const existing = document.querySelector('.cart-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: bold;
        animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
    
    if (!document.querySelector('#cart-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-notification-styles';
        style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Função para atualizar contador do carrinho
function updateCartCounter() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    const valorTotal = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    const counter = document.querySelector('#cart-count');
    const totalDisplay = document.querySelector('#cart-total-display');
    
    if (counter) {
        counter.textContent = totalItens;
        counter.style.display = totalItens > 0 ? 'flex' : 'none';
    }
    
    if (totalDisplay) {
        totalDisplay.textContent = `R$ ${valorTotal.toFixed(2)}`;
        totalDisplay.style.display = totalItens > 0 ? 'block' : 'none';
    }
    
    console.log(`🛒 Carrinho atualizado: ${totalItens} itens, R$ ${valorTotal.toFixed(2)}`);
}

// Função para atualizar modal do carrinho
function updateCartModal() {
    console.log('🛒 Atualizando modal do carrinho...');
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    console.log('📦 Itens no carrinho:', carrinho);
    
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems) {
        console.error('❌ Elemento cart-items não encontrado');
        return;
    }
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Seu carrinho está vazio.</p>';
        if (cartSubtotal) cartSubtotal.textContent = 'R$ 0,00';
        if (cartTotal) cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    let total = 0;
    let html = '';
    
    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        html += `
            <div class="flex justify-between items-center p-3 border-b">
                <div class="flex-1">
                    <h4 class="font-semibold">${item.nome}</h4>
                    <p class="text-sm text-gray-600">R$ ${item.preco.toFixed(2)} x ${item.quantidade}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="font-bold">R$ ${subtotal.toFixed(2)}</span>
                    <button onclick="removerItemCarrinho(${index})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    // Remover botão verde - será usado apenas o botão marrom do final
    
    cartItems.innerHTML = html;
    if (cartSubtotal) cartSubtotal.textContent = `R$ ${total.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    
    console.log(`✅ Modal atualizado: ${carrinho.length} itens, total R$ ${total.toFixed(2)}`);
}

// Tornar função global
window.updateCartModal = updateCartModal;

// Função para remover item do carrinho
function removerItemCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    updateCartCounter();
    updateCartModal();
}

// Função para finalizar pedido
function finalizarPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    // Fechar modal do carrinho
    document.getElementById('cart-modal').classList.add('hidden');
    
    // Chamar função de registro de pedido
    registrarPedido();
}

// Inicializar contador do carrinho ao carregar
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
});

console.log('📱 Scripts.js carregado - Sistema de carrinho e pedidos implementado!');

// Função para verificar frete
function verificarFrete() {
    const cep = document.getElementById('cep-frete').value.replace(/\D/g, '');
    const resultadoDiv = document.getElementById('frete-resultado');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const deliveryFeeSpan = document.getElementById('delivery-fee');
    const cartTotalSpan = document.getElementById('cart-total');
    
    if (cep.length !== 8) {
        resultadoDiv.innerHTML = '<p class="text-red-600 text-sm">Por favor, digite um CEP válido com 8 dígitos.</p>';
        resultadoDiv.style.display = 'block';
        return;
    }
    
    // Calcular total do carrinho
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const subtotal = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    // CEPs das áreas promocionais (Asa Sul, Lago Sul, Jardim Botânico)
    const cepsPromocionais = [
        '70000', '70001', '70002', '70003', '70004', '70005', // Asa Sul
        '71600', '71601', '71602', '71603', '71604', '71605', // Lago Sul  
        '71680', '71681', '71682', '71683', '71684', '71685'  // Jardim Botânico
    ];
    
    const cepArea = cep.substring(0, 5);
    const isAreaPromocional = cepsPromocionais.some(area => cepArea.startsWith(area.substring(0, 3)));
    
    let mensagem = '';
    let valorFrete = 0;
    
    if (isAreaPromocional && subtotal >= 50) {
        // Cenário 1: Frete Grátis (Promoção)
        mensagem = '<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"><strong>🎉 Ótima notícia! Você tem Frete Grátis!</strong><br><small>Área promocional + compra acima de R$ 50,00</small></div>';
        valorFrete = 0;
    } else if (subtotal >= 50) {
        // Cenário 2: Frete Grátis (Apenas pelo valor)
        mensagem = '<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"><strong>🚚 Seu frete é grátis!</strong><br><small>Promoção para compras acima de R$ 50,00</small></div>';
        valorFrete = 0;
    } else {
        // Cenário 3: Frete com Custo
        valorFrete = isAreaPromocional ? 8.00 : 12.00;
        mensagem = `<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded"><strong>📦 Entrega: R$ ${valorFrete.toFixed(2)}</strong><br><small>Frete grátis acima de R$ 50,00</small></div>`;
    }
    
    // Atualizar valores na tela
    deliveryFeeSpan.textContent = valorFrete === 0 ? 'Grátis' : `R$ ${valorFrete.toFixed(2)}`;
    const totalFinal = subtotal + valorFrete;
    cartTotalSpan.textContent = `R$ ${totalFinal.toFixed(2)}`;
    
    resultadoDiv.innerHTML = mensagem;
    resultadoDiv.style.display = 'block';
    
    // Habilitar botão finalizar
    btnFinalizar.disabled = false;
    btnFinalizar.className = 'w-full bg-[#25D366] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center cursor-pointer';
    
    // Salvar dados para finalização
    localStorage.setItem('dadosFrete', JSON.stringify({
        cep: cep,
        valorFrete: valorFrete,
        subtotal: subtotal,
        total: totalFinal
    }));
    
    // Salvar CEP para uso posterior
    localStorage.setItem('cepEntrega', cep);
}

// Função para finalizar via WhatsApp com dados pessoais
async function finalizarViaWhatsApp() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const dadosFrete = JSON.parse(localStorage.getItem('dadosFrete')) || {};
    
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    // Solicitar dados pessoais
    const dadosCliente = await solicitarDadosComplementares();
    if (!dadosCliente) {
        return; // Usuário cancelou
    }
    
    // Gerar número do pedido
    const numeroPedido = `RF${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Gerar mensagem completa para WhatsApp
    let mensagem = `🥚 • • • RECANTO FELIZ • • • 🐔\n\n`;
    mensagem += `Olá, ${dadosCliente.nome}! 😊\n`;
    mensagem += `Muito obrigado por escolher os produtos Recanto Feliz!\n\n`;
    mensagem += `Seu pedido foi confirmado e já está sendo preparado com todo carinho!\n\n`;
    
    mensagem += `🛒 *RESUMO DO PEDIDO*\n`;
    mensagem += `Pedido: ${numeroPedido}\n\n`;
    
    mensagem += `🍃 *ITENS:*\n`;
    carrinho.forEach(item => {
        mensagem += `*${item.nome}*\n`;
        mensagem += `R$ ${item.preco.toFixed(2)}\n`;
    });
    mensagem += `—————————————\n`;
    mensagem += `Total: *R$ ${(dadosFrete.total || dadosFrete.subtotal || 0).toFixed(2)}*\n\n`;
    
    mensagem += `📍 *ENTREGA*\n`;
    mensagem += `Seu pedido será entregue no endereço:\n`;
    mensagem += `${dadosCliente.endereco}\n\n`;
    
    mensagem += `🚜 *Da nossa roça para sua casa!*\n`;
    mensagem += `Agradecemos sua preferência por nossos produtos 100% naturais, onde o bem-estar das nossas galinhas é prioridade. Cada ovo carrega o sabor autêntico e a qualidade de quem cuida da origem!\n\n`;
    
    mensagem += `Qualquer dúvida, é só falar conosco! Este é o número de contato oficial.\n`;
    mensagem += `Tenha um dia abençoado! 🌿\n\n`;
    mensagem += `— Recanto Feliz`;
    
    // Abrir WhatsApp
    const numeroWhatsApp = '5538999247376';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
    
    // Salvar pedido no sistema se disponível
    if (window.pedidosManager && window.pedidosManager.isInitialized) {
        try {
            await window.pedidosManager.criarPedido(dadosCliente, carrinho);
            console.log('✅ Pedido salvo no sistema');
        } catch (error) {
            console.warn('⚠️ Erro ao salvar pedido:', error);
        }
    }
    
    // Limpar carrinho
    localStorage.removeItem('carrinho');
    localStorage.removeItem('dadosFrete');
    
    // Fechar modal e atualizar
    document.getElementById('cart-modal').classList.add('hidden');
    updateCartCounter();
    
    // Mostrar mensagem de agradecimento personalizada
    mostrarMensagemAgradecimento(numeroPedido, dadosCliente.nome);
}

// Máscara para CEP no carrinho
document.addEventListener('DOMContentLoaded', () => {
    const cepInput = document.getElementById('cep-frete');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }
});

// Função para mostrar mensagem de agradecimento personalizada
function mostrarMensagemAgradecimento(numeroPedido, nomeCliente) {
    // Obter mensagem personalizada do admin ou usar padrão
    const mensagemPersonalizada = localStorage.getItem('mensagemAgradecimento') || 
        `Olá, {nome}!\nSeu pedido {pedido} foi confirmado e já estamos preparando com carinho.\nMuito obrigado por escolher nossos produtos naturais.\nLogo, logo estará aí!\nRecanto Feliz`;
    
    const imagemAgradecimento = localStorage.getItem('imagemAgradecimento') || 'imagens/agradecimento pedido.png';
    
    // Substituir variáveis na mensagem
    const mensagemFinal = mensagemPersonalizada
        .replace(/{nome}/g, nomeCliente)
        .replace(/{pedido}/g, numeroPedido);
    
    // Criar modal de agradecimento
    const modalHTML = `
        <div id="modal-agradecimento" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); z-index: 2000; display: flex; 
            align-items: center; justify-content: center;
        ">
            <div style="
                background: white; padding: 30px; border-radius: 15px; 
                max-width: 500px; width: 90%; text-align: center;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            ">
                <img src="${imagemAgradecimento}" alt="Agradecimento" style="
                    max-width: 100%; height: auto; margin-bottom: 20px; border-radius: 10px;
                " onerror="this.style.display='none'">
                <div style="
                    font-size: 18px; line-height: 1.6; color: #333; 
                    white-space: pre-line; margin-bottom: 25px;
                ">${mensagemFinal}</div>
                <button onclick="fecharAgradecimento()" style="
                    background: #25D366; color: white; border: none; 
                    padding: 12px 30px; border-radius: 8px; font-size: 16px;
                    cursor: pointer; font-weight: bold;
                ">✅ Entendi</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Função para fechar modal de agradecimento
function fecharAgradecimento() {
    const modal = document.getElementById('modal-agradecimento');
    if (modal) modal.remove();
}

// Tornar funções globais
window.registrarPedido = registrarPedido;
window.finalizarPedido = finalizarPedido;
window.finalizarViaWhatsApp = finalizarViaWhatsApp;
window.removerItemCarrinho = removerItemCarrinho;
window.verificarFrete = verificarFrete;
window.mostrarMensagemAgradecimento = mostrarMensagemAgradecimento;
window.fecharAgradecimento = fecharAgradecimento;
