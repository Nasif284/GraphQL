import React, { useState } from 'react';
import { useSubscription } from '@apollo/client';
import { TASK_ADDED_SUBSCRIPTION, TASK_UPDATED_SUBSCRIPTION } from '../apollo/graphql/subscriptions';
import { Radio, X } from 'lucide-react';

export const LiveNotification: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);

  useSubscription(TASK_ADDED_SUBSCRIPTION, {
    onData: ({ data }) => {
      const task = data.data?.taskAdded;
      if (task) {
        setNotification(`Task created: "${task.title}" by ${task.author?.name}`);
      }
    }
  });

  useSubscription(TASK_UPDATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      const task = data.data?.taskUpdated;
      if (task) {
        setNotification(`Task updated: "${task.title}" -> ${task.status}`);
      }
    }
  });

  if (!notification) return null;

  return (
    <div className="bg-pink-950/80 border-b border-pink-500/40 text-pink-200 px-4 py-2.5 shadow-inner flex items-center justify-between animate-fadeIn">
      <div className="max-w-7xl mx-auto flex items-center gap-3 w-full">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-semibold border border-pink-500/40">
          <Radio className="w-3.5 h-3.5" />
          <span>Live</span>
        </div>
        <p className="text-sm font-medium truncate flex-1">{notification}</p>
        <button
          onClick={() => setNotification(null)}
          className="text-pink-400 hover:text-white p-1 rounded transition"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
