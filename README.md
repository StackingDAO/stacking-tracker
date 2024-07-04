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

**AWS SAM**
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

## Setup

**Credentials**
Run `aws configure`. The `access_key_id` and `secret_access_key` can be found via AWS IAM console. Output format should be set to `json`.

This should create 2 files:

- ~/.aws/credentials
- ~/.aws/config

**Environment Vars**
Create a `.env` file in `/apps/stacks-listener` similar to `.env.example`

**CDK**
Set correct account and region in `cdk.context.json`

## Commands

**CDK**

- `cdk bootstrap`
- `cdk deploy`
- `cdk destroy`
