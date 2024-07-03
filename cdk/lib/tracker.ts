import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { TypeScriptLambda } from "./constructs/lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Duration } from "aws-cdk-lib";

import "dotenv/config";

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

        // ECS Cluster
        const cluster = new ecs.Cluster(this, "Cluster", { vpc });
        cluster.addCapacity("ASG", {
            instanceType: new ec2.InstanceType("t2.small"),
            desiredCapacity: 1,
        });

        // ECS Service
        const stacksListener =
            new ecsPatterns.ApplicationLoadBalancedEc2Service(
                this,
                "Stacks-Listener",
                {
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
            databaseName: "tracker",
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

        // Lambda Functions
        const blockProcessor = new TypeScriptLambda(this, "BlockProcessor", {
            lambdaRootDir: ".",
            handlerFilePath: "apps/functions/src/block-processor.ts",
            handler: "processBlock",
            environment: {
                DATABASE_URL: `postgres://${databaseSecret.secretValueFromJson("username").unsafeUnwrap()}:${databaseSecret.secretValueFromJson("password").unsafeUnwrap()}@${databaseInstance.dbInstanceEndpointAddress}:${databaseInstance.dbInstanceEndpointPort}/mydatabase`,
            },
        });

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
        new cdk.CfnOutput(this, "RDSInstanceEndpoint", {
            value: databaseInstance.dbInstanceEndpointAddress,
        });
    }
}
