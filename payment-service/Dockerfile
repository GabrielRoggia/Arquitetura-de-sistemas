FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

RUN npx prisma generate

COPY entrypoint.sh .
COPY . .

EXPOSE 3000

ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "node", "src/server.js" ]