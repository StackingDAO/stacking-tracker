#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CloudFront } from "../lib/cloudfront";
import { StacksListener } from "../lib/stacks-listener";
import { Web } from "../lib/web";
import { PublicApi } from "../lib/public-api";
import { Lambdas } from "../lib/lambdas";
import { Cluster } from "../lib/cluster";
import { Database } from "../lib/database";
import { Queues } from "../lib/queues";
import { Vpc } from "../lib/vpc";

const app = new cdk.App();

const env = {
  account: process.env.CDK_AWS_ACCOUNT,
  region: process.env.CDK_AWS_REGION,
};

const envUs = {
  account: process.env.CDK_AWS_ACCOUNT,
  region: "us-east-1",
};

// 1. Certificates can only be created in us-east-1
new CloudFront(app, "CloudFront", { env: envUs });

// 2. Queues and Vpc
const queuesStack = new Queues(app, "Queues", { env });
const vpcStack = new Vpc(app, "Vpc", { env });

// 3. Database
new Database(app, "Database", vpcStack.vpc, {
  env,
});

// 4. Cluster & services
const clusterStack = new Cluster(app, "Cluster", vpcStack.vpc, { env });
new StacksListener(
  app,
  "StacksListener",
  queuesStack.queue,
  clusterStack.cluster,
  { env }
);
new PublicApi(app, "PublicApi", clusterStack.cluster, { env });
new Web(app, "Web", clusterStack.cluster, { env });

// 5. Lambdas
new Lambdas(app, "Lambdas", queuesStack.queue, {
  env,
});
