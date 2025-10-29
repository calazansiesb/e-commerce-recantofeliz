#!/bin/bash
# Deploy da Lambda de sincronização

echo "🚀 DEPLOY LAMBDA SINCRONIZAÇÃO"
echo "============================="

# 1. Criar pacote da Lambda
echo "📦 Criando pacote..."
zip lambda-sync.zip lambda-sync-produtos.py

# 2. Criar função Lambda
echo "⚡ Criando função Lambda..."
aws lambda create-function \
  --function-name granja-sync-produtos \
  --runtime python3.9 \
  --role arn:aws:iam::311719320177:role/lambda-execution-role \
  --handler lambda-sync-produtos.lambda_handler \
  --zip-file fileb://lambda-sync.zip \
  --description "Sincronização DynamoDB → S3 → CloudFront"

# 3. Criar trigger DynamoDB
echo "🔄 Configurando trigger DynamoDB..."
aws lambda create-event-source-mapping \
  --event-source-arn arn:aws:dynamodb:sa-east-1:311719320177:table/GranjaRecantoFelizProdutos/stream/2024-01-01T00:00:00.000 \
  --function-name granja-sync-produtos \
  --starting-position LATEST

# 4. Testar função
echo "🧪 Testando função..."
aws lambda invoke \
  --function-name granja-sync-produtos \
  --payload '{}' \
  response.json

echo "✅ Deploy concluído!"
echo "📋 A sincronização agora é automática:"
echo "   DynamoDB → Lambda → S3 → CloudFront"