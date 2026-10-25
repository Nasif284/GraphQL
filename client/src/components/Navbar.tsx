import React from 'react';
import { Layers, Search, BookOpen, Terminal } from 'lucide-react';

interface NavbarProps {
  activeTab: 'tasks' | 'search' | 'syllabus';
  setActiveTab: (tab: 'tasks' | 'search' | 'syllabus') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xl border border-pink-500/30">
            G
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight flex items-center gap-2">
              GraphQL Learning Lab
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Layered Architecture
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Resolver &rarr; Service &rarr; Repository
            </p>
          </div>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'tasks'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'search'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'syllabus'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Syllabus Guide</span>
          </button>
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <a
            href="http://localhost:4000/graphql"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition"
          >
            <Terminal className="w-3.5 h-3.5 text-pink-400" />
            <span>Apollo Sandbox</span>
          </a>
        </div>
      </div>
    </header>
  );
};
