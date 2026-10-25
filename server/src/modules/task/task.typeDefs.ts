export const taskTypeDefs = `#graphql
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

  type Task implements Node {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    tags: [String!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    author: User!
    assignee: User
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

  extend type Query {
    tasks(filter: TaskFilterInput, pagination: PaginationInput): TaskConnection!
    task(id: ID!): Task
  }

  extend type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }

  extend type Subscription {
    taskAdded: Task!
    taskUpdated: Task!
    taskDeleted: ID!
  }
`;
