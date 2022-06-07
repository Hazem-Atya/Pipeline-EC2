FROM node:16.14.0-alpine
WORKDIR /app

COPY package*.json .


# RUN npm install --only=production --force
RUN npm install 

COPY . .
RUN npm i -g @nestjs/cli
RUN nest build

EXPOSE  3000

CMD node dist/main