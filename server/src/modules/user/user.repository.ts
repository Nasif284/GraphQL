import { UserModel, IUser, UserRole } from './user.model.js';

export interface CreateUserData {
  name: string;
  email: string;
  role?: UserRole;
  avatarUrl?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  avatarUrl?: string;
}

export class UserRepository {
  async findAll(): Promise<IUser[]> {
    return UserModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  }

  async findByIds(ids: readonly string[]): Promise<(IUser | null)[]> {
    const users = await UserModel.find({ _id: { $in: ids } }).exec();
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    return ids.map((id) => userMap.get(id) || null);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async create(data: CreateUserData): Promise<IUser> {
    const user = new UserModel(data);
    return user.save();
  }

  async update(id: string, data: UpdateUserData): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return Boolean(result);
  }

  async search(term: string): Promise<IUser[]> {
    const regex = new RegExp(term, 'i');
    return UserModel.find({
      $or: [{ name: regex }, { email: regex }]
    }).exec();
  }
}
