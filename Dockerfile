# Stage 1: Build the application
FROM --platform=linux/amd64 node:20.12-alpine AS builder

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node package.json package-lock.json ./
COPY --chown=node apps/stacks-listener/package.json apps/stacks-listener/
COPY --chown=node . .

# Install dependencies and build the application
RUN npm install 
RUN npm run build --workspace=apps/stacks-listener

# Stage 2: Run the application
FROM --platform=linux/amd64 node:20.12-alpine

USER node

WORKDIR /home/node/app

# Copy the necessary files from the builder stage
COPY --from=builder --chown=node /home/node/app/node_modules ./node_modules
COPY --from=builder --chown=node /home/node/app/apps/stacks-listener/dist ./dist
COPY --from=builder --chown=node /home/node/app/apps/stacks-listener/package.json .

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]