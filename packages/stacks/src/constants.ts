import { Configuration, ConfigurationParameters } from '@stacks/blockchain-api-client';
import { RateLimiter } from 'limiter';

import * as dotenv from 'dotenv';
dotenv.config();

export const apiUrl = process.env.STACKS_API;

const limiter = new RateLimiter({ tokensPerInterval: 120, interval: 'second' });

const configurationParameters: ConfigurationParameters = {
  basePath: apiUrl,
  middleware: [
    {
      pre: async () => {
        await limiter.removeTokens(1);
      },
    },
  ],
};

export const configuration = new Configuration(configurationParameters);
