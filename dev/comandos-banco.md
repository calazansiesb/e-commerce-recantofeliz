# 🗄️ Comandos para Verificar Banco de Dados - Produtos

## 🎯 Comandos Essenciais no CloudShell

### 1. Verificar DynamoDB
```bash
# Listar todas as tabelas
aws dynamodb list-tables

# Buscar tabelas relacionadas a produtos
aws dynamodb list-tables --query 'TableNames[?contains(@, `produto`) || contains(@, `Produto`) || contains(@, `granja`) || contains(@, `Granja`)]'
```

### 2. Verificar API Gateway
```bash
# Listar APIs
aws apigateway get-rest-apis

# Ver detalhes das APIs
aws apigateway get-rest-apis --query 'items[].{Id:id,Name:name,Description:description}'
```

### 3. Verificar se produtos.json existe no S3
```bash
# Verificar arquivo produtos.json
aws s3 ls s3://granjarecantofeliz-site/dados/
aws s3 ls s3://granjarecantofeliz-site/ --recursive | grep produtos
```

### 4. Testar API diretamente (se existir)
```bash
# Se a API for https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod
curl -X GET "https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/produtos"
```

## 🔍 O que procurar:

**Cenário 1: DynamoDB + API Gateway**
- ✅ Tabela DynamoDB (ex: `GranjaRecantoFeliz-Produtos`)
- ✅ API Gateway com endpoints `/produtos`
- ✅ Funções Lambda conectando API ao DynamoDB

**Cenário 2: Apenas S3 (arquivo estático)**
- ✅ Arquivo `produtos.json` no bucket S3
- ❌ Sem DynamoDB
- ❌ Sem API Gateway

**Cenário 3: Híbrido**
- ✅ DynamoDB para admin
- ✅ Arquivo JSON para site público