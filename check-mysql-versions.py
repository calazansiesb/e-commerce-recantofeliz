#!/usr/bin/env python3
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

access_key, secret_key = load_credentials()
rds = boto3.client('rds', 
                   aws_access_key_id=access_key,
                   aws_secret_access_key=secret_key,
                   region_name='sa-east-1')

print("Versões MySQL disponíveis:")
response = rds.describe_db_engine_versions(Engine='mysql')
for version in response['DBEngineVersions'][-5:]:  # Últimas 5 versões
    print(f"- {version['EngineVersion']}")