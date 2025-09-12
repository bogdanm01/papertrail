import { createClient } from 'redis';

import env from '@/config/env.js';

const redisClient = await createClient({ url: env.REDIS_URL })
  .on('error', err => {
    console.log('Redis Client Error', err);
  })
  .connect();

export default redisClient;
