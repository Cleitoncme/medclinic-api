import type { NextFunction, Request, Response } from 'express';

import { UserRole } from '../entities/user.entity';
import { AppError } from '../utils/app-error';

export function authorize(...allowedRoles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.auth) {
      next(new AppError(401, 'Authentication is required before authorization.'));
      return;
    }

    if (!allowedRoles.includes(request.auth.role)) {
      next(new AppError(403, 'You do not have permission to access this resource.'));
      return;
    }

    next();
  };
}
