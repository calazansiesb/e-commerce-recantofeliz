// Sistema de Salvamento Automático no CSV
class AutoCSVSaver {
    constructor() {
        this.csvPath = '../dados/produtos.csv';
    }

    // Salvar automaticamente no CSV sem download
    async autoSaveToCSV(products) {
        try {
            const csvContent = this.generateCSV(products);
            
            // Tentar salvar usando File System Access API (navegadores modernos)
            if ('showSaveFilePicker' in window) {
                await this.saveWithFileSystemAPI(csvContent);
            } else {
                // Fallback: atualizar CSV existente via fetch (se servidor suportar)
                await this.updateCSVFile(csvContent);
            }
            
            console.log('✅ CSV salvo automaticamente');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar CSV:', error);
            return false;
        }
    }

    // Gerar conteúdo CSV
    generateCSV(products) {
        const header = 'id,nome,descricao,preco,imagem\n';
        const rows = products.map(product => {
            return [
                product.id,
                `"${(product.name || '').replace(/"/g, '""')}"`,
                `"${(product.description || '').replace(/"/g, '""')}"`,
                (product.price || 0).toFixed(2),
                product.image || ''
            ].join(',');
        }).join('\n');
        
        return header + rows;
    }

    // Salvar usando File System Access API
    async saveWithFileSystemAPI(csvContent) {
        try {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: 'produtos.csv',
                types: [{
                    description: 'CSV files',
                    accept: { 'text/csv': ['.csv'] }
                }]
            });
            
            const writable = await fileHandle.createWritable();
            await writable.write(csvContent);
            await writable.close();
            
            return true;
        } catch (error) {
            throw new Error('Erro ao salvar com File System API: ' + error.message);
        }
    }

    // Atualizar arquivo CSV via servidor (requer backend)
    async updateCSVFile(csvContent) {
        try {
            const response = await fetch('/api/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: csvContent,
                    filename: 'produtos.csv'
                })
            });
            
            if (!response.ok) {
                throw new Error('Servidor não suporta atualização de CSV');
            }
            
            return true;
        } catch (error) {
            // Se não conseguir via servidor, usar localStorage como backup
            this.saveToLocalStorage(csvContent);
            throw new Error('Salvamento via servidor falhou, usando localStorage');
        }
    }

    // Salvar no localStorage como backup
    saveToLocalStorage(csvContent) {
        const timestamp = new Date().toISOString();
        const backup = {
            timestamp,
            content: csvContent,
            filename: 'produtos.csv'
        };
        
        localStorage.setItem('csvAutoSave', JSON.stringify(backup));
        console.log('💾 CSV salvo no localStorage como backup');
    }

    // Recuperar último CSV salvo
    getLastSavedCSV() {
        try {
            const backup = localStorage.getItem('csvAutoSave');
            return backup ? JSON.parse(backup) : null;
        } catch (error) {
            console.error('Erro ao recuperar CSV:', error);
            return null;
        }
    }
}

// Instância global
window.autoCSVSaver = new AutoCSVSaver();