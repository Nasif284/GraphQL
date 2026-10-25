export const userTypeDefs = `#graphql
  enum UserRole {
    ADMIN
    DEVELOPER
    DESIGNER
    MANAGER
  }

  type User implements Node {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    avatarUrl: String
    createdAt: DateTime!
    updatedAt: DateTime!
    tasks: [Task!]!
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

  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;
