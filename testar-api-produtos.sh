#!/bin/bash
# Testar API de produtos específica

echo "🧪 TESTANDO API DE PRODUTOS"
echo "=========================="

# API principal identificada: frb45jmipc
API_ID="frb45jmipc"
BASE_URL="https://${API_ID}.execute-api.sa-east-1.amazonaws.com/prod"

echo "🔗 URL Base: $BASE_URL"
echo ""

# 1. Verificar recursos da API
echo "1️⃣ Recursos da API:"
aws apigateway get-resources --rest-api-id $API_ID --query 'items[].{Path:path,Methods:resourceMethods}' --output table

echo ""
echo "2️⃣ Testando endpoint /api/produtos:"
curl -X GET "$BASE_URL/api/produtos" -H "Content-Type: application/json" -w "\nStatus: %{http_code}\n"

echo ""
echo "3️⃣ Verificar tabela DynamoDB GranjaRecantoFelizProdutos:"
aws dynamodb describe-table --table-name GranjaRecantoFelizProdutos --query 'Table.{Name:TableName,Status:TableStatus,ItemCount:ItemCount}' --output table

echo ""
echo "4️⃣ Contar itens na tabela:"
aws dynamodb scan --table-name GranjaRecantoFelizProdutos --select COUNT --query 'Count'