import type { GraphQLContext } from '../../context/index.js';
import type { IUser } from './user.model.js';

export const userResolvers = {
  Query: {
    users: async (_: unknown, __: unknown, context: GraphQLContext) => {
      return context.services.userService.getAllUsers();
    },
    user: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      return context.services.userService.getUserById(id);
    }
  },

  Mutation: {
    createUser: async (_: unknown, { input }: { input: any }, context: GraphQLContext) => {
      return context.services.userService.createUser(input);
    },
    updateUser: async (_: unknown, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      return context.services.userService.updateUser(id, input);
    },
    deleteUser: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      return context.services.userService.deleteUser(id);
    }
  },

  User: {
    id: (parent: IUser) => parent._id?.toString() || parent.id,
    tasks: async (parent: IUser, _: unknown, context: GraphQLContext) => {
      const userId = parent._id?.toString() || parent.id;
      return context.loaders.tasksByAuthorLoader.load(userId);
    }
  }
};
