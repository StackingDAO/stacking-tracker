import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Duration } from "aws-cdk-lib";

import * as dotenv from "dotenv";
dotenv.config({ path: "cdk/.env" });

const domainName = process.env.DOMAIN ?? "stacking-tracker.com";

export type StackSetup = {
  queue: sqs.Queue;
  vpc: ec2.Vpc;
  databaseUrl: string;
  cluster: ecs.Cluster;
  hostedZone: route53.IHostedZone;
  certificate: acm.Certificate;
};

export class Setup extends cdk.Stack {
  public readonly setup: StackSetup;

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
      credentials: rds.Credentials.fromSecret(databaseSecret),
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

    // Certificate
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: domainName,
    });

    const certificate = new acm.Certificate(this, "Certificate", {
      domainName: `*.${domainName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // Setup
    this.setup = {
      queue,
      vpc,
      databaseUrl,
      cluster,
      hostedZone,
      certificate,
    };
  }
}
