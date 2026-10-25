import { GraphQLScalarType, Kind } from 'graphql';
import type { GraphQLContext } from '../../context/index.js';

export const commonResolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'ISO-8601 DateTime scalar',
    serialize(value: any) {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return new Date(value).toISOString();
    },
    parseValue(value: any) {
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    }
  }),

  Node: {
    __resolveType(obj: any) {
      if (obj.email) return 'User';
      if (obj.title) return 'Task';
      return null;
    }
  },

  SearchResult: {
    __resolveType(obj: any) {
      if (obj.email) return 'User';
      if (obj.title) return 'Task';
      return null;
    }
  },

  Query: {
    globalSearch: async (_: unknown, { query }: { query: string }, context: GraphQLContext) => {
      const [users, tasks] = await Promise.all([
        context.services.userService.searchUsers(query),
        context.services.taskService.searchTasks(query)
      ]);
      return [...users, ...tasks];
    }
  }
};
