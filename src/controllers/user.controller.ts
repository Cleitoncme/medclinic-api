import type { NextFunction, Request, Response } from 'express';

import type { CreateUserDTO } from '../dtos/user.dto';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/app-error';

export class UserController {
  private readonly userService: UserService;

  public constructor() {
    this.userService = new UserService();
  }

  public register = async (
    request: Request<Record<string, never>, unknown, CreateUserDTO>,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.userService.register(request.body);
      response.status(201).json({ user });
    } catch (error: unknown) {
      next(error);
    }
  };

  public me = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      if (!request.auth) {
        throw new AppError(401, 'Authentication is required.');
      }

      const user = await this.userService.getById(request.auth.id);
      response.status(200).json({ user });
    } catch (error: unknown) {
      next(error);
    }
  };
}
