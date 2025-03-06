import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { TypeScriptLambda } from "./constructs/lambda";
import {
  SnsEventSource,
  SqsEventSource,
} from "aws-cdk-lib/aws-lambda-event-sources";

import * as dotenv from "dotenv";
dotenv.config({ path: "cdk/.env" });

export class Lambdas extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    queue: sqs.Queue,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // Topics
    const topicRewardsProcessor = new sns.Topic(this, "Topic-RewardsProcessor");
    const topicSignersProcessor = new sns.Topic(this, "Topic-SignersProcessor");
    const topicStackersRewardsProcessor = new sns.Topic(
      this,
      "Topic-StackersRewardsProcessor"
    );
    const topicMinersProcessor = new sns.Topic(this, "Topic-MinersProcessor");
    const topicTelegramProcessor = new sns.Topic(
      this,
      "Topic-TelegramProcessor"
    );
    const topicPricesProcessor = new sns.Topic(this, "Topic-PricesProcessor");

    // Lambda Functions
    const blockProcessor = new TypeScriptLambda(this, "BlockProcessor", {
      lambdaRootDir: ".",
      handlerFilePath: "apps/functions/src/block-processor.ts",
      handler: "processBlock",
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        TOPIC_SIGNERS: topicSignersProcessor.topicArn,
        TOPIC_REWARDS: topicRewardsProcessor.topicArn,
        TOPIC_STACKERS_REWARDS: topicStackersRewardsProcessor.topicArn,
        TOPIC_MINERS: topicMinersProcessor.topicArn,
        TOPIC_TELEGRAM: topicTelegramProcessor.topicArn,
        TOPIC_PRICES: topicPricesProcessor.topicArn,
      },
    });
    blockProcessor.lambda.addEventSource(new SqsEventSource(queue));
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
        DATABASE_URL: process.env.DATABASE_URL ?? "",
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
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        STACKS_API: process.env.STACKS_API ?? "",
      },
    });
    rewardsProcessor.lambda.addEventSource(
      new SnsEventSource(topicRewardsProcessor)
    );

    const stackersRewardsProcessor = new TypeScriptLambda(
      this,
      "StackersRewardsProcessor",
      {
        lambdaRootDir: ".",
        handlerFilePath: "apps/functions/src/stackers-rewards-processor.ts",
        handler: "processStackerRewards",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL ?? "",
          STACKS_API: process.env.STACKS_API ?? "",
        },
      }
    );
    stackersRewardsProcessor.lambda.addEventSource(
      new SnsEventSource(topicStackersRewardsProcessor)
    );

    const minersProcessor = new TypeScriptLambda(this, "MinersProcessor", {
      lambdaRootDir: ".",
      handlerFilePath: "apps/functions/src/miners-processor.ts",
      handler: "processMiners",
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        STACKS_API: process.env.STACKS_API ?? "",
        BLOCKCYPHER_TOKEN: process.env.BLOCKCYPHER_TOKEN ?? "",
      },
    });
    minersProcessor.lambda.addEventSource(
      new SnsEventSource(topicMinersProcessor)
    );

    const telegramProcessor = new TypeScriptLambda(this, "TelegramProcessor", {
      lambdaRootDir: ".",
      handlerFilePath: "apps/functions/src/telegram-processor.ts",
      handler: "processTelegram",
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        STACKS_API: process.env.STACKS_API ?? "",
        TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN ?? "",
      },
    });
    telegramProcessor.lambda.addEventSource(
      new SnsEventSource(topicTelegramProcessor)
    );

    const pricesProcessor = new TypeScriptLambda(this, "PricesProcessor", {
      lambdaRootDir: ".",
      handlerFilePath: "apps/functions/src/prices-processor.ts",
      handler: "processCyclePrices",
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        STACKS_API: process.env.STACKS_API ?? "",
        COINGECKO_API_KEY: process.env.COINGECKO_API_KEY ?? "",
      },
    });
    pricesProcessor.lambda.addEventSource(
      new SnsEventSource(topicPricesProcessor)
    );
  }
}
