import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GLOBAL_SEARCH } from '../apollo/graphql/queries';
import { Search, User as UserIcon, CheckSquare, Layers, Clock } from 'lucide-react';

export const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [executeSearch, { data, loading, error, called }] = useLazyQuery(GLOBAL_SEARCH);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    executeSearch({ variables: { query: searchTerm.trim() } });
  };

  const results = data?.globalSearch || [];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-pink-400" />
          <span>Polymorphic Search (Union Types)</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Queries both Users and Tasks in a single heterogeneous query using{' '}
          <code className="text-pink-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">
            union SearchResult = User | Task
          </code>.
        </p>

        <pre className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3 text-xs font-mono text-slate-300 overflow-x-auto">
{`query GlobalSearch($query: String!) {
  globalSearch(query: $query) {
    __typename
    ... on User {
      id
      name
      email
      role
    }
    ... on Task {
      id
      title
      status
      author { name }
    }
  }
}`}
        </pre>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search across users and tasks (e.g., 'Alice', 'DataLoader')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 shadow-inner"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 hover:bg-pink-500 text-white font-medium text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-pink-600/30 transition disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && (
        <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 animate-spin text-pink-400" />
          <span>Searching...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/60 border border-red-500/50 rounded-xl p-4 text-red-200 text-sm">
          {error.message}
        </div>
      )}

      {called && !loading && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Found {results.length} results
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item: any, idx: number) => {
              const isUser = item.__typename === 'User';

              return (
                <div
                  key={item.id || idx}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow flex flex-col justify-between hover:border-slate-600 transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      {isUser ? (
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                          <CheckSquare className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                          {item.__typename}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs text-slate-500 font-mono">ID: {item.id}</span>
                  </div>

                  {isUser ? (
                    <div>
                      <h3 className="font-semibold text-white text-base">{item.name}</h3>
                      <p className="text-slate-400 text-xs mt-0.5">{item.email}</p>
                      <div className="mt-3">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          Role: {item.role}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-white text-base">{item.title}</h3>
                      <p className="text-slate-300 text-xs mt-1 line-clamp-2">
                        {item.description || 'No description'}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40">
                          Status: {item.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          Author: <strong className="text-slate-200">{item.author?.name}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {results.length === 0 && (
            <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-400 text-sm">
              No matching users or tasks found. Try searching "Alice" or "GraphQL".
            </div>
          )}
        </div>
      )}
    </div>
  );
};
