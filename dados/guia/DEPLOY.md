# 🚀 Guia de Deploy: Desenvolvimento e Produção

Este guia descreve o fluxo de trabalho profissional para publicar alterações no site, utilizando um ambiente de **Desenvolvimento (Dev)** para testes e um ambiente de **Produção (Prod)** para o site ao vivo.

**Objetivo:** Garantir que nenhuma alteração seja publicada no site principal (`granjarecantofeliz.com`) sem antes ser testada e aprovada no ambiente de desenvolvimento (`granjarecantofeliz.com/dev/`).

---

## 🏗️ 1. Modelo de Branches (Ramos)

Vamos usar duas branches principais no Git para gerenciar os ambientes:

- **`main`**: Esta branch representa o código que está em **Produção**. Tudo que está aqui está visível para os clientes em `granjarecantofeliz.com`.
- **`develop`**: Esta branch representa o código que está em **Desenvolvimento**. Tudo que está aqui é publicado em `granjarecantofeliz.com/dev/` para testes internos.

Qualquer nova funcionalidade ou correção será feita em uma branch separada e depois integrada na `develop`.

---

## 🔄 2. O Fluxo de Trabalho Passo a Passo

Este é o ciclo de vida de qualquer alteração no site, da ideia à publicação.

### Passo 1: Criar uma Nova Branch para sua Tarefa

Nunca trabalhe diretamente na `main` ou `develop`. Para cada nova funcionalidade (ex: "adicionar-novo-produto") ou correção (ex: "corrigir-bug-carrinho"), crie uma nova branch a partir da `develop`.

```bash
# 1. Garanta que sua branch 'develop' está atualizada
git checkout develop
git pull origin develop

# 2. Crie sua nova branch a partir da 'develop'
git checkout -b feature/adicionar-queijo-minas
```

### Passo 2: Fazer as Alterações

Agora, na sua nova branch (`feature/adicionar-queijo-minas`), faça todas as alterações necessárias: adicione o produto novo, ajuste o HTML, CSS, ou JavaScript.

### Passo 3: Enviar para o Ambiente de Desenvolvimento (Dev)

Quando terminar suas alterações, você precisa integrá-las na branch `develop`.

```bash
# 1. Adicione e comite suas alterações
git add .
git commit -m "feat: Adiciona o Queijo Minas como novo produto"

# 2. Envie sua branch para o GitHub
git push origin feature/adicionar-queijo-minas
```

Agora, vá para o GitHub e **crie um Pull Request (PR)** da sua branch (`feature/adicionar-queijo-minas`) para a branch `develop`.

- **Pull Request:** É um pedido para revisar e mesclar seu código. É uma ótima oportunidade para outra pessoa revisar as alterações.

Após o Pull Request ser aprovado e mesclado, as alterações estarão na branch `develop`. Neste momento, uma automação (GitHub Actions) irá publicar o conteúdo da branch `develop` no site de desenvolvimento.

**URL de Teste:** `https://granjarecantofeliz.com/dev/`

### Passo 4: Testar no Ambiente de Desenvolvimento

Acesse a URL de desenvolvimento e teste TUDO:
- A nova funcionalidade está funcionando como esperado?
- Nada que já existia quebrou?
- O site está funcionando bem em celulares e desktops?

Se encontrar um problema, volte para o Passo 2 na sua branch, corrija e repita o processo.

### Passo 5: Enviar para o Ambiente de Produção (Prod)

Se tudo estiver perfeito no ambiente de desenvolvimento, é hora de publicar para o site principal.

Vá para o GitHub e **crie um novo Pull Request**, desta vez da branch `develop` para a branch `main`.

- Este PR representa uma "versão" do site que foi testada e está pronta para ser lançada.

Após este Pull Request ser aprovado e mesclado, as automações do GitHub irão publicar o conteúdo da branch `main` no site principal.

**URL Final:** `https://granjarecantofeliz.com`

Parabéns, sua alteração está no ar para todos os clientes!

---

## ⚙️ 3. Configuração da Automação (GitHub Actions)

Para que a publicação seja automática, você precisará de dois arquivos de workflow na pasta `.github/workflows/` do seu projeto.

#### `deploy-dev.yml` (Publica em /dev/)

```yaml
name: Deploy to Development

on:
  push:
    branches:
      - develop

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3

      - name: Deploy to GitHub Pages 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages # A branch que o GitHub Pages usa para publicar
          folder: src # A pasta com os arquivos do seu site
          target-folder: dev # O subdiretório para o ambiente de dev
          clean: true # Limpa o diretório de destino antes de publicar
```

#### `deploy-prod.yml` (Publica na raiz do site)

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3

      - name: Deploy to GitHub Pages 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: src
          clean: true
```

**Importante:** Nas configurações do seu repositório no GitHub, em "Pages", certifique-se de que a fonte de publicação está configurada para a branch `gh-pages` e a pasta `/ (root)`.

---

## ✨ Resumo do Fluxo

1.  **Nova Tarefa?** Crie uma branch a partir da `develop`.
2.  **Terminou?** Faça um Pull Request para a `develop`.
3.  **Testou no /dev/?** Faça um Pull Request da `develop` para a `main`.
4.  **Pronto!** A alteração está em produção.

