#!/usr/bin/env python3
"""
Corrigir função Lambda - adicionar credenciais AWS
"""

import boto3
import zipfile
import os

def load_credentials():
    with open('.aws-credentials', 'r') as f:
        lines = f.readlines()
    credentials = {}
    for line in lines:
        if '=' in line and not line.startswith('#'):
            key, value = line.strip().split('=', 1)
            credentials[key] = value
    return credentials.get('AWS_ACCESS_KEY_ID'), credentials.get('AWS_SECRET_ACCESS_KEY')

def update_lambda():
    access_key, secret_key = load_credentials()
    
    lambda_client = boto3.client('lambda',
                               aws_access_key_id=access_key,
                               aws_secret_access_key=secret_key,
                               region_name='sa-east-1')
    
    # Código Lambda corrigido
    lambda_code = '''
import json
import boto3
from decimal import Decimal

# Inicializar clientes AWS
dynamodb = boto3.resource('dynamodb', region_name='sa-east-1')
table = dynamodb.Table('GranjaRecantoFelizProdutos')

def lambda_handler(event, context):
    try:
        method = event.get('httpMethod', 'GET')
        path = event.get('path', '/')
        
        # CORS headers
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }
        
        if method == 'OPTIONS':
            return {'statusCode': 200, 'headers': headers, 'body': ''}
        
        if path == '/api/produtos':
            if method == 'GET':
                return get_produtos(headers)
            elif method == 'POST':
                return create_produto(event, headers)
        
        elif path.startswith('/api/produtos/'):
            produto_id = int(path.split('/')[-1])
            if method == 'GET':
                return get_produto(produto_id, headers)
            elif method == 'PUT':
                return update_produto(produto_id, event, headers)
            elif method == 'DELETE':
                return delete_produto(produto_id, headers)
        
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Endpoint não encontrado'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': str(e), 'type': type(e).__name__})
        }

def get_produtos(headers):
    try:
        response = table.scan()
        items = response.get('Items', [])
        
        # Converter Decimal para float
        for item in items:
            if 'price' in item:
                item['price'] = float(item['price'])
            if 'id' in item:
                item['id'] = int(item['id'])
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'products': items})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Erro ao buscar produtos: {str(e)}'})
        }

def get_produto(produto_id, headers):
    try:
        response = table.get_item(Key={'id': produto_id})
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Produto não encontrado'})
            }
        
        item = response['Item']
        if 'price' in item:
            item['price'] = float(item['price'])
        if 'id' in item:
            item['id'] = int(item['id'])
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(item)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Erro ao buscar produto: {str(e)}'})
        }

def create_produto(event, headers):
    try:
        data = json.loads(event.get('body', '{}'))
        
        # Converter price para Decimal
        if 'price' in data:
            data['price'] = Decimal(str(data['price']))
        
        table.put_item(Item=data)
        
        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps({'message': 'Produto criado com sucesso'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Erro ao criar produto: {str(e)}'})
        }

def update_produto(produto_id, event, headers):
    try:
        data = json.loads(event.get('body', '{}'))
        
        # Converter price para Decimal
        if 'price' in data:
            data['price'] = Decimal(str(data['price']))
        
        # Atualizar item
        update_expression = "SET "
        expression_values = {}
        
        for key, value in data.items():
            if key != 'id':
                update_expression += f"{key} = :{key}, "
                expression_values[f":{key}"] = value
        
        update_expression = update_expression.rstrip(', ')
        
        table.update_item(
            Key={'id': produto_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_values
        )
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Produto atualizado com sucesso'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Erro ao atualizar produto: {str(e)}'})
        }

def delete_produto(produto_id, headers):
    try:
        table.delete_item(Key={'id': produto_id})
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Produto removido com sucesso'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Erro ao remover produto: {str(e)}'})
        }
'''
    
    # Criar ZIP atualizado
    with zipfile.ZipFile('lambda_function_fixed.zip', 'w') as zip_file:
        zip_file.writestr('lambda_function.py', lambda_code)
    
    # Atualizar função
    with open('lambda_function_fixed.zip', 'rb') as zip_file:
        zip_content = zip_file.read()
    
    try:
        lambda_client.update_function_code(
            FunctionName='GranjaRecantoFelizAPI',
            ZipFile=zip_content
        )
        print("OK: Lambda atualizado com sucesso")
        
    except Exception as e:
        print(f"ERRO: {e}")
    
    finally:
        if os.path.exists('lambda_function_fixed.zip'):
            os.remove('lambda_function_fixed.zip')

if __name__ == "__main__":
    update_lambda()