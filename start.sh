#!/bin/bash
# Encerra o script se qualquer comando falhar
set -e

echo "🚀 Subindo containers com Docker Compose..."
docker-compose up -d

echo "⏳ Aguardando containers Postgres iniciarem..."
# Espera até que todos os containers do Postgres estejam prontos
until docker exec postgres_users_container pg_isready -U root > /dev/null 2>&1 && \
      docker exec postgres_products_container pg_isready -U root > /dev/null 2>&1 && \
      docker exec postgres_payments_container pg_isready -U root > /dev/null 2>&1; do
  sleep 2
done
echo "✅ Postgres está pronto!"

echo "⏳ Aguardando container MongoDB iniciar..."
# Espera até que o MongoDB esteja pronto, enviando um comando 'ping'
until docker exec mongo_orders_container mongo --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; do
    sleep 2
done
echo "✅ MongoDB está pronto!"

echo "📦 Rodando migrations..."

# Migration para user-service
echo "   -> user-service"
cd user-service
npx prisma migrate dev --name init
cd ..

# Migration para product-service
echo "   -> product-service"
cd product-service
npx prisma migrate dev --name init
cd ..

# Migration para payment-service
echo "   -> payment-service"
cd payment-service
npx prisma migrate dev --name init
cd ..

echo "✨ Processo concluído com sucesso!"