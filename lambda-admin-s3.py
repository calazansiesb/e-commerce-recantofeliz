import json
import boto3
import base64
from datetime import datetime

# Lambda para admin salvar direto no S3
def lambda_handler(event, context):
    
    s3 = boto3.client('s3')
    cloudfront = boto3.client('cloudfront')
    
    try:
        action = event.get('action')
        
        if action == 'upload-image':
            # Upload de imagem
            bucket = event['bucket']
            key = event['key']
            image_data = base64.b64decode(event['data'])
            
            s3.put_object(
                Bucket=bucket,
                Key=key,
                Body=image_data,
                ContentType=event.get('contentType', 'image/jpeg'),
                CacheControl='max-age=31536000'
            )
            
            return {'statusCode': 200, 'body': json.dumps({'message': 'Imagem enviada'})}
            
        elif action == 'update-json':
            # Atualizar produtos.json
            bucket = event['bucket']
            key = event['key']
            data = event['data']
            
            s3.put_object(
                Bucket=bucket,
                Key=key,
                Body=data,
                ContentType='application/json',
                CacheControl='no-cache'
            )
            
            return {'statusCode': 200, 'body': json.dumps({'message': 'JSON atualizado'})}
            
        elif action == 'invalidate-cache':
            # Invalidar CloudFront
            distribution_id = event['distributionId']
            paths = event['paths']
            
            cloudfront.create_invalidation(
                DistributionId=distribution_id,
                InvalidationBatch={
                    'Paths': {
                        'Quantity': len(paths),
                        'Items': paths
                    },
                    'CallerReference': str(datetime.now().timestamp())
                }
            )
            
            return {'statusCode': 200, 'body': json.dumps({'message': 'Cache invalidado'})}
            
        else:
            return {'statusCode': 400, 'body': json.dumps({'error': 'Ação inválida'})}
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }