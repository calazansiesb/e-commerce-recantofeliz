// js/validator.js
class Validator {
    static validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
        
        // Validação do primeiro dígito
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf[i]) * (10 - i);
        }
        let digit1 = 11 - (sum % 11);
        if (digit1 > 9) digit1 = 0;
        
        // Validação do segundo dígito
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf[i]) * (11 - i);
        }
        let digit2 = 11 - (sum % 11);
        if (digit2 > 9) digit2 = 0;
        
        return cpf[9] == digit1 && cpf[10] == digit2;
    }
    
    static validatePhone(phone) {
        const cleaned = String(phone).replace(/\D/g, ''); // Ensure phone is a string
        return /^(\d{2})(\d{4,5})(\d{4})$/.test(cleaned);
    }
    
    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    static validateRequired(value, fieldName) {
        if (!value || !String(value).trim()) { // Ensure value is a string
            throw new Error(`${fieldName} é obrigatório`);
        }
        return true;
    }
    
    static validateMinLength(value, minLength, fieldName) {
        if (String(value).length < minLength) { // Ensure value is a string
            throw new Error(`${fieldName} deve ter pelo menos ${minLength} caracteres`);
        }
        return true;
    }
    
    static validateForm(formData, rules) {
        const errors = [];
        
        for (let [field, fieldRules] of Object.entries(rules)) {
            const value = formData[field];
            
            try {
                for (let rule of fieldRules) {
                    switch (rule.type) {
                        case 'required':
                            this.validateRequired(value, rule.message || field);
                            break;
                        case 'minLength':
                            this.validateMinLength(value, rule.value, rule.message || field);
                            break;
                        case 'cpf':
                            if (value && !this.validateCPF(value)) { throw new Error(rule.message || 'CPF inválido'); } break;
                        case 'phone':
                            if (value && !this.validatePhone(value)) { throw new Error(rule.message || 'Telefone inválido'); } break;
                        case 'email':
                            if (value && !this.validateEmail(value)) { throw new Error(rule.message || 'Email inválido'); } break;
                    }
                }
            } catch (error) {
                errors.push({ field, message: error.message });
            }
        }
        
        return { isValid: errors.length === 0, errors };
    }
}