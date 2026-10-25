import { TaskRepository, TaskFilterArgs, PaginationArgs, CreateTaskData, UpdateTaskData, PaginatedResult } from './task.repository.js';
import { UserRepository } from '../user/user.repository.js';
import { ITask } from './task.model.js';
import { pubsub, TOPICS } from '../../config/pubsub.js';
import { createNotFoundError, createValidationError } from '../../errors/index.js';

export class TaskService {
  constructor(
    private taskRepo: TaskRepository,
    private userRepo: UserRepository
  ) {}

  async getTasks(
    filter: TaskFilterArgs,
    pagination: PaginationArgs
  ): Promise<PaginatedResult<ITask>> {
    return this.taskRepo.findPaginated(filter, pagination);
  }

  async getTaskById(id: string): Promise<ITask> {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw createNotFoundError('Task', id);
    }
    return task;
  }

  async createTask(data: CreateTaskData): Promise<ITask> {
    if (!data.title || data.title.trim().length === 0) {
      throw createValidationError('Task title is required');
    }

    const author = await this.userRepo.findById(data.authorId);
    if (!author) {
      throw createValidationError(`Author with ID '${data.authorId}' does not exist`);
    }

    if (data.assigneeId) {
      const assignee = await this.userRepo.findById(data.assigneeId);
      if (!assignee) {
        throw createValidationError(`Assignee with ID '${data.assigneeId}' does not exist`);
      }
    }

    const created = await this.taskRepo.create({
      ...data,
      title: data.title.trim(),
      description: data.description?.trim() || '',
      tags: data.tags?.map((t) => t.trim().toLowerCase()) || []
    });

    pubsub.publish(TOPICS.TASK_ADDED, { taskAdded: created });

    return created;
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<ITask> {
    const existing = await this.taskRepo.findById(id);
    if (!existing) {
      throw createNotFoundError('Task', id);
    }

    if (data.assigneeId) {
      const assignee = await this.userRepo.findById(data.assigneeId);
      if (!assignee) {
        throw createValidationError(`Assignee with ID '${data.assigneeId}' does not exist`);
      }
    }

    const updated = await this.taskRepo.update(id, data);
    if (!updated) {
      throw createNotFoundError('Task', id);
    }

    pubsub.publish(TOPICS.TASK_UPDATED, { taskUpdated: updated });

    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    const existing = await this.taskRepo.findById(id);
    if (!existing) {
      throw createNotFoundError('Task', id);
    }

    const success = await this.taskRepo.delete(id);
    if (success) {
      pubsub.publish(TOPICS.TASK_DELETED, { taskDeleted: id });
    }
    return success;
  }

  async searchTasks(query: string): Promise<ITask[]> {
    if (!query || query.trim().length === 0) return [];
    return this.taskRepo.search(query.trim());
  }
}
