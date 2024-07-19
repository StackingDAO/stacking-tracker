import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as sns from "aws-cdk-lib/aws-sns";
import { TypeScriptLambda } from "./constructs/lambda";
import {
  SnsEventSource,
  SqsEventSource,
} from "aws-cdk-lib/aws-lambda-event-sources";

import * as dotenv from "dotenv";
import { StackSetup } from "./setup";
dotenv.config({ path: "cdk/.env" });

export class Lambdas extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    setupStack: StackSetup,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // Topics
    const topicRewardsProcessor = new sns.Topic(this, "Topic-RewardsProcessor");
    const topicSignersProcessor = new sns.Topic(this, "Topic-SignersProcessor");

    // Lambda Functions
    const blockProcessor = new TypeScriptLambda(this, "BlockProcessor", {
      lambdaRootDir: ".",
      handlerFilePath: "apps/functions/src/block-processor.ts",
      handler: "processBlock",
      environment: {
        DATABASE_URL: setupStack.databaseUrl,
        TOPIC_SIGNERS: topicSignersProcessor.topicArn,
        TOPIC_REWARDS: topicRewardsProcessor.topicArn,
      },
    });
    blockProcessor.lambda.addEventSource(new SqsEventSource(setupStack.queue));
    blockProcessor.lambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["sns:publish"],
        resources: ["*"],
      })
    );

    const signersProcessor = new TypeScriptLambda(this, "SignersProcessor", {
      lambdaRootDir: ".",
      handlerFilePath: "apps/functions/src/signers-processor.ts",
      handler: "processSigners",
      environment: {
        DATABASE_URL: setupStack.databaseUrl,
        STACKS_API: process.env.STACKS_API ?? "",
      },
    });
    signersProcessor.lambda.addEventSource(
      new SnsEventSource(topicSignersProcessor)
    );

    const rewardsProcessor = new TypeScriptLambda(this, "RewardsProcessor", {
      lambdaRootDir: ".",
      handlerFilePath: "apps/functions/src/rewards-processor.ts",
      handler: "processRewards",
      environment: {
        DATABASE_URL: setupStack.databaseUrl,
        STACKS_API: process.env.STACKS_API ?? "",
      },
    });
    rewardsProcessor.lambda.addEventSource(
      new SnsEventSource(topicRewardsProcessor)
    );
  }
}
