# E-Commerce Microservices — README

Este repositório contém um conjunto de microserviços para um e-commerce (Clientes, Produtos, Pedidos, Pagamentos e Notificações) preparados para rodar via Docker Compose ou localmente para desenvolvimento.

## Serviços e portas (padrão do docker-compose)
- `cliente-service` — `http://localhost:3001` (Clientes)
- `produto-service` — `http://localhost:3002` (Produtos)
- `pedidos-service` — `http://localhost:3003` (Pedidos)
- `pagamentos-service` — `http://localhost:3004` (Pagamentos)
- `notificacoes-service` — `http://localhost:3005` (Notificações)
- RabbitMQ Management UI: `http://localhost:15672` (usuário: `user` / senha: `password`)

## Requisitos
- Docker 20+ e Docker Compose
- Node.js 18+ (se for rodar serviços localmente)
- npm

## Variáveis de ambiente importantes
- `RABBITMQ_URL` — URL de conexão com RabbitMQ (ex.: `amqp://user:password@rabbitmq:5672`)
- `DATABASE_URL` — URL do banco (cada serviço que usa Prisma define a sua própria variável no `docker-compose`)
- Arquivo de exemplo de variáveis: `.env` (já presente para `pedidos` MongoDB nesse projeto)

## Rodando com Docker Compose (recomendado)
Este repositório já contém um `docker-compose.yml` configurado com bancos, serviços e RabbitMQ.

1. Construir e subir tudo:

```bash
docker-compose up --build -d
```

2. Verificar logs:

```bash
docker-compose logs -f pagamentos-service
docker-compose logs -f notificacoes-service
docker-compose logs -f rabbitmq
```

3. Parar e remover:

```bash
docker-compose down
```

Observações:
- O `docker-compose.yml` já executa as migrations e seeds (quando aplicável) nas definições `command` de cada serviço.
- RabbitMQ já está configurado no compose com usuário `user` e senha `password`.

## Rodando localmente (desenvolvimento)
Exemplo para rodar o `pagamentos` e `notificacoes` localmente (outros serviços seguem padrão similar):

1. Abra um terminal e instale dependências:

```bash
cd pagamentos
npm install
```

2. Rodar migrações e seed (quando aplicável) e iniciar:

```bash
# Executar migrations (Prisma) e iniciar:
npx prisma migrate deploy
npx prisma db seed # se houver seed
npm start
```

3. Para `notificacoes`:

```bash
cd notificacoes
npm install
npm start
```

Importante: para que os serviços locais se comuniquem com outros serviços via Docker (ex.: `pedidos-service` rodando em container), use as URLs corretas (ex.: `http://localhost:3003` para pedidos) ou rode todos via Docker Compose para facilitar resolução de nomes (ex.: `pedidos-service:3003`).

## RabbitMQ — como funciona aqui
- Exchange: `orders` (type `topic`)
- Routing key usada para pagamento: `order.paid`
- Queue criada para notificações: `notification.order-paid` (binding `orders` -> `notification.order-paid` com `order.paid`)
- `pagamentos-service` publica eventos quando um pagamento é aprovado (evento contém `orderId`, `clientName`, `timestamp`).
- `notificacoes-service` consome e apenas simula envio imprimindo no console:

```
📧 NOTIFICAÇÃO ENVIADA:
{clientName}, seu pedido foi PAGO com sucesso e será despachado em breve.
```

## Testes e uso manual (Insomnia / Postman)
Há um arquivo pronto para importar no Insomnia: `insomnia_collection.json` na raiz do repositório. Ele contém todas as requisições para os endpoints de cada serviço.

Fluxo de teste recomendado (End-to-End):
1. Criar cliente (`POST /api/clients` no serviço `cliente-service`)
2. Criar produtos (`POST /api/products` no `produto-service`)
3. Criar pedido (`POST /api/orders` no `pedidos-service`)
4. Criar tipo de pagamento (`POST /api/type-payments` no `pagamentos-service`)
5. Criar pagamento (`POST /api/payments` no `pagamentos-service`) — referenciando `orderId`
6. Processar pagamento (`PATCH /api/payments/:id/process`) — quando aprovado, publica evento no RabbitMQ e o `notificacoes-service` exibirá a mensagem nos logs

Exemplo de processamento do pagamento via curl:

```bash
curl -X PATCH http://localhost:3004/api/payments/1/process \
  -H "Content-Type: application/json" \
  -d '{"value": 3500.00}'
```

## Arquivos importantes
- `docker-compose.yml` — orquestração de containers (bancos, RabbitMQ e serviços)
- `insomnia_collection.json` — coleção para importar no Insomnia
- `REQISICOES.md` / `README_TESTES.md` — guias rápidos de uso (também gerados)
- `pagamentos/src/rabbitmq/producer.js` — produtor RabbitMQ
- `notificacoes/src/rabbitmq/consumer.js` — consumidor RabbitMQ

## Troubleshooting rápido
- RabbitMQ não conecta: verifique `docker-compose ps` e `docker-compose logs rabbitmq`
- Consumer não recebe mensagens: verifique logs do `notificacoes-service` e a fila no management UI `http://localhost:15672`
- Erro de migrations: confira se o `DATABASE_URL` está correto e se o banco está acessível

## Contribuição
Sinta-se à vontade para abrir issues ou PRs. Para desenvolvimento local, prefira rodar serviços isoladamente durante o desenvolvimento e usar `docker-compose` para testes de integração.

---

Se quiser, posso:
- Adicionar instruções de como rodar cada serviço em modo `dev` com `nodemon`,
- Gerar scripts `Makefile` ou `scripts` no `package.json` para facilitar comandos repetidos,
- Commitar e criar um branch com estas alterações.

Diga qual opção prefere que eu prossiga.
