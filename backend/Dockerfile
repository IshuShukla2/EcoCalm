FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production || npm install --production

COPY . .

ENV NODE_ENV=production

EXPOSE 10000

CMD ["node", "server.js"]
