require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Order microservice is running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
  });
};

startServer();