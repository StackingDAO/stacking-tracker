import { Configuration, ConfigurationParameters } from '@stacks/blockchain-api-client';
import { RateLimiter } from 'limiter';

export const apiUrl = process.env.STACKS_API;

console.log('URL', apiUrl);

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
