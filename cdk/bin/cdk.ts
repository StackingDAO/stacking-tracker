#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Setup } from "../lib/setup";
import { StacksListener } from "../lib/stacks-listener";
import { Web } from "../lib/web";
import { PublicApi } from "../lib/public-api";
import { Lambdas } from "../lib/lambdas";

const app = new cdk.App();
const env = {
  account: process.env.CDK_AWS_ACCOUNT,
  region: process.env.CDK_AWS_REGION,
};

const setupStack = new Setup(app, "Setup", { env });

new StacksListener(app, "StacksListener", setupStack.setup, { env });
new PublicApi(app, "PublicApi", setupStack.setup, { env });
new Web(app, "Web", setupStack.setup, { env });
new Lambdas(app, "Lambdas", setupStack.setup, { env });
