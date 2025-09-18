# Guia Rápido: Comandos de Inicialização do Microserviço

Este arquivo contém todos os comandos necessários para configurar e executar o microserviço de usuários em um ambiente de desenvolvimento local após clonar o repositório.

## Pré-requisitos

Antes de executar os comandos, garanta que você tenha os seguintes softwares instalados e rodando em sua máquina:
- **Node.js** e **NPM**
- **Docker** e **Docker Compose**
- **Git**

---

## Passos para Execução
entre na pasta do projeto:
cd user-service

Execute os seguintes comandos no seu terminal, na ordem apresentada.

**1. Instale todas as dependências do Node.js:**
```bash
npm install
```

**2. Crie o arquivo de variáveis de ambiente:**
(Este comando copia o arquivo de exemplo para criar seu arquivo `.env` local)
```bash
# Para Linux ou macOS
cp .env.example .env

# Para Windows (usando o Command Prompt)
copy .env.example .env
```

**3. Inicie o contêiner do banco de dados com Docker:**
(Este comando precisa ser executado na pasta onde o arquivo `docker-compose.yml` está localizado)
```bash
docker-compose up -d
```

**4. Aplique as migrações para criar as tabelas no banco de dados:**
(Aguarde alguns segundos após o comando anterior para garantir que o banco de dados esteja pronto para aceitar conexões)
```bash
npx prisma migrate dev
```

**5. Inicie o servidor da aplicação em modo de desenvolvimento:**
```bash
npm start
```

Após o último comando, o terminal deverá exibir uma mensagem de confirmação e o microserviço estará rodando e pronto para receber requisições em `http://localhost:3000`.
