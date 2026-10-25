import { Request } from 'express';
import { UserRepository } from '../modules/user/user.repository.js';
import { UserService } from '../modules/user/user.service.js';
import { TaskRepository } from '../modules/task/task.repository.js';
import { TaskService } from '../modules/task/task.service.js';
import { createDataLoaders, DataLoaders } from './dataLoaders.js';

export const userRepository = new UserRepository();
export const taskRepository = new TaskRepository();

export const userService = new UserService(userRepository);
export const taskService = new TaskService(taskRepository, userRepository);

export interface GraphQLContext {
  req?: Request;
  services: {
    userService: UserService;
    taskService: TaskService;
  };
  loaders: DataLoaders;
  currentUser?: { id: string; role: string };
}

export async function createContext({ req }: { req?: Request }): Promise<GraphQLContext> {
  const authHeader = req?.headers?.authorization;
  let currentUser;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    currentUser = { id: 'mock-user-id', role: 'DEVELOPER' };
  }

  return {
    req,
    services: {
      userService,
      taskService
    },
    loaders: createDataLoaders(userRepository, taskRepository),
    currentUser
  };
}
