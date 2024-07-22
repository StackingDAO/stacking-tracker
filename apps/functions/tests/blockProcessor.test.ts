import { processBlock } from "../src/block-processor";
import { SNSClient } from "@aws-sdk/client-sns";
import { SQSEvent, Context } from "aws-lambda";
import { getLatestBlock } from "@repo/database/src/actions";

process.env.TOPIC_SIGNERS = "topic_signers";
process.env.TOPIC_REWARDS = "topic_rewards";
process.env.TOPIC_STACKERS_REWARDS = "topic_stackers_rewards";

const snsSendMock = jest.fn();
jest.mock("aws-sdk/clients/sns", () => {
  return jest.fn().mockImplementation(function () {
    this.send = jest.fn(() => ({
      promise: snsSendMock,
    }));
  });
});
snsSendMock.mockResolvedValueOnce({
  MessageId: "mock-message-id-signers",
});
snsSendMock.mockResolvedValueOnce({
  MessageId: "mock-message-id-rewards",
});
snsSendMock.mockResolvedValueOnce({
  MessageId: "mock-message-id-stackers-rewards",
});

const message = JSON.stringify({ block_height: 14900 });

const event: any = {
  Records: [
    {
      body: JSON.stringify({ height: 14900 }),
    },
  ],
};

const context: Context = {} as Context;

beforeAll(() => {
  SNSClient.prototype.send = snsSendMock;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("processBlock", () => {
  it("should process the block and send messages to SNS topics", async () => {
    let latestSavedBlock = await getLatestBlock();
    expect(latestSavedBlock).toStrictEqual(0);

    await processBlock(event, context);

    expect(snsSendMock).toHaveBeenCalledTimes(3);
    expect(snsSendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TopicArn: process.env.TOPIC_SIGNERS,
          Message: message,
        }),
      })
    );
    expect(snsSendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TopicArn: process.env.TOPIC_REWARDS,
          Message: message,
        }),
      })
    );
    expect(snsSendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TopicArn: process.env.TOPIC_STACKERS_REWARDS,
          Message: message,
        }),
      })
    );

    latestSavedBlock = await getLatestBlock();
    expect(latestSavedBlock).toStrictEqual(14900);
  });
});
