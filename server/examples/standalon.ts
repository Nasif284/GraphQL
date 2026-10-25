import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  enum TaskStatus {
    TODO
    IN_PROGRESS
    COMPLETED
  }

  type Task {
    id: ID!
    title: String!
    status: TaskStatus!
  }

  input CreateTaskInput {
    title: String!
    status: TaskStatus
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
  }
`;

type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
};

type CreateTaskInput = {
  title: string;
  status?: TaskStatus;
};

const tasks: Task[] = [
  {
    id: "1",
    title: "Learn GraphQL",
    status: "IN_PROGRESS",
  },
];

const resolvers = {
  Query: {
    tasks: (): Task[] => tasks,

    task: (
      _parent: unknown,
      args: { id: string },
    ): Task | null => {
      return tasks.find((task) => task.id === args.id) ?? null;
    },
  },

  Mutation: {
    createTask: (
      _parent: unknown,
      args: { input: CreateTaskInput },
    ): Task => {
      const task: Task = {
        id: String(Date.now()),
        title: args.input.title,
        status: args.input.status ?? "TODO",
      };

      tasks.push(task);
      return task;
    },
  },
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`GraphQL server ready at ${url}`);
}

startServer().catch(console.error);