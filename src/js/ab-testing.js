// js/ab-testing.js
class ABTestManager {
    constructor() {
        this.tests = new Map();
        this.userTests = JSON.parse(localStorage.getItem('ab_tests') || '{}');
    }
    
    createTest(testName, variants, trafficSplit = 0.5) {
        this.tests.set(testName, {
            variants,
            trafficSplit,
            active: true
        });
    }
    
    getVariant(testName) {
        if (this.userTests[testName]) {
            return this.userTests[testName];
        }
        
        const test = this.tests.get(testName);
        if (!test || !test.active) {
            return 'control'; // Default to control if test not active or defined
        }
        
        const variant = Math.random() < test.trafficSplit ? 
            test.variants[1] : test.variants[0];
        
        this.userTests[testName] = variant;
        localStorage.setItem('ab_tests', JSON.stringify(this.userTests));
        
        // Track assignment
        this.trackEvent('ab_test_assignment', {
            test: testName,
            variant: variant
        });
        
        return variant;
    }
    
    trackConversion(testName, conversionType = 'purchase') {
        const variant = this.userTests[testName];
        if (!variant) return;
        
        this.trackEvent('ab_test_conversion', {
            test: testName,
            variant: variant,
            conversion: conversionType
        });
    }
    
    trackEvent(eventName, data) {
        const event = {
            event: eventName,
            timestamp: Date.now(),
            url: window.location.href,
            ...data
        };
        
        // Enviar para analytics (placeholder)
        console.log('AB Test Event:', event);
        
        // Salvar localmente para análise (placeholder)
        const events = JSON.parse(localStorage.getItem('ab_events') || '[]');
        events.push(event);
        localStorage.setItem('ab_events', JSON.stringify(events.slice(-1000)));
    }
}