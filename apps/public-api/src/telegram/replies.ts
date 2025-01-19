import { ActionUpdateWallet } from "./replies/actionUpdateWallet";
import { CommandPositions } from "./replies/commandPositions";
import { CommandStart } from "./replies/commandStart";
import { CommandWallet } from "./replies/commandWallet";

const handlers = [
  new CommandStart(),
  new CommandPositions(),
  new CommandWallet(),
  new ActionUpdateWallet(),
];

export async function handleMessage(message: any) {
  for (const handler of handlers) {
    try {
      if (handler.canHandleMessage(message)) {
        await handler.handleMessage(message);
      }
    } catch (error) {
      console.log("TG Handler Error", error);
    }
  }
}
