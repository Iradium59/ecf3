FROM node:14-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

EXPOSE ${REACT_APP_PORT}

CMD ["node", "server.js"]