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
Run `aws configure`. The `access_key_id` and `secret_access_key` can be found via AWS IAM console. Output format should be set to `json`.

This should create 2 files:

- ~/.aws/credentials
- ~/.aws/config

**CDK**
Set correct account and region in `cdk.context.json`

## Commands

**CDK**

- `cdk bootstrap`
- `cdk deploy`
- `cdk destroy`

**Drizzle**

- `npx drizzle-kit studio`

## Local Setup

**Local Postgresql on Mac OS**
Needed to run tests.

- `brew install postgresql`
- `brew services start postgresql`

- `psql postgres`

- `CREATE ROLE test WITH LOGIN PASSWORD 'test';`
- `CREATE DATABASE tracker_test;`
- `GRANT ALL PRIVILEGES ON DATABASE tracker_test TO test;`

**Apps Functions**
Create a `.env` file in `/apps/functions` similar to `.env.example`

**Apps Stacks Listener**
Create a `.env` file in `/apps/stacks-listener` similar to `.env.example`

**Package Database**
Create a `.env` file in `/packages/database` similar to `.env.example`
