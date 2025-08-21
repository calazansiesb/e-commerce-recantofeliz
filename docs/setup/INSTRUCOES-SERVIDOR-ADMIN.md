# 🚀 Instruções: Servidor Admin

## **✅ Sistema Implementado Conforme Roadmap**

### **📋 Checklist Concluído**
- ✅ **Endpoint Flask** - `admin-save.py` funcional
- ✅ **Proteção com token** - Variável `ADMIN_TOKEN`
- ✅ **Admin.js integrado** - `admin-server-integration.js`
- ✅ **Backup automático** - Pasta `backups/` com timestamp
- ✅ **Fallback localStorage** - Sistema robusto
- ✅ **Scripts de inicialização** - `start-admin-server.bat`

## **🔧 Como Usar**

### **1. Iniciar Servidor**
```bash
# Windows
start-admin-server.bat

# Linux/Mac
export ADMIN_TOKEN=granja2025
python admin-save.py
```

### **2. Configurar Admin**
1. Abra `admin.html`
2. Digite o token quando solicitado
3. Sistema funcionará automaticamente

### **3. Fluxo de Salvamento**
```
Admin → Servidor Flask → produtos.json + Backup → localStorage (cache)
```

## **⚙️ Configuração**

### **Token de Segurança**
```bash
# Definir token personalizado
set ADMIN_TOKEN=minha_senha_secreta
```

### **URLs do Servidor**
- **Endpoint**: `POST /admin/save-products`
- **Dados**: `GET /src/data/produtos.json`
- **Porta**: `5000` (padrão)

## **📁 Estrutura de Arquivos**

```
├── admin-save.py              # Servidor Flask
├── start-admin-server.bat     # Script Windows
├── src/
│   ├── data/
│   │   └── produtos.json      # Dados principais
│   └── js/
│       └── admin-server-integration.js
└── backups/                   # Backups automáticos
    ├── produtos-backup-20250820-143022.json
    └── produtos-backup-20250820-143155.json
```

## **🔄 Funcionamento**

### **Salvamento com Servidor**
1. Admin clica "Salvar"
2. Dados enviados para Flask
3. Flask cria backup automático
4. Flask salva `produtos.json`
5. Resposta de sucesso
6. Cache local atualizado

### **Fallback Automático**
- **Servidor offline** → localStorage
- **Token inválido** → localStorage
- **Erro de rede** → localStorage

## **🧪 Testes**

### **Testar Integração**
```javascript
// No console do admin
testServerIntegration()
```

### **Verificar Backups**
```bash
# Listar backups criados
dir backups\
```

### **Testar Fluxo Completo**
1. Iniciar servidor
2. Editar produto no admin
3. Salvar alterações
4. Verificar `produtos.json` atualizado
5. Recarregar site principal
6. Confirmar mudanças visíveis

## **🛠️ Solução de Problemas**

### **Servidor Não Inicia**
```bash
# Verificar Python
python --version

# Instalar Flask
pip install flask
```

### **Token Inválido**
```bash
# Reconfigurar token
set ADMIN_TOKEN=novo_token
```

### **Porta Ocupada**
```python
# Alterar porta no admin-save.py
app.run(host='127.0.0.1', port=5001)
```

## **🔒 Segurança**

### **Produção**
- Use HTTPS obrigatório
- Token complexo (32+ caracteres)
- Restringir CORS por domínio
- Logs de auditoria

### **Desenvolvimento**
- Token simples OK
- HTTP local permitido
- CORS aberto para localhost

## **📊 Relatórios de Pedidos**

### **Salvamento Atual**
- **localStorage** (temporário)
- **SQLite browser** (local)

### **Implementação Futura**
```python
# Adicionar ao admin-save.py
@app.route('/admin/save-orders', methods=['POST'])
def save_orders():
    # Salvar pedidos em orders.json
    # Gerar relatórios automáticos
```

### **Relatórios Disponíveis**
- Total de pedidos por mês
- Produtos mais vendidos
- Faturamento mensal
- Clientes frequentes

## **✅ Status Final**

**Sistema PRONTO para uso conforme roadmap:**
- ✅ Endpoint funcional
- ✅ Segurança implementada
- ✅ Backup automático
- ✅ Fallback robusto
- ✅ Integração completa
- ✅ Scripts de deploy
- ✅ Documentação completa

**Próximos passos opcionais:**
- Implementar sistema de pedidos no servidor
- Adicionar relatórios automáticos
- Deploy em servidor de produção