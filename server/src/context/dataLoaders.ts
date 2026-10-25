import DataLoader from 'dataloader';
import { UserRepository } from '../modules/user/user.repository.js';
import { TaskRepository } from '../modules/task/task.repository.js';
import { IUser } from '../modules/user/user.model.js';
import { ITask } from '../modules/task/task.model.js';

export interface DataLoaders {
  userLoader: DataLoader<string, IUser | null>;
  tasksByAuthorLoader: DataLoader<string, ITask[]>;
}

export function createDataLoaders(
  userRepo: UserRepository,
  taskRepo: TaskRepository
): DataLoaders {
  const userLoader = new DataLoader<string, IUser | null>(
    async (userIds: readonly string[]) => {
      return userRepo.findByIds(userIds);
    },
    { cache: true }
  );

  const tasksByAuthorLoader = new DataLoader<string, ITask[]>(
    async (authorIds: readonly string[]) => {
      return taskRepo.findByAuthorIds(authorIds);
    },
    { cache: true }
  );

  return {
    userLoader,
    tasksByAuthorLoader
  };
}
