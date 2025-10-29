import json
import boto3
from datetime import datetime

# Lambda para sincronizar DynamoDB → S3 → CloudFront
def lambda_handler(event, context):
    
    dynamodb = boto3.client('dynamodb')
    s3 = boto3.client('s3')
    cloudfront = boto3.client('cloudfront')
    
    try:
        # 1. Buscar produtos do DynamoDB
        response = dynamodb.scan(TableName='GranjaRecantoFelizProdutos')
        items = response.get('Items', [])
        
        # 2. Converter para formato JSON
        produtos = []
        for item in items:
            produto = {
                'id': int(item['id']['S']),
                'name': item['name']['S'],
                'category': item['category']['S'],
                'slogan': item['slogan']['S'],
                'description': item['description']['S'],
                'price': float(item['price']['N']),
                'stock': int(item['stock']['N']),
                'active': item['active']['BOOL'],
                'image': item.get('image', {}).get('S', f"imagens/produtos/{item['id']['S']}.1.jpg")
            }
            produtos.append(produto)
        
        # 3. Criar JSON
        json_data = {
            'products': produtos,
            'lastUpdate': datetime.now().isoformat(),
            'version': '1.0'
        }
        
        # 4. Upload para S3
        s3.put_object(
            Bucket='granjarecantofeliz-site',
            Key='dados/produtos.json',
            Body=json.dumps(json_data, ensure_ascii=False, indent=2),
            ContentType='application/json',
            CacheControl='no-cache'
        )
        
        # 5. Invalidar CloudFront
        cloudfront.create_invalidation(
            DistributionId='E10QPOHV1RNFOA',
            InvalidationBatch={
                'Paths': {
                    'Quantity': 2,
                    'Items': ['/dados/produtos.json', '/index.html']
                },
                'CallerReference': str(datetime.now().timestamp())
            }
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Sincronização concluída',
                'produtos': len(produtos),
                'timestamp': datetime.now().isoformat()
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }