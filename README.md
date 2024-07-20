# Stacking Tracker

This web application and back-end builds a Stacking tracker for all PoX/Signer/Miner infrastructure needs on Stacks.

The development of this application is supported by a critical bountry from the Stacks foundation, see https://github.com/stacksgov/critical-bounties/issues/28

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

**Credentials**

Create a `.env` file similar to `.env.example` in `/cdk`

Run `aws configure`. The `access_key_id` and `secret_access_key` can be found via AWS IAM console. Output format should be set to `json`.

This should create 2 files:

- ~/.aws/credentials

- ~/.aws/config

**Deploy**

Test docker build:

- `docker build -t stacking-tracker .`

Setup domain:

- The domain and hosted zone should be set up in AWS manually.

Deploy setup:

1.  Bootstrap: `cdk bootstrap`
2.  Deploy setup: `cdk deploy Setup`

Setup Database:

1.  Get the database url from AWS, add to `.env` in `/packages/database`
2.  In `/packages/database` run `npm db:generate`
3.  In `/packages/database` run `npm db:push`

Deploy Services:

1.  `cdk deploy StacksListener`
2.  `cdk deploy PublicApi`
3.  `cdk deploy Web`
4.  `cdk deploy Lambdas`

Setup CloudFront:

1.  Deploy CloudFront: `cdk deploy CloudFront`
2.  If a new hosted zone is created, we need to manually copy the NS servers from the created hosted zone to our registered domain while deploying.
3.  Once deployed, edit the CloudFront distribution origin and link to the correct load balancer (services should be deployed)

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

**CDK**

- `cdk bootstrap`

- `cdk deploy`

- `cdk destroy`

**Drizzle**

- `npx drizzle-kit studio`
