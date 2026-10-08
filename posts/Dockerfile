FROM node:24-alpine


WORKDIR /comments

COPY package*.json ./

COPY ./prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY . ./src

EXPOSE 3001

CMD ["npm", "start"]