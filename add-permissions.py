#!/usr/bin/env python3
"""
Adicionar permissões DynamoDB ao usuário granja-deploy
"""

import boto3

def load_credentials():
    with open('.aws-credentials', 'r') as f:
        lines = f.readlines()
    credentials = {}
    for line in lines:
        if '=' in line and not line.startswith('#'):
            key, value = line.strip().split('=', 1)
            credentials[key] = value
    return credentials.get('AWS_ACCESS_KEY_ID'), credentials.get('AWS_SECRET_ACCESS_KEY')

def main():
    print("Adicionando permissões AWS...")
    
    access_key, secret_key = load_credentials()
    iam = boto3.client('iam',
                      aws_access_key_id=access_key,
                      aws_secret_access_key=secret_key,
                      region_name='sa-east-1')
    
    try:
        # Adicionar políticas necessárias
        policies = [
            ('arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess', 'DynamoDB'),
            ('arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator', 'API Gateway'),
            ('arn:aws:iam::aws:policy/AWSLambda_FullAccess', 'Lambda')
        ]
        
        for policy_arn, name in policies:
            try:
                iam.attach_user_policy(UserName='granja-deploy', PolicyArn=policy_arn)
                print(f"OK: Permissão {name} adicionada")
            except Exception as e:
                if "EntityAlreadyExists" in str(e):
                    print(f"AVISO: Permissão {name} já existe")
                else:
                    print(f"ERRO {name}: {e}")
        
        # Listar políticas atuais
        response = iam.list_attached_user_policies(UserName='granja-deploy')
        print("\nPolíticas atuais:")
        for policy in response['AttachedPolicies']:
            print(f"- {policy['PolicyName']}")
            
    except Exception as e:
        print(f"ERRO: {e}")

if __name__ == "__main__":
    main()