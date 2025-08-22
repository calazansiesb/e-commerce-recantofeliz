// js/analytics-manager.js
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.startTime = Date.now();
        
        this.initTracking();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getUserId() {
        let userId = localStorage.getItem('user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('user_id', userId);
        }
        return userId;
    }
    
    initTracking() {
        // Page view
        this.track('page_view', {
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer
        });
        
        // Scroll tracking
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.track('scroll_depth', { depth: maxScroll });
                }
            }
        });
        
        // Click tracking
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[data-track]');
            if (element) {
                this.track('click', {
                    element: element.dataset.track,
                    text: element.textContent.trim(),
                    href: element.href || null
                });
            }
        });
        
        // Form tracking
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                this.track('form_submit', {
                    form: form.id || form.className,
                    action: form.action
                });
            }
        });
        
        // Time on page
        window.addEventListener('beforeunload', () => {
            this.track('time_on_page', {
                duration: Date.now() - this.startTime,
                page: window.location.pathname
            });
        });
    }
    
    track(eventName, properties = {}) {
        const event = {
            event: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                session_id: this.sessionId,
                user_id: this.userId,
                url: window.location.href,
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`,
                viewport_size: `${window.innerWidth}x${window.innerHeight}`
            }
        };
        
        this.events.push(event);
        
        // Salvar eventos localmente
        this.saveEvents();
        
        // Enviar para servidor (implementar conforme necessário)
        this.sendToServer(event);
        
        console.log('Analytics Event:', event);
    }
    
    saveEvents() {
        const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        stored.push(...this.events);
        
        // Manter apenas os últimos 1000 eventos
        const recent = stored.slice(-1000);
        localStorage.setItem('analytics_events', JSON.stringify(recent));
        
        this.events = [];
    }
    
    sendToServer(event) {
        // Implementar envio para Google Analytics, Mixpanel, etc.
        // fetch('/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(event)
        // });
    }
    
    // Métodos específicos para e-commerce (placeholders)
    trackProductView(product) { this.track('product_view', { product_id: product.id, product_name: product.name }); }
    trackAddToCart(product, quantity = 1) { this.track('add_to_cart', { product_id: product.id, quantity: quantity }); }
    trackPurchase(orderData) { this.track('purchase', { order_id: orderData.id, value: orderData.total }); }
    trackSearch(query, results) { this.track('search', { query: query, results_count: results.length }); }
}