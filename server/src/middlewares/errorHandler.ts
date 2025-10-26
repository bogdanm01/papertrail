import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '@/config/logger.js';
import { AppError } from '@/lib/errors/appError.js';

export const errorHandler: ErrorRequestHandler = (err: Error, req, res, next) => {
  logger.error({
    err,
    method: req.method,
    url: req.originalUrl,
  });

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message ?? 'Error occurred',
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
  });
};
