import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";

import * as dotenv from "dotenv";
import { StackSetup } from "./setup";
dotenv.config({ path: "cdk/.env" });

const domainName = process.env.DOMAIN ?? "stacking-tracker.com";

export class PublicApi extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    setupStack: StackSetup,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // ECS Service
    const publicApi = new ecsPatterns.ApplicationLoadBalancedEc2Service(
      this,
      "Public-API",
      {
        cluster: setupStack.cluster,
        memoryReservationMiB: 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset(".", {
            file: "apps/public-api/Dockerfile",
          }),
          containerPort: 3030,
          environment: {
            DATABASE_URL: setupStack.databaseUrl,
          },
        },
        desiredCount: 1, // Number of instances to run
        healthCheckGracePeriod: cdk.Duration.seconds(120), // Grace period before health checks start
        circuitBreaker: { enable: true, rollback: true },
        certificate: setupStack.certificate,
        domainName: `api.${domainName}`,
        domainZone: setupStack.hostedZone,
      }
    );

    publicApi.targetGroup.configureHealthCheck({
      path: "/health", // Health check endpoint
      interval: cdk.Duration.seconds(60), // Health check interval
      timeout: cdk.Duration.seconds(10), // Timeout for health checks
      healthyThresholdCount: 2, // Number of consecutive successful health checks required
      unhealthyThresholdCount: 5, // Number of consecutive failed health checks required to mark as unhealthy
    });
  }
}
