import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Duration } from "aws-cdk-lib";

import * as dotenv from "dotenv";
dotenv.config({ path: "cdk/.env" });

export class Database extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    vpc: ec2.Vpc,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const databaseSecret = new secretsmanager.Secret(this, "DBSecret", {
      secretName: `DBSecret`,
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
  }
}
