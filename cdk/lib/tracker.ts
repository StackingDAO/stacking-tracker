import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import { TypeScriptLambda } from "./constructs/lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

import "dotenv/config";

export class Tracker extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const queue = new sqs.Queue(this, "Blocks-Q", {
            fifo: true,
            visibilityTimeout: cdk.Duration.seconds(600), // How long a consumer has to process a message
            retentionPeriod: cdk.Duration.days(14), // How long message are kept in memory
            deadLetterQueue: {
                maxReceiveCount: 3, // Maximum number of receives before moving the message to the DLQ
                queue: new sqs.Queue(this, "Blocks-DLQ", {
                    fifo: true,
                }),
            },
        });

        const vpc = new ec2.Vpc(this, "VPC", {
          subnetConfiguration: [
            {
              cidrMask: 24,
              name: "Public",
              subnetType: ec2.SubnetType.PUBLIC,
            },
          ],
        });

        const cluster = new ecs.Cluster(this, "Cluster", { vpc });
        cluster.addCapacity("ASG", {
          instanceType: new ec2.InstanceType("t2.small"),
          desiredCapacity: 1,
        });

        const stacksListener = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, "Stacks-Listener", {
          cluster,
          memoryReservationMiB: 512,
          taskImageOptions: {
            image: ecs.ContainerImage.fromAsset("."),
            containerPort: 3000,
            environment: {
              QUEUE_URL: queue.queueUrl,
            },
          },
          desiredCount: 1, // Number of instances to run
          healthCheckGracePeriod: cdk.Duration.seconds(60), // Grace period before health checks start
          circuitBreaker: { enable: true, rollback: true },
        });

        queue.grantSendMessages(stacksListener.taskDefinition.taskRole);

        // Configure health check settings
        stacksListener.targetGroup.configureHealthCheck({
          path: "/health", // Health check endpoint
          interval: cdk.Duration.seconds(30), // Health check interval
          timeout: cdk.Duration.seconds(5), // Timeout for health checks
          healthyThresholdCount: 2, // Number of consecutive successful health checks required
          unhealthyThresholdCount: 2, // Number of consecutive failed health checks required to mark as unhealthy
        });

        const blockProcessor = new TypeScriptLambda(
            this,
            "Block-Processor",
            {
                lambdaRootDir: ".",
                handlerFilePath: "apps/functions/src/block-processor.ts",
                handler: "processBlock",
                environment: {},
            }
        );

        blockProcessor.lambda.addEventSource(new SqsEventSource(queue));
        blockProcessor.lambda.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["sns:publish"],
                resources: ["*"],
            })
        );

        new cdk.CfnOutput(this, "BlockProcessorArn", {
            value: blockProcessor.lambda.functionArn,
        });
        new cdk.CfnOutput(this, "BlocksQueueArn", {
            value: queue.queueArn,
        });
    }
}
