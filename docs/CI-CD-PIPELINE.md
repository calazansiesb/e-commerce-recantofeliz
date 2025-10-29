# 🚀 CI/CD Pipeline - Granja Recanto Feliz

## Fluxo de Deploy

```
┌─────────────────┐
│   Desenvolvedor │
│    faz commit   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  GitHub Actions (CI/CD Automático)  │
│  - Valida código                    │
│  - Testa imagens                    │
│  - Build otimizado                  │
└────────┬────────────────────────────┘
         │
         ▼
    ┌────────────────────┐
    │  AMBIENTE DEV      │
    │  Testes de QA      │
    │  Homologação       │
    └────────┬───────────┘
             │ (Aprovado)
             ▼
    ┌────────────────────┐
    │  AMBIENTE PROD     │
    │  Produção LIVE     │
    │  Usuários reais    │
    └────────────────────┘
```

## Ambientes

### 🔵 DEV (Homologação)
- URL: `https://www.granjarecantofeliz.com/dev/`
- Atualizado a cada commit em `develop`
- Testes de QA e validação
- Cache desabilitado para testes

### 🟢 PROD (Produção)
- URL: `https://www.granjarecantofeliz.com/`
- Deploy apenas via aprovação manual
- Cache otimizado
- Backup automático antes de deploy

## Boas Práticas

✅ **Versionamento Semântico**
- `v1.0.0` - Releases
- `main` branch - Código em produção
- `develop` branch - Código em desenvolvimento

✅ **Testes Automatizados**
- Validação de sintaxe HTML/CSS/JS
- Testes de performance
- Verificação de imagens

✅ **Segurança**
- Secrets seguros em GitHub
- Credenciais AWS não em repositório
- Rollback automático em caso de erro

✅ **Monitoramento**
- Logs de deploy
- Alertas de erro
- Histórico de mudanças

## Próximos Passos

1. ✅ Criar workflow GitHub Actions
2. ✅ Configurar S3 para DEV e PROD
3. ✅ Criar scripts de deploy
4. ✅ Testar pipeline
5. ✅ Documentar para equipe
