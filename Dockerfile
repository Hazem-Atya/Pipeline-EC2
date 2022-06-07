FROM node:16-alpine
WORKDIR /app

COPY package*.json .


RUN npm install --only=production --force

COPY . .

RUN nest build

EXPOSE 3000

CMD node dist/main