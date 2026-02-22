import { Request, Response, NextFunction } from "express";
import NodeCache from "node-cache";

const cache = new NodeCache();

export function cached(ttlSeconds: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl;
    const cachedBody = cache.get(key);

    if (cachedBody !== undefined) {
      res.send(cachedBody);
      return;
    }

    const originalSend = res.send.bind(res);
    res.send = (body: any) => {
      cache.set(key, body, ttlSeconds);
      return originalSend(body);
    };

    next();
  };
}
