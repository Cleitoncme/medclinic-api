import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { env } from '../config/env';
import type { AuthTokenPayload } from '../dtos/auth.dto';
import { UserRole } from '../entities/user.entity';
import { AppError } from '../utils/app-error';

function isAuthTokenPayload(
  payload: string | JwtPayload,
): payload is JwtPayload & AuthTokenPayload {
  return (
    typeof payload !== 'string' &&
    typeof payload.id === 'string' &&
    (payload.role === UserRole.ADMIN || payload.role === UserRole.ATTENDANT)
  );
}

export function authenticate(request: Request, _response: Response, next: NextFunction): void {
  try {
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication token is required.');
    }

    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
      throw new AppError(401, 'Authentication token is required.');
    }

    const payload = jwt.verify(token, env.jwt.secret);
    if (!isAuthTokenPayload(payload)) {
      throw new AppError(401, 'Authentication token is invalid or expired.');
    }

    request.auth = { id: payload.id, role: payload.role };
    next();
  } catch (error: unknown) {
    next(
      error instanceof AppError
        ? error
        : new AppError(401, 'Authentication token is invalid or expired.'),
    );
  }
}
