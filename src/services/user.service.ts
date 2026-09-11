import type { CreateUserDTO, UserResponseDTO } from '../dtos/user.dto';
import { User, UserRole } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword } from '../utils/password';

export class UserService {
  private readonly userRepository: UserRepository;

  public constructor() {
    this.userRepository = new UserRepository();
  }

  public async register(userData: CreateUserDTO): Promise<UserResponseDTO> {
    const name = userData.name.trim();
    const email = userData.email.trim().toLowerCase();

    this.validateRegistrationInput(name, email, userData.password);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash: await hashPassword(userData.password),
      role: userData.role ?? UserRole.ATTENDANT,
    });

    return this.toResponseDTO(user);
  }

  private validateRegistrationInput(name: string, email: string, password: string): void {
    if (!name || !email || !password) {
      throw new Error('Name, email and password are required.');
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Email must have a valid format.');
    }

    if (password.length < 8) {
      throw new Error('Password must contain at least 8 characters.');
    }
  }

  private toResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
