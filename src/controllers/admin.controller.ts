import type { Request, Response } from 'express';

export class AdminController {
  public ping(_request: Request, response: Response): void {
    response.status(200).json({ message: 'Administrator access granted.' });
  }
}
