FROM node:24-alpine


WORKDIR /admin

COPY package*.json ./

RUN npm install

COPY . ./src

EXPOSE 3003

CMD ["npm", "start"]