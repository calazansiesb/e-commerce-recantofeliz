🔍 VERIFICANDO INFRAESTRUTURA AWS - GRANJA RECANTO FELIZ
=======================================================

📦 1. BUCKETS S3:
----------------
2025-09-17 10:05:43 granja-dev-app
2025-09-17 09:03:48 granja-migration-311719320177
2025-10-07 21:56:05 granja-pitch-2024
2025-08-24 10:34:48 granja-recanto-feliz-images
2025-09-17 09:30:13 granja-relatorios-app
2025-08-26 07:34:41 granjarecantofeliz-dev
2025-08-24 09:44:45 granjarecantofeliz-site
2025-08-26 06:40:41 granjarecantofeliz.com
2025-10-07 21:19:34 pitch.granjarecantofeliz.com
2025-10-07 17:00:40 qrdoca.granjarecantofeliz.com
2025-10-07 21:09:57 www.qrdoca.granjarecantofeliz.com        

📦 Detalhes do bucket principal:
{
    "LocationConstraint": "sa-east-1"
}


📦 Detalhes do bucket sistema:
{
    "LocationConstraint": "sa-east-1"
}


📦 Website configuration do bucket principal:
{
    "IndexDocument": {
        "Suffix": "index.html"
    },
    "ErrorDocument": {
        "Key": "index.html"
    }
}


🌐 2. DISTRIBUIÇÕES CLOUDFRONT:
------------------------------

In function contains(), invalid type for value: None, expected one of: ['array', 'string'], received: "null"

🌍 3. ROUTE 53 - ZONAS HOSPEDADAS:
----------------------------------

An error occurred (AccessDenied) when calling the ListHostedZones operation: User: arn:aws:iam::311719320177:user/granja-deploy is not authorized to perform: route53:ListHostedZones because no identity-based policy allows the route53:ListHostedZones action

🌍 Registros DNS da zona:

An error occurred (AccessDenied) when calling the ListHostedZones operation: User: arn:aws:iam::311719320177:user/granja-deploy is not authorized to perform: route53:ListHostedZones because no identity-based policy allows the route53:ListHostedZones action
❌ Zona hospedada não encontrada

🔒 4. CERTIFICADOS SSL (ACM):
----------------------------
Região us-east-1 (CloudFront):

An error occurred (AccessDeniedException) when calling the ListCertificates operation: User: arn:aws:iam::311719320177:user/granja-deploy is not authorized to perform: acm:ListCertificates because no identity-based policy allows the acm:ListCertificates action

Região sa-east-1 (São Paulo):

An error occurred (AccessDeniedException) when calling the ListCertificates operation: User: arn:aws:iam::311719320177:user/granja-deploy is not authorized to perform: acm:ListCertificates because no identity-based policy allows the acm:ListCertificates action

🔌 5. API GATEWAY:
-----------------
----------------------------------------------------------------------
|                             GetRestApis                    
        |
+----------------------------+-------------+-------------------------+
|         CreatedDate        |     Id      |          Name           |
+----------------------------+-------------+-------------------------+
|  2025-09-17T09:32:42-03:00 |  deo37k4kdd |  granja-relatorios-api  |
|  2025-08-24T10:54:43-03:00 |  frb45jmipc |  GranjaRecantoFelizAPI  |
9q5 |  GranjaRecantoFelizAPI  |                             
+----------------------------+-------------+-------------------------+


🗄️ 6. TABELAS DYNAMODB:
----------------------
----------------------------------
|           ListTables           |
+--------------------------------+
|  GranjaRecantoFelizCategorias  |
|  GranjaRecantoFelizProdutos    |
|  granja-dados                  |
|  granja-dados-dev              |
|  granja-producao               |
|  granja-vacinas                |
+--------------------------------+


⚡ 7. FUNÇÕES LAMBDA:
-------------------
------------------------------------------------------------------------
|                             ListFunctions                  
          |
+-------------------------------+-------------------------+------------+
|         LastModified          |          Name           |  Runtime   |
+-------------------------------+-------------------------+------------+
|  2025-09-18T15:18:58.000+0000 |  granja-api             |  python3.9 |
|  2025-10-27T10:44:38.000+0000 |  GranjaRecantoFelizAPI  |  python3.9 |
ja-cors-proxy      |  python3.9 |                            
+-------------------------------+-------------------------+------------+


🔐 8. ROLES IAM:
---------------
------------------------------------------------------------
|                         ListRoles                        | 
+----------------------------+-----------------------------+ 
|         CreateDate         |          RoleName           | 
+----------------------------+-----------------------------+ 
|  2025-09-17T12:30:14+00:00 |  granja-lambda-role         | 
|  2025-08-24T13:40:18+00:00 |  GranjaLambdaExecutionRole  | 
+----------------------------+-----------------------------+ 


💰 9. CUSTOS (ÚLTIMOS 30 DIAS):
------------------------------
❌ Dados de custo não disponíveis

✅ VERIFICAÇÃO CONCLUÍDA!
========================

📋 RESUMO ESPERADO (baseado na documentação):
- Bucket S3: granjarecantofeliz-site (sa-east-1)
- Bucket S3: granja-relatorios-app (sa-east-1)
- CloudFront: E10QPOHV1RNFOA (www.granjarecantofeliz.com)    
- CloudFront: E1XTMQ6QPLF7PD (sistema.granjarecantofeliz.com)
- Route 53: Z04264973SYHQQ0HCEEYM (granjarecantofeliz.com)   
- ACM: Certificados em us-east-1
[LOCAL-WIN] WEVERTON@DESKTOP-47T7MF3:/e/RECANTO FELIZ/SITE GEMINI/site-dev-aws$
[LOCAL-WIN] WEVERTON@DESKTOP-47T7MF3:/e/RECANTO FELIZ/SITE GEMINI/site-dev-aws$