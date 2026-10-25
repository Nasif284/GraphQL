import { UserRepository, CreateUserData, UpdateUserData } from './user.repository.js';
import { IUser } from './user.model.js';
import { createNotFoundError, createValidationError } from '../../errors/index.js';

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepo.findAll();
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw createNotFoundError('User', id);
    }
    return user;
  }

  async createUser(data: CreateUserData): Promise<IUser> {
    if (!data.name || data.name.trim().length === 0) {
      throw createValidationError('User name is required');
    }

    if (!data.email || !data.email.includes('@')) {
      throw createValidationError('A valid email address is required');
    }

    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw createValidationError(`Email '${data.email}' is already registered`, {
        email: 'Already exists'
      });
    }

    return this.userRepo.create({
      ...data,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim()
    });
  }

  async updateUser(id: string, data: UpdateUserData): Promise<IUser> {
    const existing = await this.userRepo.findById(id);
    if (!existing) {
      throw createNotFoundError('User', id);
    }

    if (data.email && data.email !== existing.email) {
      const emailInUse = await this.userRepo.findByEmail(data.email);
      if (emailInUse && emailInUse._id.toString() !== id) {
        throw createValidationError(`Email '${data.email}' is already taken`);
      }
    }

    const updated = await this.userRepo.update(id, data);
    if (!updated) {
      throw createNotFoundError('User', id);
    }
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    const existing = await this.userRepo.findById(id);
    if (!existing) {
      throw createNotFoundError('User', id);
    }
    return this.userRepo.delete(id);
  }

  async searchUsers(query: string): Promise<IUser[]> {
    if (!query || query.trim().length === 0) return [];
    return this.userRepo.search(query.trim());
  }
}
