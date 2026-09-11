import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { AppError } from '../utils/app-error';

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

  console.error('Unexpected application error:', error);
  response.status(500).json({
    statusCode: 500,
    message: 'Internal server error.',
  });
};
