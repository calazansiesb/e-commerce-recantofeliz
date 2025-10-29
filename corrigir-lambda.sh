#!/bin/bash
# Corrigir Lambda com código correto

echo "🔧 CORRIGINDO LAMBDA PRODUTOS"
echo "============================"

# 1. Criar pacote da nova Lambda
echo "📦 Criando pacote..."
zip lambda-produtos-correta.zip lambda-produtos-correta.py

# 2. Atualizar código da Lambda existente
echo "🔄 Atualizando código da Lambda..."
aws lambda update-function-code \
  --function-name GranjaRecantoFelizAPI \
  --zip-file fileb://lambda-produtos-correta.zip

# 3. Testar nova Lambda
echo "🧪 Testando Lambda corrigida..."
aws lambda invoke \
  --function-name GranjaRecantoFelizAPI \
  --payload file://test-payload.json \
  response-nova.json

echo "📋 Resposta da Lambda corrigida:"
cat response-nova.json

echo ""
echo "🌐 Testando via API Gateway:"
curl -X GET "https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/produtos"

echo ""
echo "✅ Correção concluída!"