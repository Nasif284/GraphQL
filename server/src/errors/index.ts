import { GraphQLError } from 'graphql';

export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

export class AppGraphQLError extends GraphQLError {
  constructor(message: string, code: ErrorCode, details?: Record<string, any>) {
    super(message, {
      extensions: {
        code,
        ...details,
        timestamp: new Date().toISOString()
      }
    });
  }
}

export const createNotFoundError = (resource: string, id?: string) => {
  return new AppGraphQLError(
    `${resource} ${id ? `with id '${id}' ` : ''}was not found`,
    ErrorCode.NOT_FOUND,
    { resource, resourceId: id }
  );
};

export const createValidationError = (message: string, fields?: Record<string, string>) => {
  return new AppGraphQLError(
    message,
    ErrorCode.BAD_USER_INPUT,
    { validationErrors: fields }
  );
};
