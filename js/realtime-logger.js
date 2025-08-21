// Monitor de Logs em Tempo Real para VS Code Terminal
// Este script captura todas as interações e envia para o servidor

class RealTimeLogger {
    constructor() {
        this.logEndpoint = '/log';
        this.sessionId = 'session_' + Date.now();
        this.logQueue = [];
        this.isConnected = false;
        
        this.init();
    }
    
    init() {
        this.interceptConsole();
        this.interceptLocalStorage();
        this.interceptEvents();
        this.startHeartbeat();
        
        this.log('🚀 Monitor de logs iniciado', 'SYSTEM');
    }
    
    // Interceptar todas as funções console
    interceptConsole() {
        const originalMethods = {};
        ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
            originalMethods[method] = console[method];
            console[method] = (...args) => {
                const message = args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                
                this.sendLog(message, method.toUpperCase());
                originalMethods[method].apply(console, args);
            };
        });
    }
    
    // Interceptar localStorage
    interceptLocalStorage() {
        const originalSetItem = localStorage.setItem;
        const originalRemoveItem = localStorage.removeItem;
        const originalClear = localStorage.clear;
        
        localStorage.setItem = (key, value) => {
            if (key.includes('granja') || key.includes('Recanto') || key.includes('produtos')) {
                try {
                    const parsedValue = JSON.parse(value);
                    if (parsedValue.products) {
                        this.sendLog(`📦 localStorage.setItem('${key}') - ${parsedValue.products.length} produtos`, 'STORAGE');
                        this.sendLog(`💰 Primeiro produto: ${parsedValue.products[0]?.name} - R$ ${parsedValue.products[0]?.price}`, 'STORAGE');
                    }
                } catch (e) {
                    this.sendLog(`📦 localStorage.setItem('${key}') - ${value.length} chars`, 'STORAGE');
                }
            }
            return originalSetItem.call(localStorage, key, value);
        };
        
        localStorage.removeItem = (key) => {
            if (key.includes('granja') || key.includes('Recanto') || key.includes('produtos')) {
                this.sendLog(`🗑️ localStorage.removeItem('${key}')`, 'STORAGE');
            }
            return originalRemoveItem.call(localStorage, key);
        };
        
        localStorage.clear = () => {
            this.sendLog('💥 localStorage.clear() - TODOS OS DADOS LIMPOS!', 'STORAGE');
            return originalClear.call(localStorage);
        };
    }
    
    // Interceptar eventos importantes
    interceptEvents() {
        // Formulários
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'product-form') {
                const formData = new FormData(e.target);
                const productName = formData.get('name') || 'N/A';
                const productPrice = formData.get('price') || 'N/A';
                this.sendLog(`📝 FORMULÁRIO SUBMETIDO: ${productName} - R$ ${productPrice}`, 'FORM');
            }
        });
        
        // Cliques em botões importantes
        document.addEventListener('click', (e) => {
            if (e.target.textContent.includes('Salvar') || 
                e.target.textContent.includes('Atualizar') ||
                e.target.textContent.includes('Editar')) {
                this.sendLog(`🖱️ CLIQUE: ${e.target.textContent} (${e.target.tagName})`, 'CLICK');
            }
        });
        
        // Mudanças no localStorage (via storage event)
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.includes('granja')) {
                this.sendLog(`🔄 STORAGE EVENT: ${e.key} alterado`, 'STORAGE_EVENT');
            }
        });
        
        // Eventos customizados
        window.addEventListener('productsUpdated', (e) => {
            this.sendLog(`📡 EVENTO CUSTOMIZADO: productsUpdated - ${JSON.stringify(e.detail)}`, 'CUSTOM_EVENT');
        });
        
        // Antes de descarregar a página
        window.addEventListener('beforeunload', () => {
            this.sendLog('🚪 PÁGINA DESCARREGANDO', 'SYSTEM');
        });
    }
    
    sendLog(message, type = 'INFO') {
        const logEntry = {
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            type: type,
            message: message,
            url: window.location.href,
            userAgent: navigator.userAgent.substr(0, 50)
        };
        
        // Tentar enviar via fetch
        fetch('/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logEntry)
        }).catch(() => {
            // Se falhar, tentar via WebSocket ou console
            this.fallbackLog(logEntry);
        });
    }
    
    fallbackLog(logEntry) {
        // Salvar em sessionStorage como fallback
        const logs = JSON.parse(sessionStorage.getItem('realtime_logs') || '[]');
        logs.push(logEntry);
        if (logs.length > 100) logs.shift(); // Manter só os últimos 100
        sessionStorage.setItem('realtime_logs', JSON.stringify(logs));
    }
    
    log(message, type) {
        this.sendLog(message, type);
    }
    
    startHeartbeat() {
        setInterval(() => {
            // Verificar estado dos dados a cada 5 segundos
            const storageData = localStorage.getItem('granjaRecantoFelizData');
            if (storageData) {
                try {
                    const parsed = JSON.parse(storageData);
                    this.sendLog(`💓 HEARTBEAT: ${parsed.products?.length || 0} produtos em storage`, 'HEARTBEAT');
                } catch (e) {
                    this.sendLog(`💓 HEARTBEAT: Erro ao ler storage - ${e.message}`, 'HEARTBEAT');
                }
            } else {
                this.sendLog('💓 HEARTBEAT: localStorage vazio!', 'HEARTBEAT');
            }
        }, 5000);
    }
}

// Inicializar o monitor assim que possível
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.realTimeLogger = new RealTimeLogger();
    });
} else {
    window.realTimeLogger = new RealTimeLogger();
}

// Função global para logs manuais
window.logToTerminal = function(message, type = 'MANUAL') {
    if (window.realTimeLogger) {
        window.realTimeLogger.log(message, type);
    }
};

console.log('🔍 Real-Time Logger carregado e pronto!');
