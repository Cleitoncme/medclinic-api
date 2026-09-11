import type { NextFunction, Request, Response } from 'express';

import { UserRole } from '../entities/user.entity';

export function authorize(...allowedRoles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.auth) {
      next(new Error('Authentication is required before authorization.'));
      return;
    }

    if (!allowedRoles.includes(request.auth.role)) {
      next(new Error('You do not have permission to access this resource.'));
      return;
    }

    next();
  };
}
