#!/bin/bash
set -e

echo "🚀 Subindo containers com Docker Compose..."
docker-compose up -d

echo "⏳ Aguardando Postgres iniciar..."
# Espera até a porta 5432 responder
until docker exec postgres_users_container pg_isready -U root > /dev/null 2>&1 && \
      docker exec postgres_products_container pg_isready -U root > /dev/null 2>&1; do
  sleep 2
done

echo "✅ Postgres está pronto!"

echo "📦 Rodando migrations do user-service..."
cd user-service
npx prisma migrate dev --name init
cd ..

echo "📦 Rodando migrations do product-service..."
cd product-service
npx prisma migrate dev --name init
cd ..

echo "✨ Migrations concluídas!"
