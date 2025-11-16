# 🧪 Guia de Testes - E-Commerce Microservices

## 📋 Resumo das Requisições

### Clientes (3001) - 5 endpoints
- POST `/api/clients` - Criar cliente
- GET `/api/clients` - Listar clientes
- GET `/api/clients/:id` - Obter cliente
- PATCH `/api/clients/:id` - Atualizar cliente
- DELETE `/api/clients/:id` - Deletar cliente

### Produtos (3002) - 6 endpoints
- POST `/api/products` - Criar produto
- GET `/api/products` - Listar produtos
- GET `/api/products/:id` - Obter produto
- PATCH `/api/products/:id` - Atualizar produto
- PATCH `/api/products/:id/stock` - Atualizar estoque
- DELETE `/api/products/:id` - Deletar produto

### Pedidos (3003) - 4 endpoints
- POST `/api/orders` - Criar pedido
- GET `/api/orders` - Listar pedidos
- GET `/api/orders/:id` - Obter pedido
- PATCH `/api/orders/:id/status` - Atualizar status

### Pagamentos (3004) - 5 endpoints
- POST `/api/type-payments` - Criar tipo de pagamento
- GET `/api/type-payments` - Listar tipos de pagamento
- POST `/api/payments` - Criar pagamento
- PATCH `/api/payments/:id/process` - **Processar pagamento (dispara RabbitMQ)**
- GET `/api/payments/order/:orderId` - Obter pagamentos do pedido

### Notificações (3005) - 1 endpoint
- POST `/api/notifications/order-paid` - Receber notificação (via RabbitMQ consumer)

**Total: 21 endpoints**

---

## 🎯 Fluxo Completo de Teste (Integração End-to-End)

### Passo 1: Criar Cliente
```bash
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "cpf": "12345678900",
    "address": "Rua A, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  }'
```

### Passo 2: Criar Produto
```bash
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell",
    "description": "Notebook Dell com processador Intel i7",
    "price": 3500.00,
    "stock": 10,
    "category": "Eletrônicos"
  }'
```

### Passo 3: Criar Pedido
```bash
curl -X POST http://localhost:3003/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "João Silva",
    "clientEmail": "joao@email.com",
    "items": [
      {
        "productId": "1",
        "quantity": 1,
        "price": 3500.00
      }
    ],
    "totalValue": 3500.00,
    "shippingAddress": "Rua A, 123",
    "status": "PENDENTE"
  }'
```

### Passo 4: Criar Tipo de Pagamento
```bash
curl -X POST http://localhost:3004/api/type-payments \
  -H "Content-Type: application/json" \
  -d '{"name": "Cartão de Crédito"}'
```

### Passo 5: Criar Pagamento
```bash
curl -X POST http://localhost:3004/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "SUBSTITUA_COM_O_ID_DO_PEDIDO",
    "value": 3500.00,
    "typePaymentId": 1
  }'
```

### Passo 6: Processar Pagamento (⭐ Dispara RabbitMQ)
```bash
curl -X PATCH http://localhost:3004/api/payments/1/process \
  -H "Content-Type: application/json" \
  -d '{"value": 3500.00}'
```

**Resultado esperado:**
- O payment-service publica um evento no RabbitMQ
- O notification-service consumer recebe a mensagem
- Aparece nos logs do notification-service:
  ```
  📧 NOTIFICAÇÃO ENVIADA:
  João Silva, seu pedido foi PAGO com sucesso e será despachado em breve.
  ```

---

## 🚀 Comandos Docker Úteis

### Iniciar todos os serviços
```bash
docker-compose up -d
```

### Ver logs de um serviço específico
```bash
docker-compose logs -f notificacoes-service
docker-compose logs -f pagamentos-service
```

### Ver logs do RabbitMQ
```bash
docker-compose logs -f rabbitmq
```

### Acessar UI do RabbitMQ
```
http://localhost:15672
Usuário: user
Senha: password
```

### Parar todos os serviços
```bash
docker-compose down
```

---

## 📊 Arquivos de Requisições Disponíveis

- **insomnia_collection.json** - Importar no Insomnia
- **REQUISICOES.md** - Documentação detalhada com exemplos
- **README_TESTES.md** - Este arquivo

---

## ✅ Checklist de Testes

- [ ] Cliente criado com sucesso
- [ ] Produto criado com sucesso
- [ ] Pedido criado com sucesso
- [ ] Tipo de pagamento criado com sucesso
- [ ] Pagamento criado com sucesso
- [ ] Pagamento processado com sucesso
- [ ] RabbitMQ publicou mensagem
- [ ] Notification-service consumiu mensagem
- [ ] Log de notificação apareceu no console

---

## 🐛 Troubleshooting

### RabbitMQ não está conectando
- Verifique se o container RabbitMQ está rodando: `docker-compose ps`
- Verifique logs: `docker-compose logs rabbitmq`
- Reinicie o serviço: `docker-compose restart rabbitmq`

### Notification-service não recebe mensagens
- Verifique se está conectado ao RabbitMQ: `docker-compose logs notificacoes-service`
- Verifique a fila no RabbitMQ Management: http://localhost:15672
- Verifique se o exchange e binding estão criados

### Erro na requisição
- Certifique-se de que o serviço está rodando na porta correta
- Verifique se o IDs utilizados (cliente, produto, tipo pagamento) existem
- Verifique o formato JSON das requisições

