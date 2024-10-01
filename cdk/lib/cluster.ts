import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";

import * as dotenv from "dotenv";
dotenv.config({ path: "cdk/.env" });

export class Cluster extends cdk.Stack {
  public readonly cluster: ecs.Cluster;

  constructor(
    scope: Construct,
    id: string,
    vpc: ec2.Vpc,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    this.cluster = new ecs.Cluster(this, "Cluster", { vpc });
    this.cluster.addCapacity("ASG", {
      instanceType: new ec2.InstanceType("t2.medium"),
      desiredCapacity: 1,
    });
  }
}
