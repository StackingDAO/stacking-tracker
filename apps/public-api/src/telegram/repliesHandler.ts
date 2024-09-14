export class RepliesHandler {
  canHandleMessage(message: any): boolean {
    return false;
  }

  async handleMessage(message: any): Promise<any> {
    return false;
  }
}
