import { container } from 'tsyringe';

import getDbClient, { type DbClient } from '@/data/db.js';
import getRedisClient, { type RedisClient } from '@/data/redisClient.js';

import { TOKENS } from './diTokens.js';

import { AuthService } from '@/services/auth.service.js';
import { UserRepository } from '@/data/repository/user.repository.js';

/**
 * Registers application services and infrastructure clients into the DI container.
 *
 * Initializes database and Redis clients and binds them, along with
 * service/repository classes, to their corresponding tokens so that the
 * rest of the app can resolve dependencies.
 */
const registerDependencies = async () => {
  const dbClient = getDbClient();
  const redisClient = await getRedisClient();

  container.registerInstance<DbClient>(TOKENS.db, dbClient);
  container.registerInstance<RedisClient>(TOKENS.redis, redisClient);
  container.register(TOKENS.authService, { useClass: AuthService });
  container.register(TOKENS.userRepository, { useClass: UserRepository });
};

export default registerDependencies;
