-- Granja Recanto Feliz - Estrutura do Banco SQLite
-- Seguindo o roadmap: Fase 1 - Desenvolvimento Local

CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    slogan TEXT,
    descricao TEXT,
    preco REAL NOT NULL,
    estoque INTEGER DEFAULT 0,
    imagem TEXT,
    ativo BOOLEAN DEFAULT 1,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados iniciais
INSERT INTO produtos (id, nome, categoria, slogan, descricao, preco, estoque, imagem) VALUES
(1, 'Substrato BioFértil 3 Anos', 'fertilizantes', 'Mais do que Adubo: um substrato vivo e completo.', 'Com um processo de maturação de 3 anos, nosso substrato é uma terra viva e completa, rica em matéria orgânica e microrganismos benéficos.', 40.00, 25, 'imagens/produtos/1/1.png'),
(2, 'FertiGota', 'fertilizantes', 'Adubo de galinha líquido e potente.', 'Nosso fertilizante líquido é produzido através de um processo de biodigestor anaeróbico, transformando dejetos de galinha em um adubo rico em nutrientes e de fácil absorção pelas plantas.', 25.00, 40, 'imagens/produtos/2/1.png'),
(3, 'Ovos Caipira 10', 'ovos', '10 ovos frescos da granja.', 'Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 10 unidades.', 18.00, 120, 'imagens/produtos/3/1.jpeg'),
(4, 'Ovos Caipira 20', 'ovos', '20 ovos frescos da granja.', 'Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 20 unidades.', 30.00, 80, 'imagens/produtos/4/1.jpeg'),
(5, 'Ovos Caipira 30', 'ovos', '30 ovos frescos da granja.', 'Ovos caipira selecionados, direto da granja para sua mesa. Embalagem com 30 unidades.', 45.00, 50, 'imagens/produtos/5/1.png'),
(6, 'Galinha Caipira Picada', 'aves', 'Galinha caipira cortada, pronta para cozinhar.', 'Galinha caipira picada, sabor autêntico da roça. Ideal para receitas tradicionais.', 60.00, 15, 'imagens/produtos/6/1.png'),
(7, 'Galinha Caipira Inteira', 'aves', 'Galinha caipira inteira, fresca e saborosa.', 'Galinha caipira inteira, criada solta e alimentada naturalmente. Perfeita para assados e cozidos.', 110.00, 8, 'imagens/produtos/7/1.png');