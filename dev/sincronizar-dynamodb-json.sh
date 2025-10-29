#!/bin/bash
# Sincronizar produtos do DynamoDB para JSON

echo "🔄 SINCRONIZANDO DYNAMODB → JSON"
echo "==============================="

# Exportar produtos do DynamoDB
echo "📥 Exportando produtos do DynamoDB..."
aws dynamodb scan --table-name GranjaRecantoFelizProdutos --output json > produtos-dynamodb.json

echo "✅ Produtos exportados para produtos-dynamodb.json"
echo ""
echo "📊 Produtos encontrados:"
aws dynamodb scan --table-name GranjaRecantoFelizProdutos --query 'Items[].{ID:id.S,Nome:name.S,Preco:price.N}' --output table

echo ""
echo "💡 Para usar no site:"
echo "1. Baixe o arquivo produtos-dynamodb.json"
echo "2. Converta para o formato do site"
echo "3. Substitua dados/produtos.json"