// js/carousel-optimized.js
class OptimizedCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Carousel container with ID '${containerId}' not found.`);
            return;
        }
        this.track = this.container.querySelector('.carousel-track');
        this.slides = Array.from(this.track.children);
        this.currentSlide = 0;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        this.preloadedImages = new Set();
        
        this.init();
    }
    
    init() {
        this.preloadCurrentAndNext();
        this.setupIntersectionObserver();
        this.startAutoPlay();
        // Expose to global for mobile optimizations if needed
        window.carousel = this; 
    }
    
    preloadImage(index) {
        if (index < 0 || index >= this.slides.length || this.preloadedImages.has(index)) return;
        
        const slide = this.slides[index];
        const imgSrc = slide.dataset.src;
        if (!imgSrc) return;

        const img = new Image();
        img.onload = () => {
            slide.style.backgroundImage = `url(${imgSrc})`;
            slide.classList.add('loaded');
            this.preloadedImages.add(index);
        };
        img.src = imgSrc;
    }
    
    preloadCurrentAndNext() {
        this.preloadImage(this.currentSlide);
        this.preloadImage((this.currentSlide + 1) % this.slides.length);
    }
    
    transition(direction) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        const nextSlide = direction === 'next' 
            ? (this.currentSlide + 1) % this.slides.length
            : (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        
        this.track.style.transform = `translateX(-${nextSlide * 100}%)`;
        
        setTimeout(() => {
            this.currentSlide = nextSlide;
            this.preloadCurrentAndNext();
            this.isTransitioning = false;
        }, 300); // Match CSS transition duration
    }
    
    startAutoPlay() {
        this.stopAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => {
            this.transition('next');
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startAutoPlay();
                } else {
                    this.stopAutoPlay();
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of carousel is visible
        observer.observe(this.container);
    }
}