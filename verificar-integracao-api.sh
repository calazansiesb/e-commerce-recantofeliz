#!/bin/bash
# Verificar integração específica da API

API_ID="frb45jmipc"
RESOURCE_ID="lgm5qi"  # /api/produtos

echo "🔍 VERIFICANDO INTEGRAÇÃO API → DYNAMODB"
echo "======================================="

# 1. Verificar método GET
echo "1️⃣ Método GET /api/produtos:"
aws apigateway get-method --rest-api-id $API_ID --resource-id $RESOURCE_ID --http-method GET

echo ""
echo "2️⃣ Integração do método GET:"
aws apigateway get-integration --rest-api-id $API_ID --resource-id $RESOURCE_ID --http-method GET

echo ""
echo "3️⃣ Verificar deployment:"
aws apigateway get-deployments --rest-api-id $API_ID

echo ""
echo "4️⃣ Testar com verbose:"
curl -v "https://$API_ID.execute-api.sa-east-1.amazonaws.com/prod/api/produtos"