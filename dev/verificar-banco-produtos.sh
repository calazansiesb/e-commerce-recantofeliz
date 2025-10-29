#!/bin/bash
# Verificar apenas banco de dados e sistema de produtos

echo "🗄️ VERIFICANDO BANCO DE DADOS - PRODUTOS"
echo "========================================"

# 1. Verificar DynamoDB
echo "1️⃣ Tabelas DynamoDB:"
aws dynamodb list-tables --query 'TableNames[?contains(@, `produto`) || contains(@, `Produto`) || contains(@, `granja`) || contains(@, `Granja`)]' --output table

echo ""
echo "📋 Todas as tabelas DynamoDB:"
aws dynamodb list-tables --output table

# 2. Verificar API Gateway
echo ""
echo "2️⃣ APIs Gateway:"
aws apigateway get-rest-apis --query 'items[].{Id:id,Name:name,CreatedDate:createdDate}' --output table

# 3. Verificar Lambda Functions
echo ""
echo "3️⃣ Funções Lambda:"
aws lambda list-functions --query 'Functions[?contains(FunctionName, `produto`) || contains(FunctionName, `granja`) || contains(FunctionName, `api`)].{Name:FunctionName,Runtime:Runtime}' --output table

# 4. Verificar se existe arquivo produtos.json no S3
echo ""
echo "4️⃣ Arquivo produtos.json no S3:"
aws s3 ls s3://granjarecantofeliz-site/dados/ 2>/dev/null || echo "❌ Pasta dados não encontrada"
aws s3 ls s3://granjarecantofeliz-site/ --recursive | grep produtos 2>/dev/null || echo "❌ Arquivo produtos.json não encontrado no S3"

echo ""
echo "✅ VERIFICAÇÃO CONCLUÍDA!"