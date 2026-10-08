FROM node:24-alpine


WORKDIR /comments

COPY package*.json ./

COPY ./prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY . ./src

EXPOSE 3002

CMD ["npm", "start"]