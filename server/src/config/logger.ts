import pino from 'pino';
import env from './env.js';

const logger = pino({
  // minimum log level
  level: env.PINO_LOG_LEVEL || 'info',
});

export default logger;
