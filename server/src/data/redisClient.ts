import { createClient } from 'redis';

import env from '@/config/env.js';

export type RedisClient = ReturnType<typeof getRedisClient>;

const getRedisClient = async () =>
  await createClient({ url: env.REDIS_URL })
    .on('error', err => {
      console.log('Redis Client Error', err);
    })
    .connect();

export default getRedisClient;
