import { gql } from '@apollo/client';

export const TASK_ADDED_SUBSCRIPTION = gql`
  subscription OnTaskAdded {
    taskAdded {
      id
      title
      description
      status
      priority
      tags
      createdAt
      author {
        id
        name
      }
      assignee {
        id
        name
      }
    }
  }
`;

export const TASK_UPDATED_SUBSCRIPTION = gql`
  subscription OnTaskUpdated {
    taskUpdated {
      id
      title
      status
      priority
      updatedAt
      assignee {
        id
        name
      }
    }
  }
`;

export const TASK_DELETED_SUBSCRIPTION = gql`
  subscription OnTaskDeleted {
    taskDeleted
  }
`;
