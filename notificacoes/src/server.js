const express = require('express');
const router = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Serviço de notificações rodando na porta ${PORT}`);
});
