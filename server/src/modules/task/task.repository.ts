import { TaskModel, ITask, TaskStatus, TaskPriority } from './task.model.js';
import mongoose from 'mongoose';

export interface TaskFilterArgs {
  status?: TaskStatus;
  priority?: TaskPriority;
  authorId?: string;
  assigneeId?: string;
  search?: string;
}

export interface PaginationArgs {
  limit?: number;
  offset?: number;
}

export interface PageInfo {
  totalCount: number;
  limit: number;
  offset: number;
  hasNextPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pageInfo: PageInfo;
  totalCount: number;
  limit: number;
  offset: number;
  hasNextPage: boolean;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  authorId: string;
  assigneeId?: string;
  tags?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  tags?: string[];
}

export class TaskRepository {
  async findPaginated(
    filter: TaskFilterArgs = {},
    pagination: PaginationArgs = {}
  ): Promise<PaginatedResult<ITask>> {
    const limit = Math.max(1, Math.min(pagination.limit || 10, 100));
    const offset = Math.max(0, pagination.offset || 0);

    const query: any = {};

    if (filter.status) {
      query.status = filter.status;
    }
    if (filter.priority) {
      query.priority = filter.priority;
    }
    if (filter.authorId) {
      query.authorId = new mongoose.Types.ObjectId(filter.authorId);
    }
    if (filter.assigneeId) {
      query.assigneeId = new mongoose.Types.ObjectId(filter.assigneeId);
    }
    if (filter.search) {
      const regex = new RegExp(filter.search, 'i');
      query.$or = [{ title: regex }, { description: regex }, { tags: regex }];
    }

    const [items, totalCount] = await Promise.all([
      TaskModel.find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .exec(),
      TaskModel.countDocuments(query).exec()
    ]);

    const pageInfo: PageInfo = {
      totalCount,
      limit,
      offset,
      hasNextPage: offset + items.length < totalCount
    };

    return {
      items,
      pageInfo,
      totalCount,
      limit,
      offset,
      hasNextPage: pageInfo.hasNextPage
    };
  }

  async findById(id: string): Promise<ITask | null> {
    return TaskModel.findById(id).exec();
  }

  async findByIds(ids: readonly string[]): Promise<(ITask | null)[]> {
    const tasks = await TaskModel.find({ _id: { $in: ids } }).exec();
    const taskMap = new Map(tasks.map((t) => [t._id.toString(), t]));
    return ids.map((id) => taskMap.get(id) || null);
  }

  async findByAuthorIds(authorIds: readonly string[]): Promise<ITask[][]> {
    const objectIds = authorIds.map((id) => new mongoose.Types.ObjectId(id));
    const tasks = await TaskModel.find({ authorId: { $in: objectIds } })
      .sort({ createdAt: -1 })
      .exec();

    const map = new Map<string, ITask[]>();
    for (const authorId of authorIds) {
      map.set(authorId, []);
    }
    for (const task of tasks) {
      const aId = task.authorId.toString();
      const list = map.get(aId) || [];
      list.push(task);
      map.set(aId, list);
    }

    return authorIds.map((id) => map.get(id) || []);
  }

  async create(data: CreateTaskData): Promise<ITask> {
    const task = new TaskModel({
      ...data,
      authorId: new mongoose.Types.ObjectId(data.authorId),
      assigneeId: data.assigneeId ? new mongoose.Types.ObjectId(data.assigneeId) : null
    });
    return task.save();
  }

  async update(id: string, data: UpdateTaskData): Promise<ITask | null> {
    const payload: any = { ...data };
    if (data.assigneeId !== undefined) {
      payload.assigneeId = data.assigneeId ? new mongoose.Types.ObjectId(data.assigneeId) : null;
    }
    return TaskModel.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await TaskModel.findByIdAndDelete(id).exec();
    return Boolean(result);
  }

  async search(term: string): Promise<ITask[]> {
    const regex = new RegExp(term, 'i');
    return TaskModel.find({
      $or: [{ title: regex }, { description: regex }, { tags: regex }]
    }).exec();
  }
}
