# E-commerce Recanto Feliz

Este projeto é um site de vendas online para a Granja Recanto Feliz, com entregas no Jardim Botânico, Lago Sul, Brasília DF, ou retirada em pontos de parceiros.

## Estrutura
- Página inicial
- Listagem de produtos
- Carrinho de compras
- Checkout
- Contato

## Como usar
Veja o guia em `docs/guia-publicacao.md` para publicar e configurar o site.

## Testar localmente (VS Code)

1. Abra a pasta `e-commerce-recantofeliz` no VS Code.
2. Pressione Ctrl+Shift+B ou abra o palette (Ctrl+Shift+P) e execute `Tasks: Run Task` -> `Start Local Server`.
3. O servidor iniciará na pasta `src` e estará disponível em `http://localhost:8080/index.html`.

Se preferir rodar manualmente no terminal:

```bash
cd e-commerce-recantofeliz/src
python -m http.server 8080
```

Acesse `http://localhost:8080/index.html` no navegador.
