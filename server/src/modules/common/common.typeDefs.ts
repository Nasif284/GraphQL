export const commonTypeDefs = `#graphql
  scalar DateTime

  interface Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum SortOrder {
    ASC
    DESC
  }

  union SearchResult = User | Task

  type PageInfo {
    totalCount: Int!
    limit: Int!
    offset: Int!
    hasNextPage: Boolean!
  }

  type Query {
    globalSearch(query: String!): [SearchResult!]!
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;
