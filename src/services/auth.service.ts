import jwt, { type SignOptions } from 'jsonwebtoken';

import type { AuthTokenPayload, LoginDTO, LoginResponseDTO } from '../dtos/auth.dto';
import { env } from '../config/env';
import { UserRepository } from '../repositories/user.repository';
import { comparePassword } from '../utils/password';

export class AuthService {
  private readonly userRepository: UserRepository;

  public constructor() {
    this.userRepository = new UserRepository();
  }

  public async login(credentials: LoginDTO): Promise<LoginResponseDTO> {
    const email = credentials.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user || !(await comparePassword(credentials.password, user.passwordHash))) {
      throw new Error('Invalid credentials.');
    }

    const payload: AuthTokenPayload = { id: user.id, role: user.role };
    const options: SignOptions = { expiresIn: env.jwt.expiresIn as SignOptions['expiresIn'] };

    return { token: jwt.sign(payload, env.jwt.secret, options) };
  }
}
