// Carrossel com textos reposicionados
function melhorarCarrossel() {
    const slides = document.querySelectorAll('.carousel-slide');
    
    slides.forEach((slide, index) => {
        const textContainer = slide.querySelector('div > div');
        if (!textContainer) return;
        
        // Reduzir opacidade do overlay
        slide.style.backgroundImage = slide.style.backgroundImage.replace('rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)');
        
        // Reposicionar textos
        const parentDiv = textContainer.parentElement;
        parentDiv.className = 'flex items-end justify-start h-full text-white px-6 pb-20';
        
        // Adicionar fundo semi-transparente ao texto
        textContainer.className = 'max-w-2xl bg-black/40 backdrop-blur-sm p-6 rounded-lg';
        
        // Ajustar tamanhos dos títulos
        const title = textContainer.querySelector('h1');
        if (title) {
            title.className = 'text-3xl md:text-5xl font-bold font-lora mb-4 animate-fade-in';
        }
        
        // Ajustar tamanhos dos parágrafos
        const paragraph = textContainer.querySelector('p');
        if (paragraph) {
            paragraph.className = 'text-lg md:text-xl mb-6 animate-slide-up';
        }
        
        // Ajustar botões
        const button = textContainer.querySelector('a');
        if (button) {
            button.className = button.className.replace('py-4 px-8', 'py-3 px-6');
        }
        
        // Alternar posicionamento
        if (index % 2 === 1) {
            parentDiv.className = 'flex items-end justify-end h-full text-white px-6 pb-20';
            textContainer.className = 'max-w-2xl bg-black/40 backdrop-blur-sm p-6 rounded-lg text-right';
        }
    });
    
    console.log('✅ Carrossel melhorado com textos reposicionados');
}

// Executar após carregamento
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(melhorarCarrossel, 500);
});