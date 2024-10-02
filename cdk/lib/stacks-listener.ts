import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as sqs from "aws-cdk-lib/aws-sqs";

import * as dotenv from "dotenv";
dotenv.config({ path: "cdk/.env" });

export class StacksListener extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    queue: sqs.Queue,
    cluster: ecs.Cluster,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // ECS Service
    const stacksListener = new ecsPatterns.ApplicationLoadBalancedEc2Service(
      this,
      "Stacks-Listener",
      {
        cluster: cluster,
        memoryReservationMiB: 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset("./apps/stacks-listener"),
          containerPort: 3000,
          environment: {
            QUEUE_URL: queue.queueUrl,
          },
        },
        desiredCount: 1, // Number of instances to run
        healthCheckGracePeriod: cdk.Duration.seconds(60), // Grace period before health checks start
        circuitBreaker: { enable: true, rollback: true },
      }
    );

    queue.grantSendMessages(stacksListener.taskDefinition.taskRole);

    stacksListener.targetGroup.configureHealthCheck({
      path: "/health", // Health check endpoint
      interval: cdk.Duration.seconds(30), // Health check interval
      timeout: cdk.Duration.seconds(5), // Timeout for health checks
      healthyThresholdCount: 2, // Number of consecutive successful health checks required
      unhealthyThresholdCount: 2, // Number of consecutive failed health checks required to mark as unhealthy
    });
  }
}
