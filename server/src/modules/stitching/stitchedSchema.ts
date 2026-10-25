import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchSchemas } from '@graphql-tools/stitch';
import { commonResolvers } from '../common/common.resolvers.js';
import { userResolvers } from '../user/user.resolvers.js';
import { taskResolvers } from '../task/task.resolvers.js';
import type { GraphQLContext } from '../../context/index.js';

const userSubschemaTypeDefs = `#graphql
  scalar DateTime

  enum UserRole {
    ADMIN
    DEVELOPER
    DESIGNER
    MANAGER
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    avatarUrl: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateUserInput {
    name: String!
    email: String!
    role: UserRole = DEVELOPER
    avatarUrl: String
  }

  input UpdateUserInput {
    name: String
    email: String
    role: UserRole
    avatarUrl: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;

const standaloneUserSchema = makeExecutableSchema({
  typeDefs: userSubschemaTypeDefs,
  resolvers: [
    { DateTime: commonResolvers.DateTime },
    {
      Query: userResolvers.Query,
      Mutation: userResolvers.Mutation,
      User: {
        id: (parent: any) => parent._id?.toString() || parent.id
      }
    }
  ]
});

const taskSubschemaTypeDefs = `#graphql
  scalar DateTime

  enum TaskStatus {
    TODO
    IN_PROGRESS
    REVIEW
    DONE
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  type PageInfo {
    totalCount: Int!
    limit: Int!
    offset: Int!
    hasNextPage: Boolean!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    authorId: ID!
    assigneeId: ID
    tags: [String!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input TaskFilterInput {
    status: TaskStatus
    priority: TaskPriority
    authorId: ID
    assigneeId: ID
    search: String
  }

  input PaginationInput {
    limit: Int = 10
    offset: Int = 0
  }

  type TaskConnection {
    items: [Task!]!
    pageInfo: PageInfo!
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: TaskStatus = TODO
    priority: TaskPriority = MEDIUM
    authorId: ID!
    assigneeId: ID
    tags: [String!] = []
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    priority: TaskPriority
    assigneeId: ID
    tags: [String!]
  }

  type Query {
    tasks(filter: TaskFilterInput, pagination: PaginationInput): TaskConnection!
    task(id: ID!): Task
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }

  type Subscription {
    taskAdded: Task!
    taskUpdated: Task!
    taskDeleted: ID!
  }
`;

const standaloneTaskSchema = makeExecutableSchema({
  typeDefs: taskSubschemaTypeDefs,
  resolvers: [
    { DateTime: commonResolvers.DateTime },
    {
      Query: taskResolvers.Query,
      Mutation: taskResolvers.Mutation,
      Subscription: taskResolvers.Subscription,
      TaskConnection: taskResolvers.TaskConnection,
      Task: {
        id: (parent: any) => parent._id?.toString() || parent.id,
        authorId: (parent: any) => parent.authorId?.toString(),
        assigneeId: (parent: any) => parent.assigneeId?.toString() || null
      }
    }
  ]
});

export const stitchedSchema = stitchSchemas({
  subschemas: [
    { schema: standaloneUserSchema },
    { schema: standaloneTaskSchema }
  ],
  typeDefs: `#graphql
    extend type Task {
      author: User!
      assignee: User
    }

    extend type User {
      tasks: [Task!]!
    }
  `,
  resolvers: {
    Task: {
      author: {
        selectionSet: `{ authorId }`,
        resolve: async (task: any, _: any, context: GraphQLContext) => {
          return context.loaders.userLoader.load(task.authorId);
        }
      },
      assignee: {
        selectionSet: `{ assigneeId }`,
        resolve: async (task: any, _: any, context: GraphQLContext) => {
          if (!task.assigneeId) return null;
          return context.loaders.userLoader.load(task.assigneeId);
        }
      }
    },
    User: {
      tasks: {
        selectionSet: `{ id }`,
        resolve: async (user: any, _: any, context: GraphQLContext) => {
          return context.loaders.tasksByAuthorLoader.load(user.id);
        }
      }
    }
  }
});
