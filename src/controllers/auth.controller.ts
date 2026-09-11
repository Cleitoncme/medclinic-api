import type { NextFunction, Request, Response } from 'express';

import type { LoginDTO } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private readonly authService: AuthService;

  public constructor() {
    this.authService = new AuthService();
  }

  public login = async (
    request: Request<Record<string, never>, unknown, LoginDTO>,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authentication = await this.authService.login(request.body);
      response.status(200).json(authentication);
    } catch (error: unknown) {
      next(error);
    }
  };
}
