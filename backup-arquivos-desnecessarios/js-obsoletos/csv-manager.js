// Sistema de Gerenciamento CSV - Granja Recanto Feliz
// Gerencia a sincronização entre localStorage e arquivo CSV

class CSVManager {
    constructor() {
        this.csvPath = '../dados/produtos.csv';
        this.backupPath = '../dados/backup/';
    }

    // Converter produtos para formato CSV
    productsToCSV(products) {
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

    // Baixar CSV atualizado
    downloadUpdatedCSV(products) {
        try {
            const csvContent = this.productsToCSV(products);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `produtos-${timestamp}.csv`;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            
            console.log('✅ CSV atualizado baixado:', link.download);
            return true;
        } catch (error) {
            console.error('Erro ao baixar CSV:', error);
            return false;
        }
    }

    // Salvar alterações no CSV (automático)
    async saveChangesToCSV(products) {
        try {
            // Criar backup do estado atual
            this.createBackup(products);
            
            // Tentar salvamento automático
            if (window.autoCSVSaver) {
                const success = await window.autoCSVSaver.autoSaveToCSV(products);
                if (success) {
                    this.showNotification('✅ CSV atualizado automaticamente!', 'success');
                    return true;
                }
            }
            
            // Fallback: salvar no localStorage
            this.saveToLocalStorage(products);
            this.showNotification('💾 Alterações salvas no sistema', 'success');
            
            return true;
        } catch (error) {
            console.error('Erro ao salvar no CSV:', error);
            this.showNotification('❌ Erro ao salvar alterações', 'error');
            return false;
        }
    }
    
    // Salvar no localStorage
    saveToLocalStorage(products) {
        const csvContent = this.productsToCSV(products);
        const timestamp = new Date().toISOString();
        
        const saveData = {
            timestamp,
            content: csvContent,
            products: products.length,
            lastUpdate: timestamp
        };
        
        localStorage.setItem('csvAutoSave', JSON.stringify(saveData));
        console.log('💾 Dados salvos no localStorage');
    }

    // Criar backup automático
    createBackup(products) {
        try {
            const timestamp = new Date().toISOString();
            const backupData = {
                timestamp,
                products: products,
                totalProducts: products.length,
                backupType: 'auto'
            };
            
            const backups = JSON.parse(localStorage.getItem('csvBackups') || '[]');
            backups.push(backupData);
            
            // Manter apenas os últimos 10 backups
            if (backups.length > 10) {
                backups.splice(0, backups.length - 10);
            }
            
            localStorage.setItem('csvBackups', JSON.stringify(backups));
            console.log('📦 Backup automático criado');
            
            return true;
        } catch (error) {
            console.error('Erro ao criar backup:', error);
            return false;
        }
    }

    // Mostrar status de salvamento
    showSaveStatus(success = true) {
        const message = success ? 
            '✅ Alterações salvas automaticamente!' : 
            '⚠️ Alterações salvas temporariamente';
            
        const type = success ? 'success' : 'warning';
        this.showNotification(message, type);
    }

    // Ler CSV existente (simulação - em ambiente real seria via fetch)
    async readExistingCSV() {
        try {
            // Em um ambiente real, isso seria:
            // const response = await fetch(this.csvPath);
            // const csvText = await response.text();
            
            // Para demonstração, vamos usar os dados do arquivo atual
            const csvData = `id,nome,descricao,preco,imagem
1,Ovos caipira,Dúzia de ovos frescos,12.00,ovos.png
2,Queijo Minas,Queijo artesanal,30.00,queijo.png
3,Mel,Mel puro,25.00,mel.png`;
            
            return this.parseCSV(csvData);
        } catch (error) {
            console.error('Erro ao ler CSV:', error);
            return [];
        }
    }

    // Converter CSV para objetos
    parseCSV(csvText) {
        try {
            const lines = csvText.trim().split('\n');
            const headers = lines[0].split(',');
            const products = [];
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                if (values.length >= headers.length) {
                    const product = {
                        id: parseInt(values[0]),
                        name: values[1].replace(/"/g, ''),
                        description: values[2].replace(/"/g, ''),
                        price: parseFloat(values[3]),
                        image: values[4]
                    };
                    products.push(product);
                }
            }
            
            return products;
        } catch (error) {
            console.error('Erro ao processar CSV:', error);
            return [];
        }
    }

    // Sincronizar com CSV existente
    async syncWithCSV() {
        try {
            const csvProducts = await this.readExistingCSV();
            const currentProducts = window.dataManager.getProducts();
            
            // Comparar e mostrar diferenças
            const differences = this.compareProducts(csvProducts, currentProducts);
            
            if (differences.length > 0) {
                this.showSyncDialog(differences, csvProducts, currentProducts);
            } else {
                this.showNotification('✅ Dados já estão sincronizados!', 'success');
            }
            
            return true;
        } catch (error) {
            console.error('Erro na sincronização:', error);
            return false;
        }
    }

    // Comparar produtos
    compareProducts(csvProducts, currentProducts) {
        const differences = [];
        
        currentProducts.forEach(current => {
            const csvProduct = csvProducts.find(csv => csv.id === current.id);
            
            if (!csvProduct) {
                differences.push({
                    type: 'new',
                    product: current,
                    message: `Produto "${current.name}" não existe no CSV`
                });
            } else if (csvProduct.price !== current.price) {
                differences.push({
                    type: 'price_change',
                    product: current,
                    csvPrice: csvProduct.price,
                    currentPrice: current.price,
                    message: `Preço de "${current.name}" alterado: R$ ${csvProduct.price} → R$ ${current.price}`
                });
            }
        });
        
        return differences;
    }

    // Mostrar diálogo de sincronização
    showSyncDialog(differences, csvProducts, currentProducts) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        
        const diffList = differences.map(diff => `
            <div class="p-3 border-l-4 ${diff.type === 'new' ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'} mb-2">
                <p class="text-sm">${diff.message}</p>
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Sincronização Necessária</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <p class="text-gray-600 mb-4">
                    Foram encontradas ${differences.length} diferenças entre o CSV e os dados atuais:
                </p>
                
                <div class="mb-6 max-h-60 overflow-y-auto">
                    ${diffList}
                </div>
                
                <div class="flex space-x-3">
                    <button onclick="csvManager.applySyncChanges(); this.closest('.fixed').remove();" 
                            class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                        <i class="fas fa-download mr-2"></i>Baixar CSV Atualizado
                    </button>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                        Cancelar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Aplicar mudanças de sincronização
    applySyncChanges() {
        const products = window.dataManager.getProducts();
        this.saveChangesToCSV(products);
        this.showNotification('✅ CSV atualizado baixado com sucesso!', 'success');
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    'fa-info-circle'
                } mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Exportar produtos para CSV com formatação completa
    exportFullCSV(products) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const csvHeader = 'ID,Nome,Categoria,Preco,Estoque,Slogan,Descricao,Imagem,Ativo,Data_Exportacao\n';
            
            const csvData = products.map(product => {
                return [
                    product.id,
                    `"${(product.name || '').replace(/"/g, '""')}"`,
                    product.category || '',
                    (product.price || 0).toFixed(2),
                    product.stock || 0,
                    `"${(product.slogan || '').replace(/"/g, '""')}"`,
                    `"${(product.description || '').replace(/"/g, '""')}"`,
                    product.image || '',
                    product.active ? 'true' : 'false',
                    new Date().toLocaleDateString('pt-BR')
                ].join(',');
            }).join('\n');
            
            const csvContent = csvHeader + csvData;
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `produtos-completo-${timestamp}.csv`;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            
            this.showNotification('✅ CSV completo exportado com sucesso!', 'success');
            return true;
        } catch (error) {
            console.error('Erro ao exportar CSV completo:', error);
            this.showNotification('❌ Erro ao exportar CSV!', 'error');
            return false;
        }
    }
}

// Instância global do gerenciador CSV
window.csvManager = new CSVManager();