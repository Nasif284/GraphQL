import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TASKS, GET_USERS } from '../apollo/graphql/queries';
import { CREATE_TASK, UPDATE_TASK, DELETE_TASK } from '../apollo/graphql/mutations';
import { Plus, Trash2, Filter, ChevronLeft, ChevronRight, Clock, AlertCircle, Calendar, RotateCcw } from 'lucide-react';

export const TaskManager: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const limit = 4;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState('TODO');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newAuthorId, setNewAuthorId] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState('');
  const [newTags, setNewTags] = useState('graphql, demo');

  const { data: usersData } = useQuery(GET_USERS);

  const { data, loading, error, refetch } = useQuery(GET_TASKS, {
    variables: {
      filter: {
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        search: searchFilter || undefined
      },
      pagination: { limit, offset }
    },
    fetchPolicy: 'cache-and-network'
  });

  const [createTask, { loading: creating }] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS, variables: { filter: {}, pagination: { limit, offset } } }],
    onCompleted: () => {
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
    }
  });

  const [updateTask] = useMutation(UPDATE_TASK);

  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache, { data: deleteData }) {
      if (deleteData?.deleteTask) {
        refetch();
      }
    }
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthorId) return;

    await createTask({
      variables: {
        input: {
          title: newTitle.trim(),
          description: newDescription.trim(),
          status: newStatus,
          priority: newPriority,
          authorId: newAuthorId,
          assigneeId: newAssigneeId || undefined,
          tags: newTags.split(',').map((t) => t.trim()).filter(Boolean)
        }
      }
    });
  };

  const handleStatusChange = async (taskId: string, newStatusValue: string) => {
    await updateTask({
      variables: {
        id: taskId,
        input: { status: newStatusValue }
      },
      optimisticResponse: {
        updateTask: {
          __typename: 'Task',
          id: taskId,
          status: newStatusValue
        }
      }
    });
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask({ variables: { id: taskId } });
    }
  };

  const tasks = data?.tasks?.items || [];
  const pageInfo = data?.tasks?.pageInfo;
  const users = usersData?.users || [];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <Filter className="w-4 h-4 text-pink-400" />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setOffset(0);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500"
          >
            <option value="">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="REVIEW">REVIEW</option>
            <option value="DONE">DONE</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setOffset(0);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500"
          >
            <option value="">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          <input
            type="text"
            placeholder="Search tasks..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setOffset(0);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:border-pink-500"
          />

          {(statusFilter || priorityFilter || searchFilter) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setPriorityFilter('');
                setSearchFilter('');
                setOffset(0);
              }}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <button
          onClick={() => {
            if (users.length > 0 && !newAuthorId) {
              setNewAuthorId(users[0].id);
            }
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-md shadow-pink-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {loading && !data && (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 animate-spin text-pink-400" />
          <span>Loading tasks...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/60 border border-red-500/50 rounded-xl p-4 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">Error loading tasks</p>
            <p className="text-xs text-red-300">{error.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task: any) => (
          <div
            key={task.id}
            className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-white text-base leading-snug">{task.title}</h3>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    task.priority === 'URGENT'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : task.priority === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                {task.description || <span className="italic text-slate-500">No description provided</span>}
              </p>

              {task.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {task.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
              <div className="text-xs text-slate-400 space-y-0.5">
                <div>
                  <span className="text-slate-500">Author:</span>{' '}
                  <span className="text-slate-200 font-medium">{task.author?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">Assignee:</span>{' '}
                  <span className="text-slate-300 font-medium">
                    {task.assignee?.name || <span className="italic text-slate-500">Unassigned</span>}
                  </span>
                </div>
                {task.createdAt && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-0.5">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>
                      {new Date(task.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs font-medium rounded-lg px-2.5 py-1.5 text-pink-300 focus:outline-none focus:border-pink-500"
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="DONE">DONE</option>
                </select>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && !loading && (
        <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-xl p-12 text-center text-slate-400">
          <p className="text-base font-medium">No tasks found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or click "+ New Task" above.</p>
        </div>
      )}

      {pageInfo && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-3.5 flex items-center justify-between text-sm">
          <div className="text-slate-400 text-xs">
            Showing <span className="text-white font-medium">{tasks.length}</span> of{' '}
            <span className="text-white font-medium">{pageInfo.totalCount}</span> tasks
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-slate-200 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              disabled={!pageInfo.hasNextPage}
              onClick={() => setOffset(offset + limit)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-slate-200 transition"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-pink-400" />
              <span>Create Task</span>
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Task title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  placeholder="Task description"
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Author *</label>
                  <select
                    required
                    value={newAuthorId}
                    onChange={(e) => setNewAuthorId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="">Select Author</option>
                    {users.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assignee</label>
                  <select
                    value={newAssigneeId}
                    onChange={(e) => setNewAssigneeId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="">None (Unassigned)</option>
                    {users.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/30 transition disabled:opacity-50"
                >
                  {creating ? 'Saving...' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
