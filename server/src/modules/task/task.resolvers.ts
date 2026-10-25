import type { GraphQLContext } from '../../context/index.js';
import type { ITask } from './task.model.js';
import { pubsub, TOPICS } from '../../config/pubsub.js';

export const taskResolvers = {
  Query: {
    tasks: async (
      _: unknown,
      { filter, pagination }: { filter?: any; pagination?: any },
      context: GraphQLContext
    ) => {
      return context.services.taskService.getTasks(filter || {}, pagination || {});
    },
    task: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      return context.services.taskService.getTaskById(id);
    }
  },

  Mutation: {
    createTask: async (_: unknown, { input }: { input: any }, context: GraphQLContext) => {
      return context.services.taskService.createTask(input);
    },
    updateTask: async (_: unknown, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      return context.services.taskService.updateTask(id, input);
    },
    deleteTask: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      return context.services.taskService.deleteTask(id);
    }
  },

  Subscription: {
    taskAdded: {
      subscribe: () => pubsub.asyncIterableIterator([TOPICS.TASK_ADDED])
    },
    taskUpdated: {
      subscribe: () => pubsub.asyncIterableIterator([TOPICS.TASK_UPDATED])
    },
    taskDeleted: {
      subscribe: () => pubsub.asyncIterableIterator([TOPICS.TASK_DELETED])
    }
  },

  TaskConnection: {
    pageInfo: (parent: any) =>
      parent.pageInfo || {
        totalCount: parent.totalCount ?? 0,
        limit: parent.limit ?? 10,
        offset: parent.offset ?? 0,
        hasNextPage: parent.hasNextPage ?? false
      }
  },

  Task: {
    id: (parent: ITask) => parent._id?.toString() || parent.id,
    author: async (parent: ITask, _: unknown, context: GraphQLContext) => {
      const authorId = parent.authorId.toString();
      return context.loaders.userLoader.load(authorId);
    },
    assignee: async (parent: ITask, _: unknown, context: GraphQLContext) => {
      if (!parent.assigneeId) return null;
      const assigneeId = parent.assigneeId.toString();
      return context.loaders.userLoader.load(assigneeId);
    }
  }
};
