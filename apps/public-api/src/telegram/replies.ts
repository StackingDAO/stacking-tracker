import { CommandPositions } from "./replies/commandPositions";
import { CommandStart } from "./replies/commandStart";

const handlers = [new CommandStart(), new CommandPositions()];

export async function handleMessage(message: any) {
  for (const handler of handlers) {
    if (handler.canHandleMessage(message)) {
      await handler.handleMessage(message);
    }
  }
}
