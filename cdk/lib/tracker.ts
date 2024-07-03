import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as iam from "aws-cdk-lib/aws-iam";
import { TypeScriptLambda } from "./constructs/lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

import "dotenv/config";

export class Tracker extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const queue = new sqs.Queue(this, "Tracker-Blocks-Q", {
            fifo: true,
            visibilityTimeout: cdk.Duration.seconds(600), // How long a consumer has to process a message
            retentionPeriod: cdk.Duration.days(14), // How long message are kept in memory
            deadLetterQueue: {
                maxReceiveCount: 3, // Maximum number of receives before moving the message to the DLQ
                queue: new sqs.Queue(this, "Tracker-Blocks-DLQ", {
                    fifo: true,
                }),
            },
        });

        const wallet_tracker = new TypeScriptLambda(
            this,
            "Tracker-Block-Processor",
            {
                lambdaRootDir: ".",
                handlerFilePath: "apps/functions/src/block-processor.ts",
                handler: "processBlock",
                environment: {},
            }
        );

        wallet_tracker.lambda.addEventSource(new SqsEventSource(queue));
        wallet_tracker.lambda.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["sns:publish"],
                resources: ["*"],
            })
        );

        new cdk.CfnOutput(this, "WalletTrackeFnrARN", {
            value: wallet_tracker.lambda.functionArn,
        });
        new cdk.CfnOutput(this, "StacksBlocksQueueARN", {
            value: queue.queueArn,
        });
    }
}
