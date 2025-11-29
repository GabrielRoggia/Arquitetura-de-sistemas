# Coleção de Requisições - E-Commerce Microservices

## 🧑 CLIENTES (Cliente Service - Porta 3001)

### 1. Criar Cliente
```
POST http://localhost:3001/api/clients
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "cpf": "12345678900",
  "address": "Rua A, 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567"
}
```

### 2. Listar Todos os Clientes
```
GET http://localhost:3001/api/clients
```

### 3. Obter Cliente por ID
```
GET http://localhost:3001/api/clients/1
```

### 4. Atualizar Cliente
```
PATCH http://localhost:3001/api/clients/1
Content-Type: application/json

{
  "name": "João Silva Updated",
  "phone": "11988888888"
}
```

### 5. Deletar Cliente
```
DELETE http://localhost:3001/api/clients/1
```

---

## 📦 PRODUTOS (Produto Service - Porta 3002)

### 1. Criar Produto
```
POST http://localhost:3002/api/products
Content-Type: application/json

{
  "name": "Notebook Dell",
  "description": "Notebook Dell com processador Intel i7",
  "price": 3500.00,
  "stock": 10,
  "category": "Eletrônicos"
}
```

### 2. Listar Todos os Produtos
```
GET http://localhost:3002/api/products
```

### 3. Obter Produto por ID
```
GET http://localhost:3002/api/products/1
```

### 4. Atualizar Produto
```
PATCH http://localhost:3002/api/products/1
Content-Type: application/json

{
  "name": "Notebook Dell i7",
  "price": 3800.00
}
```

### 5. Atualizar Estoque do Produto
```
PATCH http://localhost:3002/api/products/1/stock
Content-Type: application/json

{
  "stock": 15
}
```

### 6. Deletar Produto
```
DELETE http://localhost:3002/api/products/1
```

---

## 📋 PEDIDOS (Pedidos Service - Porta 3003)

### 1. Criar Pedido
```
POST http://localhost:3003/api/orders
Content-Type: application/json

{
  "clientName": "João Silva",
  "clientEmail": "joao@email.com",
  "items": [
    {
      "productId": "1",
      "quantity": 2,
      "price": 3500.00
    }
  ],
  "totalValue": 7000.00,
  "shippingAddress": "Rua A, 123",
  "status": "PENDENTE"
}
```

### 2. Listar Todos os Pedidos
```
GET http://localhost:3003/api/orders
```

### 3. Obter Pedido por ID
```
GET http://localhost:3003/api/orders/507f1f77bcf86cd799439011
```

### 4. Atualizar Status do Pedido
```
PATCH http://localhost:3003/api/orders/507f1f77bcf86cd799439011/status
Content-Type: application/json

{
  "status": "PAGO"
}
```

---

## 💳 PAGAMENTOS (Pagamentos Service - Porta 3004)

### 1. Criar Tipo de Pagamento
```
POST http://localhost:3004/api/type-payments
Content-Type: application/json

{
  "name": "Cartão de Crédito"
}
```

### 2. Listar Todos os Tipos de Pagamento
```
GET http://localhost:3004/api/type-payments
```

### 3. Criar Pagamento
```
POST http://localhost:3004/api/payments
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011",
  "value": 3500.00,
  "typePaymentId": 1
}
```

### 4. Processar Pagamento (Importante - Dispara evento RabbitMQ!)
```
PATCH http://localhost:3004/api/payments/1/process
Content-Type: application/json

{
  "value": 3500.00
}
```

### 5. Obter Pagamentos de um Pedido
```
GET http://localhost:3004/api/payments/order/507f1f77bcf86cd799439011
```

---

## 📧 NOTIFICAÇÕES (Notificações Service - Porta 3005)

### 1. Enviar Notificação de Pedido Pago
```
POST http://localhost:3005/api/notifications/order-paid
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011",
  "userId": "1",
  "totalValue": 7000.00
}
```

**Nota**: Este endpoint normalmente é chamado automaticamente pelo RabbitMQ consumer, mas pode ser testado manualmente também.

---

## 🧪 FLUXO DE TESTE RECOMENDADO

1. **Criar um Cliente** (Clientes - POST)
   - Guarde o ID retornado

2. **Criar Produtos** (Produtos - POST)
   - Guarde os IDs dos produtos retornados

3. **Criar um Pedido** (Pedidos - POST)
   - Use o clientName do cliente criado
   - Use os IDs dos produtos

4. **Criar Tipo de Pagamento** (Pagamentos - POST type-payments)
   - Guarde o ID retornado

5. **Criar um Pagamento** (Pagamentos - POST payments)
   - Use o orderId do pedido criado
   - Use o typePaymentId do tipo de pagamento

6. **Processar o Pagamento** (Pagamentos - PATCH payments/:id/process)
   - Isto vai disparar um evento no RabbitMQ
   - O notification-service consumer vai receber a mensagem
   - Verifique os logs do notification-service para ver a mensagem simulada

---

## 📌 VARIÁVEIS DO INSOMNIA

Você pode usar estas variáveis ao importar a collection:

```
base_url = http://localhost
cliente_url = http://localhost:3001
produto_url = http://localhost:3002
orders_url = http://localhost:3003
pagamentos_url = http://localhost:3004
notificacoes_url = http://localhost:3005
```

---

## 🔧 COMO IMPORTAR NO INSOMNIA

1. Abra o Insomnia
2. Clique em "Create" → "Import from file"
3. Selecione o arquivo `insomnia_collection.json`
4. A coleção será importada com todos os folders e requisições
5. Configure as variáveis de ambiente se necessário

---

## 🐳 DOCKER COMPOSE

Se estiver usando Docker Compose, certifique-se de que todos os serviços estão rodando:

```bash
docker-compose up -d
```

Todos os serviços estarão disponíveis nas portas configuradas.
