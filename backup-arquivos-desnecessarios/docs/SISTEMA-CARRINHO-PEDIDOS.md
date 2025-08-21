# Sistema de Carrinho e Pedidos - Recanto Feliz

## 📋 Funcionalidades Implementadas

### 1. Adicionar Produtos ao Carrinho
- **Localização**: Página de produtos (`produtos.html`)
- **Funcionamento**: Clique no botão "Adicionar ao Carrinho" no modal do produto
- **Armazenamento**: localStorage do navegador
- **Estrutura dos dados**:
```json
{
  "id": "nome-do-produto",
  "nome": "Nome do Produto",
  "preco": 25.00,
  "quantidade": 2
}
```

### 2. Visualizar Carrinho
- **Localização**: Página do carrinho (`carrinho.html`)
- **Exibição**: Lista de produtos, quantidades, preços e total
- **Funcionalidades**:
  - Visualizar itens adicionados
  - Remover itens do carrinho
  - Calcular total automático

### 3. Finalizar Pedido via WhatsApp
- **Botão**: "Enviar Pedido via WhatsApp"
- **Funcionamento**:
  1. Gera mensagem formatada com os itens do pedido
  2. Abre WhatsApp Web/App com mensagem pré-preenchida
  3. Registra pedido no localStorage
  4. Limpa o carrinho

### 4. Exemplo de Mensagem WhatsApp
```
Pedido Recanto Feliz:
- Bandeja 20 ovos: 2 x R$25,00
- Adubo 3 anos: 1 x R$15,00

Total: R$65,00
Itens: 3
```

## 🔧 Configuração

### Número do WhatsApp
Altere o número no arquivo `scripts.js`:
```javascript
const numeroWhatsApp = '5511999999999'; // Substituir pelo número real
```

## 📊 Acompanhamento de Pedidos (Versão de Teste)

### Dados Salvos no localStorage
- **Chave**: `pedidos`
- **Estrutura**:
```json
{
  "data": "2025-08-20T15:30:00.000Z",
  "itens": [...],
  "total": 65.00
}
```

### Como Visualizar Pedidos Realizados
1. Abra as Ferramentas de Desenvolvedor (F12)
2. Vá para Application > Local Storage
3. Procure por `pedidos`

## 🚀 Evolução para Produção

### Implementação de Banco de Dados
Para a versão definitiva, será necessário:

1. **Backend com API**:
   - Node.js + Express ou PHP
   - Endpoints para salvar/consultar pedidos

2. **Banco de Dados**:
   - MySQL, PostgreSQL ou MongoDB
   - Tabelas: `pedidos`, `itens_pedido`

3. **Estrutura de Tabelas**:
```sql
-- Tabela de pedidos
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_pedido DATETIME,
    total DECIMAL(10,2),
    status VARCHAR(50),
    cliente_whatsapp VARCHAR(20)
);

-- Tabela de itens do pedido
CREATE TABLE itens_pedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT,
    produto_nome VARCHAR(255),
    quantidade INT,
    preco_unitario DECIMAL(10,2),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);
```

4. **Sistema Administrativo**:
   - Dashboard para visualizar pedidos
   - Controle de status (pendente, confirmado, entregue)
   - Relatórios de vendas

## 📱 Funcionalidades Futuras

### Sistema de Acompanhamento
- [ ] Dashboard administrativo
- [ ] Status de pedidos em tempo real
- [ ] Notificações automáticas
- [ ] Histórico de pedidos por cliente

### Melhorias no Carrinho
- [ ] Alterar quantidade diretamente no carrinho
- [ ] Salvar carrinho entre sessões
- [ ] Carrinho persistente por usuário
- [ ] Cupons de desconto

### Integração WhatsApp Business
- [ ] API oficial do WhatsApp
- [ ] Confirmação automática de pedidos
- [ ] Templates de mensagens
- [ ] Webhook para status de entrega

## 🔒 Configurações de Segurança (Produção)

### Validações Necessárias
- Sanitização de dados de entrada
- Validação de preços no servidor
- Prevenção contra SQL Injection
- Rate limiting para pedidos

### Backup e Recuperação
- Backup automático do banco de dados
- Log de todas as transações
- Sistema de recuperação de dados

## 📞 Suporte

Para dúvidas sobre implementação ou configuração:
- Consulte este documento
- Teste o sistema em ambiente local
- Documente bugs encontrados para correção

---

**Versão**: 1.0  
**Data**: Agosto 2025  
**Status**: Implementado para teste
