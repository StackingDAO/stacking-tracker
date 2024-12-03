FROM --platform=linux/amd64 node:20.17.0 AS builder

USER node

RUN mkdir -p /home/node/app
RUN mkdir -p /home/node/.npm

WORKDIR /home/node/app

COPY --chown=node . .

RUN npm install 
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
