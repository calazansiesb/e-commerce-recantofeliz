# 🚀 Deploy AWS - Granja Recanto Feliz

## ✅ Status: Pronto para Deploy

O projeto foi **otimizado em 73%** e está pronto para migração AWS.

## 📊 Otimizações Realizadas

- **Tamanho reduzido**: 45MB → 12MB (73% economia)
- **Imagens otimizadas**: PNG → JPG (91% economia)
- **Arquivos limpos**: Removidos desnecessários
- **Referências atualizadas**: Todos os links corrigidos

## 🎯 Opções de Deploy

### 1. 🤖 Deploy Automatizado (Recomendado)
```bash
# Instalar dependências
pip install -r requirements.txt

# Configurar credenciais AWS (uma vez)
aws configure

# Executar deploy
python deploy-aws.py
```

### 2. 📋 Deploy Manual
Siga o guia detalhado: `deploy-manual.md`

## 💰 Custos Estimados

| Serviço | Custo Mensal |
|---------|--------------|
| S3 Storage | $0.01 |
| S3 Requests | $0.01 |
| CloudFront | $0.05 |
| Route 53* | $0.50 |
| **Total** | **$0.57** |

*Route 53 apenas se usar domínio próprio

## 🌐 URLs Após Deploy

- **S3 Website**: `http://bucket.s3-website-sa-east-1.amazonaws.com`
- **CloudFront**: `https://d123456789.cloudfront.net`
- **Domínio Próprio**: `https://granjarecantofeliz.com` (opcional)

## ✅ Checklist Pré-Deploy

- [x] Projeto otimizado (73% redução)
- [x] Imagens convertidas (PNG → JPG)
- [x] Referências atualizadas
- [x] Scripts de deploy criados
- [x] Documentação completa
- [ ] Credenciais AWS configuradas
- [ ] Teste local funcionando

## 🔧 Configuração AWS

### Credenciais Necessárias
```bash
aws configure
# AWS Access Key ID: [sua-key]
# AWS Secret Access Key: [sua-secret]
# Default region: sa-east-1
# Default output format: json
```

### Permissões Necessárias
- S3: CreateBucket, PutObject, PutBucketPolicy
- CloudFront: CreateDistribution
- Route 53: CreateHostedZone (opcional)

## 📁 Estrutura de Deploy

```
Arquivos que serão enviados:
✅ index.html
✅ admin.html
✅ css/estilos.css
✅ js/scripts-simples.js
✅ imagens/ (otimizadas)
✅ dados/produtos.json
✅ admin/login.html

Arquivos ignorados:
❌ backup-otimizacao-2025/
❌ .git/
❌ deploy-aws.py
❌ node_modules/
```

## 🚨 Importante

1. **Teste local primeiro**: Certifique-se que tudo funciona
2. **Backup**: Mantenha backup dos arquivos originais
3. **Custos**: Monitore custos no AWS Billing
4. **DNS**: Só configure Route 53 após testes

## 🆘 Suporte

Em caso de problemas:
1. Verifique `deploy-manual.md` para troubleshooting
2. Consulte logs do script Python
3. Verifique console AWS para erros
4. Teste endpoints individualmente

## 🎉 Após Deploy Bem-sucedido

1. **Teste todas as funcionalidades**
2. **Configure monitoramento de custos**
3. **Documente URLs finais**
4. **Configure backup automático**
5. **Monitore performance**

---

**Pronto para levar a Granja Recanto Feliz para a nuvem AWS!** 🌱☁️