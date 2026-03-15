import { RateLimiter } from 'limiter';
import { StacksMainnet } from '@stacks/network';
import axios from 'axios';

export const apiUrl = process.env.STACKS_API;

const limiter = new RateLimiter({ tokensPerInterval: 120, interval: 'second' });

export const stacksApi = axios.create({ baseURL: apiUrl });

stacksApi.interceptors.request.use(async (config) => {
  await limiter.removeTokens(1);
  return config;
});

export const network = new StacksMainnet({ url: apiUrl });
