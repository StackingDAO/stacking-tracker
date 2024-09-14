import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";

import * as dotenv from "dotenv";
import { StackSetup } from "./setup";
dotenv.config({ path: "cdk/.env" });

export class Web extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    setupStack: StackSetup,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // ECS Service
    const website = new ecsPatterns.ApplicationLoadBalancedEc2Service(
      this,
      "Website",
      {
        cluster: setupStack.cluster,
        memoryReservationMiB: 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset("./web"),
          containerPort: 3000,
          environment: {
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
          },
        },
        desiredCount: 1, // Number of instances to run
        healthCheckGracePeriod: cdk.Duration.seconds(60), // Grace period before health checks start
        circuitBreaker: { enable: true, rollback: true },
      }
    );

    website.targetGroup.configureHealthCheck({
      path: "/", // Health check endpoint
      interval: cdk.Duration.seconds(30), // Health check interval
      timeout: cdk.Duration.seconds(5), // Timeout for health checks
      healthyThresholdCount: 2, // Number of consecutive successful health checks required
      unhealthyThresholdCount: 2, // Number of consecutive failed health checks required to mark as unhealthy
    });
  }
}
