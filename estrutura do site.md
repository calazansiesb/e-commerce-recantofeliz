Estrutura AWS do Site https://www.granjarecantofeliz.com/ 
Visão Geral da Arquitetura
O site Granja Recanto Feliz está hospedado na AWS utilizando uma arquitetura moderna e escalável, seguindo as melhores práticas de segurança e performance. A infraestrutura está distribuída entre diferentes serviços AWS para garantir alta disponibilidade e experiência otimizada para os usuários.

Componentes Principais da Infraestrutura
1. CloudFront (CDN - Content Delivery Network)
Distribuição Principal (ID: E10QPOHV1RNFOA)

Domínio CloudFront: dai4oex7xmv6f.cloudfront.net
Domínios Atendidos: www.granjarecantofeliz.com  e granjarecantofeliz.com
Origem: Bucket S3 granjarecantofeliz-site
Recursos Habilitados:
HTTP/2 para melhor performance
IPv6 para compatibilidade moderna
Redirecionamento automático HTTP → HTTPS
Cache global para reduzir latência
Distribuição do Sistema (ID: E1XTMQ6QPLF7PD)

Domínio CloudFront: d3lm2uulba08yd.cloudfront.net
Domínio Atendido: sistema.granjarecantofeliz.com
Origem: Bucket S3 granja-relatorios-app
2. Route 53 (DNS)
Zona Hospedada (ID: Z04264973SYHQQ0HCEEYM)

Domínio Principal: granjarecantofeliz.com
Registros DNS Configurados:
www.granjarecantofeliz.com  → CloudFront
granjarecantofeliz.com → Endpoint S3
sistema.granjarecantofeliz.com → CloudFront
Registros de Email: MX, DMARC, DKIM para serviços de email
Validação SSL: Registros para validação dos certificados ACM
3. Amazon S3 (Armazenamento)
Bucket Principal: granjarecantofeliz-site

Região: sa-east-1 (São Paulo)
Configuração: Website estático habilitado
Função: Armazena todos os arquivos do site principal
Bucket do Sistema: granja-relatorios-app

Região: sa-east-1 (São Paulo)
Configuração: Website estático habilitado
Função: Armazena aplicação de relatórios/sistema
4. AWS Certificate Manager (ACM)
Certificados SSL/TLS:

Certificado Principal: Para www.granjarecantofeliz.com 
ARN: arn:aws:acm:us-east-1:311719320177:certificate/ada4aebf-f623-440c-8005-f83c43b37529
Certificado do Sistema: Para sistema.granjarecantofeliz.com
ARN: arn:aws:acm:us-east-1:311719320177:certificate/3f7a2a99-62da-4018-9c46-ef37a7843229
Fluxo de Funcionamento
Para o Site Principal:
Usuário acessa www.granjarecantofeliz.com 
Route 53 resolve o DNS para o CloudFront
CloudFront serve o conteúdo do cache global ou busca no S3
S3 fornece os arquivos estáticos (HTML, CSS, JS, imagens)
Certificado SSL garante conexão segura (HTTPS)
Para o Sistema:
Usuário acessa sistema.granjarecantofeliz.com
Processo similar mas direcionado para o bucket granja-relatorios-app
Benefícios da Arquitetura Atual
Performance:
CDN Global: CloudFront reduz latência mundial
Cache Inteligente: Conteúdo servido de pontos próximos aos usuários
HTTP/2: Protocolo moderno para carregamento mais rápido
Segurança:
HTTPS Obrigatório: Todas as conexões são criptografadas
Certificados Gerenciados: Renovação automática via ACM
Configurações de Email: SPF e DMARC para proteção contra spam
Escalabilidade:
S3: Armazenamento praticamente ilimitado
CloudFront: Suporta picos de tráfego automaticamente
Route 53: DNS altamente disponível
Custo-Efetivo:
Hospedagem Estática: Menor custo que servidores tradicionais
Pay-as-you-use: Paga apenas pelo que consome
Região Local: sa-east-1 reduz custos de transferência no Brasil
Localização Geográfica
Região Principal: sa-east-1 (São Paulo, Brasil)
CloudFront: Global (pontos de presença mundiais)
ACM: us-east-1 (padrão AWS para certificados globais)
Esta arquitetura garante que o site da Granja Recanto Feliz tenha excelente performance, segurança robusta e alta disponibilidade para todos os visitantes.




