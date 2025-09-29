const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado com sucesso ao order-service.');
  } catch (error) {
    console.error('Erro ao conectar com o MongoDB:', error.message);
    // Encerra o processo com falha
    process.exit(1);
  }
};

module.exports = connectDB;
