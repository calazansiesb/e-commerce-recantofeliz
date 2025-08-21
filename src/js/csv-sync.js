// Sistema de Sincronização Automática com CSV
class CSVSync {
    constructor() {
        this.csvPath = '../dados/produtos.csv';
        this.syncInterval = null;
    }

    // Iniciar sincronização automática
    startAutoSync() {
        // Sincronizar a cada 30 segundos
        this.syncInterval = setInterval(() => {
            this.syncWithCSV();
        }, 30000);
        
        console.log('🔄 Sincronização automática iniciada');
    }

    // Parar sincronização
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
            console.log('⏹️ Sincronização automática parada');
        }
    }

    // Sincronizar dados com CSV
    async syncWithCSV() {
        try {
            // Obter dados atuais do localStorage
            const currentData = window.dataManager.getProducts();
            
            // Verificar se há dados salvos para sincronizar
            const savedCSV = localStorage.getItem('csvAutoSave');
            if (savedCSV) {
                const csvData = JSON.parse(savedCSV);
                
                // Atualizar arquivo CSV automaticamente
                await this.updateCSVFile(csvData.content);
                
                console.log('✅ CSV sincronizado automaticamente');
                
                // Limpar dados temporários após sincronização
                localStorage.removeItem('csvAutoSave');
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            return false;
        }
    }

    // Atualizar arquivo CSV diretamente
    async updateCSVFile(csvContent) {
        try {
            // Método 1: Tentar usar File System Access API
            if ('showDirectoryPicker' in window) {
                await this.saveWithDirectoryPicker(csvContent);
                return true;
            }
            
            // Método 2: Criar link de download automático
            this.createAutoDownload(csvContent);
            return true;
            
        } catch (error) {
            console.error('Erro ao atualizar CSV:', error);
            throw error;
        }
    }

    // Salvar usando Directory Picker
    async saveWithDirectoryPicker(csvContent) {
        try {
            const dirHandle = await window.showDirectoryPicker();
            const fileHandle = await dirHandle.getFileHandle('produtos.csv', { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(csvContent);
            await writable.close();
            
            console.log('📁 CSV salvo via Directory Picker');
        } catch (error) {
            throw new Error('Directory Picker falhou: ' + error.message);
        }
    }

    // Criar download automático silencioso
    createAutoDownload(csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'produtos.csv';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        console.log('💾 CSV baixado automaticamente');
    }

    // Verificar se precisa sincronizar
    needsSync() {
        const savedCSV = localStorage.getItem('csvAutoSave');
        return savedCSV !== null;
    }

    // Forçar sincronização manual
    async forcSync() {
        try {
            const success = await this.syncWithCSV();
            if (success) {
                this.showNotification('✅ Sincronização concluída!', 'success');
            } else {
                this.showNotification('ℹ️ Nada para sincronizar', 'info');
            }
        } catch (error) {
            this.showNotification('❌ Erro na sincronização', 'error');
        }
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Criar notificação visual se estiver na página admin
        if (window.showNotification) {
            window.showNotification(message, type);
        }
    }
}

// Instância global
window.csvSync = new CSVSync();

// Iniciar sincronização quando carregar
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(() => {
        if (window.csvSync && window.location.pathname.includes('admin')) {
            window.csvSync.startAutoSync();
        }
    }, 2000);
});