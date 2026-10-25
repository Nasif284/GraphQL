import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks($filter: TaskFilterInput, $pagination: PaginationInput) {
    tasks(filter: $filter, pagination: $pagination) {
      items {
        id
        title
        description
        status
        priority
        tags
        createdAt
        updatedAt
        author {
          id
          name
          email
          role
        }
        assignee {
          id
          name
          email
          role
        }
      }
      pageInfo {
        totalCount
        limit
        offset
        hasNextPage
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      avatarUrl
      tasks {
        id
        title
        status
      }
    }
  }
`;

export const GLOBAL_SEARCH = gql`
  query GlobalSearch($query: String!) {
    globalSearch(query: $query) {
      __typename
      ... on User {
        id
        name
        email
        role
        createdAt
      }
      ... on Task {
        id
        title
        description
        status
        priority
        createdAt
        author {
          name
        }
      }
    }
  }
`;
