FROM --platform=linux/amd64 node:20.12-alpine AS builder

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node . .

RUN npm install 
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
