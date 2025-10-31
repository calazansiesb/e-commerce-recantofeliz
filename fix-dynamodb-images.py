#!/usr/bin/env python3
"""
Script para corrigir extensões de imagens no DynamoDB
Muda: .jpeg/.png para .jpg
"""

import boto3
import json
from decimal import Decimal

# Conectar ao DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='sa-east-1')
table = dynamodb.Table('GranjaRecantoFelizProdutos')

# Produtos que precisam ser corrigidos
corrections = {
    3: 'imagens/produtos/3.1.jpg',      # Ovos Caipira 10
    4: 'imagens/produtos/4.1.jpg',      # Ovos Caipira 20
    6: 'imagens/produtos/6.1.jpg',      # Galinha Caipira Picada
    9: 'imagens/produtos/9.1.jpg'       # Queijo Minas Artesanal
}

print("🔧 Corrigindo extensões de imagens no DynamoDB...")
print("=" * 60)

for product_id, new_image_path in corrections.items():
    try:
        # Atualizar o item
        response = table.update_item(
            Key={'id': Decimal(str(product_id))},
            UpdateExpression='SET #image = :image',
            ExpressionAttributeNames={'#image': 'image'},
            ExpressionAttributeValues={':image': new_image_path},
            ReturnValues='ALL_NEW'
        )
        
        print(f"✅ Produto {product_id}: {response['Attributes']['name']}")
        print(f"   Nova imagem: {new_image_path}")
        print()
        
    except Exception as e:
        print(f"❌ Erro ao atualizar produto {product_id}: {e}")
        print()

print("=" * 60)
print("🎉 Correção completa! As imagens agora têm extensão .jpg")
print("\nVerifique a API novamente:")
print("curl https://frb45jmipc.execute-api.sa-east-1.amazonaws.com/prod/api/produtos")
