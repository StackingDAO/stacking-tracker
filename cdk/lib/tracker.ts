import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as sns from "aws-cdk-lib/aws-sns";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { TypeScriptLambda } from "./constructs/lambda";
import {
  SnsEventSource,
  SqsEventSource,
} from "aws-cdk-lib/aws-lambda-event-sources";
import { Duration } from "aws-cdk-lib";

import * as dotenv from "dotenv";
dotenv.config({ path: "cdk/.env" });

export class Tracker extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SQS Queues
    const queue = new sqs.Queue(this, "BlocksQ", {
      fifo: true,
      visibilityTimeout: cdk.Duration.seconds(600), // How long a consumer has to process a message
      retentionPeriod: cdk.Duration.days(14), // How long message are kept in memory
      deadLetterQueue: {
        maxReceiveCount: 3, // Maximum number of receives before moving the message to the DLQ
        queue: new sqs.Queue(this, "BlocksDLQ", {
          fifo: true,
        }),
      },
    });

    const topicRewardsProcessor = new sns.Topic(this, "Topic-RewardsProcessor");
    const topicSignersProcessor = new sns.Topic(this, "Topic-SignersProcessor");

    // VPC
    const vpc = new ec2.Vpc(this, "VPC", {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // RDS Database
    const databaseSecret = new secretsmanager.Secret(this, "DBSecret", {
      secretName: "DatabaseSecret",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: "dbadmin",
        }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: "password",
      },
    });

    const databaseSecurityGroup = new ec2.SecurityGroup(
      this,
      "DBSecurityGroup",
      {
        vpc,
        allowAllOutbound: true,
        description: "Security group for RDS DB",
      }
    );

    databaseSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5432),
      "Allow inbound PostgreSQL"
    );

    const databaseName = "tracker";
    const databaseInstance = new rds.DatabaseInstance(this, "RDSInstance", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_2,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO
      ),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      securityGroups: [databaseSecurityGroup],
      databaseName: databaseName,
      credentials: rds.Credentials.fromSecret(databaseSecret), // Use credentials from Secrets Manager
      allocatedStorage: 20,
      storageType: rds.StorageType.GP2,
      backupRetention: Duration.days(7),
      deleteAutomatedBackups: true,
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publiclyAccessible: true,
      multiAz: false,
    });
    const databaseUrl = `postgres://${databaseSecret.secretValueFromJson("username").unsafeUnwrap()}:${databaseSecret.secretValueFromJson("password").unsafeUnwrap()}@${databaseInstance.dbInstanceEndpointAddress}:${databaseInstance.dbInstanceEndpointPort}/${databaseName}`;

    // ECS Cluster
    const cluster = new ecs.Cluster(this, "Cluster", { vpc });
    cluster.addCapacity("ASG", {
      instanceType: new ec2.InstanceType("t2.small"),
      desiredCapacity: 1,
    });

    // ECS Service
    const stacksListener = new ecsPatterns.ApplicationLoadBalancedEc2Service(
      this,
      "Stacks-Listener",
      {
        cluster,
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

    const publicApi = new ecsPatterns.ApplicationLoadBalancedEc2Service(
      this,
      "Public-API",
      {
        cluster,
        memoryReservationMiB: 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset(".", { file: "apps/public-api/Dockerfile" }),
          containerPort: 3000,
          environment: {
            DATABASE_URL: databaseUrl,
          },
        },
        desiredCount: 1, // Number of instances to run
        healthCheckGracePeriod: cdk.Duration.seconds(60), // Grace period before health checks start
        circuitBreaker: { enable: true, rollback: true },
      }
    );

    publicApi.targetGroup.configureHealthCheck({
      path: "/health", // Health check endpoint
      interval: cdk.Duration.seconds(30), // Health check interval
      timeout: cdk.Duration.seconds(5), // Timeout for health checks
      healthyThresholdCount: 2, // Number of consecutive successful health checks required
      unhealthyThresholdCount: 2, // Number of consecutive failed health checks required to mark as unhealthy
    });

    // Lambda Functions
    const blockProcessor = new TypeScriptLambda(this, "BlockProcessor", {
      lambdaRootDir: ".",
      handlerFilePath: "apps/functions/src/block-processor.ts",
      handler: "processBlock",
      environment: {
        DATABASE_URL: databaseUrl,
        TOPIC_SIGNERS: topicSignersProcessor.topicArn,
        TOPIC_REWARDS: topicRewardsProcessor.topicArn,
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
        DATABASE_URL: databaseUrl,
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
        DATABASE_URL: databaseUrl,
        STACKS_API: process.env.STACKS_API ?? "",
      },
    });
    rewardsProcessor.lambda.addEventSource(
      new SnsEventSource(topicRewardsProcessor)
    );

    // Setup
    new cdk.CfnOutput(this, "BlockProcessorArn", {
      value: blockProcessor.lambda.functionArn,
    });
    new cdk.CfnOutput(this, "SignersProcessorArn", {
      value: signersProcessor.lambda.functionArn,
    });
    new cdk.CfnOutput(this, "RewardsProcessorArn", {
      value: rewardsProcessor.lambda.functionArn,
    });
    new cdk.CfnOutput(this, "TopicSignersArn", {
      value: topicSignersProcessor.topicArn,
    });
    new cdk.CfnOutput(this, "TopicRewardsArn", {
      value: topicRewardsProcessor.topicArn,
    });
    new cdk.CfnOutput(this, "BlocksQueueArn", {
      value: queue.queueArn,
    });
    new cdk.CfnOutput(this, "RDSInstanceEndpoint", {
      value: databaseInstance.dbInstanceEndpointAddress,
    });
  }
}
