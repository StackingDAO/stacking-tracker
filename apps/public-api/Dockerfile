FROM --platform=linux/amd64 node:20.12-alpine AS builder

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node ../../ .

RUN npm install --workspace=packages/database
RUN npm run build --workspace=packages/database

RUN npm install --workspace=packages/stacks
RUN npm run build --workspace=packages/stacks

RUN npm install --workspace=apps/public-api
RUN npm run build --workspace=apps/public-api

WORKDIR /home/node/app/apps/public-api

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
