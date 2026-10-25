import { makeExecutableSchema } from '@graphql-tools/schema';
import { commonTypeDefs } from './modules/common/common.typeDefs.js';
import { commonResolvers } from './modules/common/common.resolvers.js';
import { userTypeDefs } from './modules/user/user.typeDefs.js';
import { userResolvers } from './modules/user/user.resolvers.js';
import { taskTypeDefs } from './modules/task/task.typeDefs.js';
import { taskResolvers } from './modules/task/task.resolvers.js';


export const schema = makeExecutableSchema({
  typeDefs: [commonTypeDefs, userTypeDefs, taskTypeDefs],
  resolvers: [commonResolvers, userResolvers, taskResolvers]
});
