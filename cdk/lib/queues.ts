import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";

import * as dotenv from "dotenv";
dotenv.config({ path: "cdk/.env" });

export class Queues extends cdk.Stack {
  public readonly queue: sqs.Queue;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.queue = new sqs.Queue(this, "BlocksQ", {
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
  }
}
