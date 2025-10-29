import json
import boto3
from decimal import Decimal

def lambda_handler(event, context):
    """Lambda correta para produtos da granja"""
    
    print(f"Event: {json.dumps(event)}")
    
    # Configurar DynamoDB
    dynamodb = boto3.resource('dynamodb', region_name='sa-east-1')
    table = dynamodb.Table('GranjaRecantoFelizProdutos')
    
    try:
        # Extrair método HTTP e path
        http_method = event.get('httpMethod', 'GET')
        path = event.get('path', '')
        
        print(f"Method: {http_method}, Path: {path}")
        
        if http_method == 'GET' and '/api/produtos' in path:
            # Listar todos os produtos
            response = table.scan()
            items = response.get('Items', [])
            
            # Converter Decimal para float
            products = []
            for item in items:
                product = {}
                for key, value in item.items():
                    if isinstance(value, Decimal):
                        product[key] = float(value)
                    else:
                        product[key] = value
                products.append(product)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': json.dumps({
                    'products': products,
                    'count': len(products),
                    'timestamp': context.aws_request_id
                })
            }
            
        elif http_method == 'POST' and '/api/produtos' in path:
            # Criar novo produto
            body = json.loads(event.get('body', '{}'))
            
            # Adicionar ao DynamoDB
            table.put_item(Item=body)
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'message': 'Produto criado com sucesso',
                    'product': body
                })
            }
            
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Endpoint não encontrado',
                    'method': http_method,
                    'path': path
                })
            }
            
    except Exception as e:
        print(f"Erro: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Erro interno do servidor',
                'message': str(e)
            })
        }