import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/client';
import { Navbar } from './components/Navbar';
import { LiveNotification } from './components/LiveNotification';
import { TaskManager } from './components/TaskManager';
import { GlobalSearch } from './components/GlobalSearch';
import { SyllabusGuide } from './components/SyllabusGuide';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'search' | 'syllabus'>('tasks');

  return (
    <ApolloProvider client={apolloClient}>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <LiveNotification />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'tasks' && <TaskManager />}
          {activeTab === 'search' && <GlobalSearch />}
          {activeTab === 'syllabus' && <SyllabusGuide />}
        </main>

        <footer className="border-t border-slate-800 bg-slate-900/80 py-4 text-center text-xs text-slate-500">
          GraphQL Beginner Demo &bull; Layered Architecture &bull; Node.js + Express + Apollo Server + MongoDB + React
        </footer>
      </div>
    </ApolloProvider>
  );
};

export default App;
