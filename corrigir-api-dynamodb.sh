#!/bin/bash
# Corrigir API Gateway para DynamoDB

echo "🔧 CORRIGINDO API DYNAMODB"
echo "========================="

API_ID="frb45jmipc"

# 1. Verificar logs da API
echo "📋 Verificando logs CloudWatch..."
aws logs describe-log-groups --log-group-name-prefix "/aws/apigateway/$API_ID"

# 2. Testar recursos da API
echo "🔍 Recursos da API:"
aws apigateway get-resources --rest-api-id $API_ID

# 3. Verificar método GET /produtos
echo "🔍 Método GET /produtos:"
aws apigateway get-method --rest-api-id $API_ID --resource-id RESOURCE_ID --http-method GET

# 4. Verificar integração com DynamoDB
echo "🔍 Integração:"
aws apigateway get-integration --rest-api-id $API_ID --resource-id RESOURCE_ID --http-method GET

echo "✅ Diagnóstico concluído"