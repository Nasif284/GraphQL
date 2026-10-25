import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

export const TOPICS = {
  TASK_ADDED: 'TASK_ADDED',
  TASK_UPDATED: 'TASK_UPDATED',
  TASK_DELETED: 'TASK_DELETED',
  USER_ADDED: 'USER_ADDED'
} as const;
