// Cliente DynamoDB para Granja Recanto Feliz
class DynamoDBClient {
    constructor() {
        this.tableName = 'GranjaRecantoFeliz-Produtos';
        this.region = 'sa-east-1';
        this.apiUrl = 'https://api.granjarecantofeliz.com'; // API Gateway endpoint
    }

    // Listar todos os produtos
    async listarProdutos() {
        try {
            const response = await fetch(`${this.apiUrl}/produtos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.produtos || [];
            }
            throw new Error('Erro ao carregar produtos');
        } catch (error) {
            console.error('❌ Erro DynamoDB:', error);
            // Fallback para JSON local
            return this.fallbackJSON();
        }
    }

    // Adicionar produto
    async adicionarProduto(produto) {
        try {
            const response = await fetch(`${this.apiUrl}/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
            
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Erro ao adicionar produto');
        } catch (error) {
            console.error('❌ Erro ao adicionar:', error);
            throw error;
        }
    }

    // Atualizar produto
    async atualizarProduto(id, produto) {
        try {
            const response = await fetch(`${this.apiUrl}/produtos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
            
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Erro ao atualizar produto');
        } catch (error) {
            console.error('❌ Erro ao atualizar:', error);
            throw error;
        }
    }

    // Excluir produto
    async excluirProduto(id) {
        try {
            const response = await fetch(`${this.apiUrl}/produtos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                return true;
            }
            throw new Error('Erro ao excluir produto');
        } catch (error) {
            console.error('❌ Erro ao excluir:', error);
            throw error;
        }
    }

    // Fallback para JSON local
    async fallbackJSON() {
        try {
            const response = await fetch('dados/produtos.json');
            if (response.ok) {
                const data = await response.json();
                return data.products || [];
            }
        } catch (error) {
            console.error('❌ Fallback JSON falhou:', error);
        }
        return [];
    }
}

// Instância global
window.dynamoClient = new DynamoDBClient();