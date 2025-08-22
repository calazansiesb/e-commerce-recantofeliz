// js/checkout-manager.js
class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.checkoutData = {};
    }
    
    initCheckout() {
        this.renderStepIndicator();
        this.showStep(1);
    }
    
    renderStepIndicator() {
        const indicator = document.getElementById('checkout-steps');
        if (!indicator) return; // Ensure element exists

        indicator.innerHTML = `
            <div class="flex justify-between mb-8">
                ${Array.from({length: this.totalSteps}, (_, i) => {
                    const stepNum = i + 1;
                    const isActive = stepNum === this.currentStep;
                    const isCompleted = stepNum < this.currentStep;
                    
                    return `
                        <div class="flex items-center ${i < this.totalSteps - 1 ? 'flex-1' : ''}">
                            <div class="flex items-center justify-center w-10 h-10 rounded-full ${
                                isCompleted ? 'bg-green-500 text-white' :
                                isActive ? 'bg-blue-500 text-white' :
                                'bg-gray-300 text-gray-600'
                            }">
                                ${isCompleted ? '<i class="fas fa-check"></i>' : stepNum}
                            </div>
                            <span class="ml-2 text-sm font-medium">
                                ${this.getStepName(stepNum)}
                            </span>
                            ${i < this.totalSteps - 1 ? '<div class="flex-1 h-1 bg-gray-300 mx-4"></div>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    getStepName(step) {
        const names = ['Carrinho', 'Dados', 'Confirmação'];
        return names[step - 1];
    }
    
    showStep(step) {
        document.querySelectorAll('.checkout-step').forEach(el => el.classList.add('hidden'));
        const stepElement = document.getElementById(`step-${step}`);
        if (stepElement) {
            stepElement.classList.remove('hidden');
        }
        this.currentStep = step;
        this.renderStepIndicator();
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.showStep(this.currentStep + 1);
            } else {
                this.finalizeOrder();
            }
        }
    }
    
    validateCurrentStep() {
        // Placeholder for validation logic
        // This would typically involve calling Validator.validateForm
        // For now, just return true to allow progression
        return true; 
    }
    // Placeholder for finalizeOrder, validateCart, validateCustomerData
    finalizeOrder() { console.log("Order finalized!"); }
    validateCart() { console.log("Cart validated!"); return true; }
    validateCustomerData() { console.log("Customer data validated!"); return true; }
}