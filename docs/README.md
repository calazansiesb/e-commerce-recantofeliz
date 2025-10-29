# 📚 Índice de Documentação - Site Granja Recanto Feliz

*Última atualização: 2025-08-28 14:35:00*

## 🎯 **Visão Geral do Projeto**
Site institucional e e-commerce da Granja Recanto Feliz com gestão de produtos e categorias.

---

## 📋 **Documentos Disponíveis**

### � **CI/CD e Deployment** (NOVO - Out 2025)
| Documento | Descrição | Status | Uso |
|-----------|-----------|--------|-----|
| [QUICK-START.md](./QUICK-START.md) | Deploy em 5 minutos ⚡ | ✅ | Devs |
| [PUSH-DEV-PROD.md](./PUSH-DEV-PROD.md) | Passo a passo completo | ✅ | Devs |
| [GUIA-DEPLOY-CICD.md](./GUIA-DEPLOY-CICD.md) | Setup de CI/CD | ✅ | DevOps |
| [CI-CD-PIPELINE.md](./CI-CD-PIPELINE.md) | Visão geral do pipeline | ✅ | Líderes |
| [RESUMO-EXECUTIVO.md](./RESUMO-EXECUTIVO.md) | O que foi feito | ✅ | Todos |

### 📸 **Imagens e Performance** (NOVO - Out 2025)
| Documento | Descrição | Status | Uso |
|-----------|-----------|--------|-----|
| [PADRONIZACAO-IMAGENS.md](./PADRONIZACAO-IMAGENS.md) | Padrão .jpg | ✅ | Designers |
| [RELATORIO-PADRONIZACAO.md](./RELATORIO-PADRONIZACAO.md) | Relatório técnico | ✅ | Stakeholders |

### �🛠️ **Gestão e Configuração**
| Documento | Descrição | Status | Última Atualização |
|-----------|-----------|--------|-------------------|
| [GESTAO-PRODUTOS-IMAGENS.md](./GESTAO-PRODUTOS-IMAGENS.md) | Gestão de produtos e imagens | ✅ | 2025-08-24 09:41:40 |
| [database-system.md](./database-system.md) | Sistema de banco de dados | ✅ | 2025-08-24 09:41:40 |
| [MUDANCA-ESTRUTURA-ARQUIVOS.md](./MUDANCA-ESTRUTURA-ARQUIVOS.md) | Mudanças na estrutura | ✅ | 2025-08-24 09:41:40 |

### 🚀 **Roadmap e Planejamento**
| Documento | Descrição | Status | Última Atualização |
|-----------|-----------|--------|-------------------|
| [ROADMAP-SALVAR-PRODUTOS.md](./ROADMAP-SALVAR-PRODUTOS.md) | Roadmap salvamento produtos | ✅ | 2025-08-24 09:41:40 |
| [PLANO-MODULARIZACAO.md](./PLANO-MODULARIZACAO.md) | Plano de modularização | ⚠️ VAZIO | 2025-08-24 09:41:40 |
| [migrar para aws.md](./migrar%20para%20aws.md) | Migração para AWS | ✅ | 2025-08-24 09:41:40 |

### 🐛 **Correções e Troubleshooting**
| Documento | Descrição | Status | Última Atualização |
|-----------|-----------|--------|-------------------|
| [erros corrigidos/CORRECAO-FILTROS-CARRINHO.md](./erros%20corrigidos/CORRECAO-FILTROS-CARRINHO.md) | Correção filtros carrinho | ✅ | 2025-08-24 09:41:40 |
| [erros corrigidos/CORRECAO-PRODUTOS-ADMIN-LISTAGEM.md](./erros%20corrigidos/CORRECAO-PRODUTOS-ADMIN-LISTAGEM.md) | Correção listagem admin | ✅ | 2025-08-24 09:41:41 |
| [erros corrigidos/erro filtro subcategorias.txt](./erros%20corrigidos/erro%20filtro%20subcategorias.txt) | Erro filtro subcategorias | ✅ | 2025-08-24 09:41:41 |
| [erros corrigidos/erro upload prodtus.txt](./erros%20corrigidos/erro%20upload%20prodtus.txt) | Erro upload produtos | ✅ | 2025-08-24 09:41:41 |

---

## 🏗️ **Arquitetura do Sistema**

### 📡 **APIs Utilizadas**
- **API Principal Site**: `frb45jmipc` - Produtos + Categorias
- **Bucket Site**: `s3://granjarecantofeliz-site/`
- **Bucket Imagens**: `s3://granja-recanto-feliz-images/`

### 🔗 **Integrações**
- AWS Amplify (Frontend)
- API Gateway (REST)
- S3 (Armazenamento e Hosting)
- CloudFront (CDN)

---

## ⚠️ **Ações Necessárias**

### 🔴 **Alta Prioridade**
- [ ] Completar `PLANO-MODULARIZACAO.md` (arquivo vazio)
- [ ] Padronizar arquivos `.txt` para `.md`
- [ ] Implementar controle de versão nos documentos

### 🟡 **Média Prioridade**
- [ ] Reorganizar pasta "erros corrigidos"
- [ ] Criar templates padrão
- [ ] Adicionar timestamps nos documentos

---

## 📞 **Separação de Projetos**

### ⚠️ **IMPORTANTE**
Este projeto é **SEPARADO** do projeto NFe:
- **Site Granja**: API `frb45jmipc`
- **Sistema NFe**: API `t7bbc799q5`

**Não misturar documentação entre projetos!**

---

*Projeto: Site Granja Recanto Feliz*
*Bucket: s3://granjarecantofeliz-site/docs/*