# Stacking Tracker

This web application and back-end builds a Stacking tracker for all PoX/Signer/Miner infrastructure needs on Stacks.

The development of this application is supported by a critical bounty from the Stacks foundation, see https://github.com/stacksgov/critical-bounties/issues/28

# Website

Next.JS

See `package.json` for available commands.

# AWS Infrastructure

## Install

**AWS CLI**

https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

**AWS CDK**

https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html

`npm install -g aws-cdk`

## Setup

**Domain**
The domain should be set up in AWS manually.

**Credentials**

Create a `.env` file similar to `.env.example` in `/cdk`

Run `aws configure`. The `access_key_id` and `secret_access_key` can be found via AWS IAM console. Output format should be set to `json`.

This should create 2 files:

- ~/.aws/credentials

- ~/.aws/config

**Deploy**

Test docker build:

- `docker build -t stacking-tracker .`

Bootstrap CDK:

1. Run: `cdk bootstrap`

Setup CloudFront and Certificate:

1.  `cdk deploy CloudFront`
2.  Update vars `CDK_AWS_CERTIFICATE_ARN` and `CDK_AWS_HOSTEDZONE_ID` in `/cdk/.env`

Deploy Architecture:

1.  `cdk deploy Queues`
2.  `cdk deploy Vpc`
3.  `cdk deploy Database`
4.  `cdk deploy Cluster`

Setup Database:

1.  Get the database url from AWS Secrets Manager, update var `DATABASE_URL` in `/cdk/.env` and `/packages/database`
2.  In `/packages/database` run `npm run db:generate`
3.  In `/packages/database` run `npm run db:push`

Deploy Services:

1.  `cdk deploy StacksListener`
2.  `cdk deploy PublicApi`
3.  `cdk deploy Web`
4.  `cdk deploy Lambdas`

## Local Setup

**Local Postgresql on Mac OS**

Needed to run tests.

- `brew install postgresql`

- `brew services start postgresql`

- `psql postgres`

- `CREATE ROLE test WITH LOGIN PASSWORD 'test';`

- `CREATE DATABASE tracker_test;`

- `GRANT ALL PRIVILEGES ON DATABASE tracker_test TO test;`

**Environment Variables**

Create a `.env` file similar to `.env.example` in:

- /cdk

- /apps/functions

- /apps/stacks-listener

- /packages/database

- /packages/stacks

## Commands

**Lambda Scripts**

- `ts-node signer-processor.ts run`

**CDK**

- `cdk bootstrap`

- `cdk deploy`

- `cdk destroy`

**Drizzle**

- `npx drizzle-kit studio`

# Telegram Bot

Create bot via BotFather chat.

## Set Webhook

Use ngrok to set up tunnel to local machine: `ngrok http 3030`

`curl -X POST "https://api.telegram.org/bot{{botid}}/setWebhook" -d "url=https://5.ngrok-free.app/telegram"`
`curl -X POST "https://api.telegram.org/bot{{botid}}/getWebhookInfo"`
`curl -X POST "https://api.telegram.org/bot{{botid}}/deleteWebhook"`
