# 🚀 Plano de Refatoração - Banco de Dados AWS

## 📋 **Estratégia por Etapas (Segura)**

### **ETAPA 1: Preparação e Backup** ✅
- [x] Criar backup completo do sistema atual
- [x] Documentar estado atual
- [x] Configurar ambiente de desenvolvimento

### **ETAPA 2: Infraestrutura AWS** (Próxima)
- [ ] Criar RDS MySQL (Free Tier)
- [ ] Configurar bucket S3 para imagens
- [ ] Configurar IAM e permissões
- [ ] Testar conectividade

### **ETAPA 3: Backend API** 
- [ ] Criar API Node.js/Express
- [ ] Implementar endpoints básicos
- [ ] Conectar com RDS
- [ ] Testar CRUD produtos

### **ETAPA 4: Migração de Dados**
- [ ] Script de migração JSON → RDS
- [ ] Migrar imagens para S3
- [ ] Validar integridade dos dados

### **ETAPA 5: Frontend Híbrido**
- [ ] Criar versão híbrida (JSON + API)
- [ ] Implementar fallback automático
- [ ] Testar compatibilidade

### **ETAPA 6: Admin Refatorado**
- [ ] Atualizar painel admin
- [ ] Upload de imagens para S3
- [ ] Interface de gerenciamento

### **ETAPA 7: Finalização**
- [ ] Remover dependências JSON
- [ ] Testes completos
- [ ] Deploy final

## 🛡️ **Pontos de Restauração**
- Cada etapa tem backup independente
- Rollback automático em caso de erro
- Sistema atual permanece funcional

## 💰 **Custos Estimados**
- **RDS db.t2.micro:** Gratuito (12 meses)
- **S3:** ~$0.01/mês (imagens)
- **EC2 t2.micro:** Gratuito (12 meses)
- **Total:** Praticamente gratuito

---

**Pronto para começar a ETAPA 2?**