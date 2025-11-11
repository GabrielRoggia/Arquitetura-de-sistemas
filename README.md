# arq_si_ms

## Executar MongoDB local com Replica Set

O serviço de pedidos usa Prisma com MongoDB, então o banco precisa rodar em **replica set** (mesmo em ambiente local). O `docker-compose.yml` já inclui os containers necessários (`orders-db` e `orders-db-init`). Para iniciar:

1. Suba o banco:
   ```bash
   docker compose up -d orders-db
   ```
2. Execute o init uma vez (ele espera o Mongo ficar pronto, cria o replica set e encerra):
   ```bash
   docker compose up orders-db-init
   ```
3. Depois que o init terminar, suba os demais serviços normalmente:
   ```bash
   docker compose up -d cliente-service produto-service pagamentos-service pedidos-service notificacoes-service mongo-express
   ```

> Se precisar reiniciar tudo do zero, use `docker compose down mongo-express pedidos-service orders-db-init orders-db` e, opcionalmente, `docker volume rm arq_si_ms_orders_mongo_data` para limpar os dados antes de repetir os passos.

Com isso, o Prisma passa a criar pedidos usando o container Mongo local e o endpoint `POST /api/orders` retorna o `id` necessário para o fluxo de pagamentos.

## Serviço de Notificações

- Local: `./notificacoes`
- Endpoint principal: `POST /api/notifications/order-paid`
- Responsabilidade: receber eventos de pagamento aprovado e registrar/logar a notificação do cliente. O serviço consulta o `cliente-service` (quando o `userId` é informado) para personalizar a mensagem.

O serviço de pagamentos dispara automaticamente a notificação após atualizar o pedido para `PAGO`.
