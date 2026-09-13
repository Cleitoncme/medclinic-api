import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

import { AppError } from '../utils/app-error';

function isDuplicateEmailError(error: unknown): boolean {
  if (
    !(error instanceof QueryFailedError) ||
    typeof error.driverError !== 'object' ||
    !error.driverError
  ) {
    return false;
  }

  return (
    Reflect.get(error.driverError, 'code') === '23505' &&
    Reflect.get(error.driverError, 'constraint') === 'UQ_users_email'
  );
}

export const notFoundHandler = (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  next(new AppError(404, `Route ${request.method} ${request.originalUrl} was not found.`));
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  void _next;

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
    });
    return;
  }

  if (isDuplicateEmailError(error)) {
    response.status(409).json({
      statusCode: 409,
      message: 'Email is already registered.',
    });
    return;
  }

  console.error('Unexpected application error:', error);
  response.status(500).json({
    statusCode: 500,
    message: 'Internal server error.',
  });
};
