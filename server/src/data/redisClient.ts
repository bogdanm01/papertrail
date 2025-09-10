import { createClient } from 'redis';

const redisClient = await createClient({ url: 'redis://default@redis:6379' })
  .on('error', err => {
    console.log('Redis Client Error', err);
  })
  .connect();

export default redisClient;
