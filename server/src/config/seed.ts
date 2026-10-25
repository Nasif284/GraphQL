import { UserModel, UserRole } from '../modules/user/user.model.js';
import { TaskModel, TaskStatus, TaskPriority } from '../modules/task/task.model.js';

export async function seedInitialData(): Promise<void> {
  const existingUsersCount = await UserModel.countDocuments();
  if (existingUsersCount > 0) {
    return;
  }

  const users = await UserModel.insertMany([
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: UserRole.MANAGER,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: UserRole.DEVELOPER,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    },
    {
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      role: UserRole.DESIGNER,
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'
    }
  ]);

  const [alice, bob, charlie] = users;

  await TaskModel.insertMany([
    {
      title: 'Design GraphQL Architecture',
      description: 'Implement Resolver -> Service -> Repository layer pattern for the backend.',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      authorId: alice._id,
      assigneeId: bob._id,
      tags: ['architecture', 'backend', 'graphql']
    },
    {
      title: 'Implement DataLoader for N+1 Batching',
      description: 'Ensure user and task relational queries batch database queries efficiently.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.URGENT,
      authorId: bob._id,
      assigneeId: bob._id,
      tags: ['performance', 'dataloader']
    },
    {
      title: 'Setup GraphQL Subscriptions with WebSockets',
      description: 'Allow live real-time updates when tasks are created or modified.',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      authorId: alice._id,
      assigneeId: charlie._id,
      tags: ['realtime', 'websockets']
    },
    {
      title: 'Create React Apollo Client UI',
      description: 'Build responsive task board with useQuery, useMutation, and useSubscription hooks.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      authorId: charlie._id,
      assigneeId: charlie._id,
      tags: ['frontend', 'react', 'apollo-client']
    },
    {
      title: 'Document Schema Stitching & Federation',
      description: 'Write clear architectural guide contrasting Schema Stitching vs Apollo Federation.',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      authorId: alice._id,
      assigneeId: bob._id,
      tags: ['documentation', 'learning']
    }
  ]);
}
