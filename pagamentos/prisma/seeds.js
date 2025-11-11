const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeder de tipos de pagamento...');

  await prisma.typePayment.upsert({
    where: { name: 'PIX' },
    update: {},
    create: { name: 'PIX' },
  });

  await prisma.typePayment.upsert({
    where: { name: 'Boleto' },
    update: {},
    create: { name: 'Boleto' },
  });

  await prisma.typePayment.upsert({
    where: { name: 'Cartão de Crédito' },
    update: {},
    create: { name: 'Cartão de Crédito' },
  });

  console.log('Seeding de tipos de pagamento concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
