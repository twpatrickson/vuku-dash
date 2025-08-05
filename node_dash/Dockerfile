FROM nginx:1.29.0-alpine3.22-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 80

CMD ["node", "server.js"]

