## Roadmap: Implementação mínima — salvar `produtos.json` a partir do admin

Objetivo: permitir que o admin salve alterações nos produtos de forma simples e segura, mantendo o site estático para o cliente final. Inclui backup automático e instruções para remover o SQL.js/SQLite do fluxo atual.

Checklist rápida
- [ ] Criar endpoint web mínimo (ex.: Flask) POST /admin/save-products
- [ ] Proteger rota com token/senha simples (env var) e CORS restrito
- [ ] Atualizar `admin.html` / `src/js/admin.js` para enviar `fetch` POST no salvamento; fallback para localStorage
- [ ] Fazer backup automático do `produtos.json` (timestamped) a cada gravação
- [ ] Opcional: adicionar commit Git automático ou registro de versão
- [ ] Testar fluxo: editar → salvar → site reflete alterações
- [ ] Limpar/inativar SQL.js/SQLite do client-side

Pré-requisitos
- Python 3.8+ (ou Node/PHP, aqui mostramos Flask como exemplo)
- Acesso ao servidor onde o site está hospedado (capaz de escrever em `src/data/`)

1) Estrutura mínima do backend (Flask)

Crie um arquivo `admin-save.py` no servidor (mesma pasta do site ou em um serviço separado). Exemplo mínimo:

```python
from flask import Flask, request, jsonify
from pathlib import Path
import os, time, json

app = Flask(__name__)
DATA_FILE = Path(__file__).parent / 'src' / 'data' / 'produtos.json'
BACKUP_DIR = Path(__file__).parent / 'backups'
BACKUP_DIR.mkdir(exist_ok=True)

ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'troque_esta_senha_local')

def make_backup():
    ts = time.strftime('%Y%m%d-%H%M%S')
    dst = BACKUP_DIR / f'produtos-{ts}.json'
    dst.write_bytes(DATA_FILE.read_bytes())

@app.route('/admin/save-products', methods=['POST'])
def save_products():
    token = request.headers.get('X-Admin-Token') or request.args.get('token')
    if token != ADMIN_TOKEN:
        return jsonify({'error': 'unauthorized'}), 401

    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({'error': 'invalid payload'}), 400

    make_backup()
    DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2))

    # opcional: executar `git add` + `git commit` aqui (cuidado com permissões)
    return jsonify({'ok': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

Comandos de deploy (exemplo com venv):

```bash
python -m venv .venv
source .venv/bin/activate
pip install flask
export ADMIN_TOKEN='minha-senha-secreta'
python admin-save.py
```

2) Segurança e CORS
- Use `ADMIN_TOKEN` por variável de ambiente; não codifique a senha no repositório.
- Limite CORS se necessário (ex.: apenas o domínio do admin). Em Flask use `flask-cors` ou verifique `Origin` manualmente.

3) Integração no `admin` (frontend)

- Substituir a rotina de gravação que usa `localStorage` por um `fetch` POST para `/admin/save-products` enviando JSON. Exemplo curto:

```js
// ...existing code...
const token = 'COLOQUE_O_TOKEN_AQUI_OU_BUSQUE_DE_UM_PROMPT_SEGUR0';
fetch('/admin/save-products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
  body: JSON.stringify(productsArray)
}).then(r => r.json()).then(res => {
  if (res.ok) { /* sucesso: atualizar UI */ }
}).catch(err => {
  // fallback: salvar em localStorage
  localStorage.setItem('produtos', JSON.stringify(productsArray))
});
```

- Recomendação: ao carregar a página admin, leia primeiro do servidor (GET `/src/data/produtos.json`) para mostrar versão atual. Ao salvar, enviar para o endpoint.

4) Backup automático e versionamento (prático)
- A função `make_backup()` no exemplo já cria `backups/produtos-YYYYMMDD-HHMMSS.json`.
- Opcional: adicionar um commit automático:

```bash
git add src/data/produtos.json
git commit -m "Atualiza produtos: $(date +'%Y-%m-%d %H:%M:%S')"
```

Mas atenção: commits automáticos exigem que o processo tenha permissão e que crie configurações de usuário para o git no servidor.

5) Testes básicos (fluxo)
- No admin: editar produto → clicar salvar
- Verificar resposta 200/ok do endpoint
- Confirmar que `src/data/produtos.json` foi atualizado (via SSH/FTP ou GET `/src/data/produtos.json` no navegador)
- Abrir `index.html` do site e recarregar cache (Ctrl+F5) para confirmar que valores novos aparecem

6) Rollback simples
- Restaurar backup manualmente copiando um dos arquivos de `backups/` para `src/data/produtos.json` e recarregar o site.

7) Limpar/inativar SQL.js / SQLite do client-side
- Remover as tags `<script>` que carregam `sql-wasm.js` / `sqlite-manager.js` de `src/admin.html` e de outras páginas administrativas.
- Mover os arquivos JS relacionados a SQL.js para `archive/` ou `src/js/_disabled_sqljs/` para referência futura.
- Remover chamadas no código que preferem `SQLiteManager` como fonte primária; padronizar `DataManager`/`fetch('/src/data/produtos.json')` como fonte canônica.
- Testar admin com apenas JSON + endpoint para garantir que tudo funciona antes de deletar arquivos.

8) Migração futura (opcional)
- Se precisar de transações, concorrência multi‑usuário ou consultas mais ricas, implemente SQLite no servidor e exponha endpoints REST (GET /products, POST /products/:id, etc.).
- Mantenha um endpoint de export para JSON para permitir rollback e compatibilidade com o site estático.

9) Notas operacionais
- Não exponha o endpoint sem autenticação. Para produção, use HTTPS e considere o uso de autenticação mais robusta (JWT, Basic Auth + TLS).
- Tenha cuidado com permissões: o processo web precisa de permissão de escrita em `src/data/` e `backups/`.

---

Se quiser, eu implemento:
- o `admin-save.py` pronto no repositório,
- a alteração em `src/js/admin.js` para usar o `fetch` com fallback,
- um pequeno script de backup/commit e instruções de deploy.

Escolha: eu crio os arquivos e testo localmente (Flask) ou prefieres que eu só gere os trechos e instruções para você aplicar manualmente.
