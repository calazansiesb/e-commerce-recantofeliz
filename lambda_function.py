import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('GranjaRecantoFelizProdutos')

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    try:
        http_method = event.get('httpMethod', 'GET')
        path = event.get('path', '')
        
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
        
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'CORS preflight'})
            }
        
        if path == '/api/produtos' and http_method == 'GET':
            response = table.scan()
            produtos = response.get('Items', [])
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(produtos, default=decimal_default)
            }
        
        elif path == '/api/produtos' and http_method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            table.put_item(Item=body)
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'message': 'Produto criado com sucesso'})
            }
        
        elif path.startswith('/api/produtos/') and http_method == 'PUT':
            produto_id = path.split('/')[-1]
            body = json.loads(event.get('body', '{}'))
            
            table.put_item(Item=body)
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Produto atualizado com sucesso'})
            }
        
        elif path.startswith('/api/produtos/') and http_method == 'DELETE':
            produto_id = path.split('/')[-1]
            
            table.delete_item(Key={'id': int(produto_id)})
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Produto deletado com sucesso'})
            }
        
        else:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'message': 'Endpoint não encontrado'})
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'message': f'Erro interno: {str(e)}'})
        }