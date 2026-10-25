import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Code2, Server, Database, Zap, Cpu } from 'lucide-react';

export const SyllabusGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'foundations' | 'architecture' | 'apollo' | 'optimization' | 'stitching'>('foundations');

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-pink-400" />
          <h2 className="text-xl font-bold text-white">GraphQL Syllabus Guide & Concepts</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Detailed reference mapping the theoretical concepts to the implementation in this project.
        </p>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700">
          <button
            onClick={() => setActiveSection('foundations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'foundations'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            1. GraphQL vs REST & Schema
          </button>
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'architecture'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            2. Layered Architecture
          </button>
          <button
            onClick={() => setActiveSection('apollo')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'apollo'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            3. Apollo Client (Hooks & Cache)
          </button>
          <button
            onClick={() => setActiveSection('optimization')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'optimization'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            4. DataLoader Optimization
          </button>
          <button
            onClick={() => setActiveSection('stitching')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'stitching'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            5. Schema Stitching vs Federation
          </button>
        </div>
      </div>

      {activeSection === 'foundations' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Key Differences: GraphQL vs. REST</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700/60">
                <span className="font-bold text-red-400 block mb-2 text-sm">Traditional REST API</span>
                <ul className="space-y-2 text-slate-300 list-disc list-inside">
                  <li><strong>Multiple Endpoints:</strong> <code>/users</code>, <code>/tasks</code>, <code>/users/:id/tasks</code>.</li>
                  <li><strong>Over-fetching:</strong> Returns all fields even if only a few are needed.</li>
                  <li><strong>Under-fetching:</strong> Multiple network roundtrips required for nested relations.</li>
                  <li><strong>Contract:</strong> Documentation can drift from actual implementation.</li>
                </ul>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-lg border border-pink-500/30">
                <span className="font-bold text-pink-400 block mb-2 text-sm">GraphQL API</span>
                <ul className="space-y-2 text-slate-300 list-disc list-inside">
                  <li><strong>Single Endpoint:</strong> Only <code>/graphql</code> via POST.</li>
                  <li><strong>Exact Fetching:</strong> Client queries only the exact fields required.</li>
                  <li><strong>Nested Resolution:</strong> Resolves related entities in a single request.</li>
                  <li><strong>Strict Contract:</strong> Strongly-typed SDL schema as source of truth.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-pink-400" />
              <span>Type System Summary</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded border border-slate-700">
                <span className="font-semibold text-pink-400 block mb-1">Custom Scalar</span>
                <p className="text-slate-300 mb-2"><code>scalar DateTime</code> with ISO-8601 formatting.</p>
                <span className="text-slate-500 font-mono text-[10px]">src/modules/common/</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded border border-slate-700">
                <span className="font-semibold text-pink-400 block mb-1">Interface</span>
                <p className="text-slate-300 mb-2"><code>interface Node</code> ensures standard audit fields.</p>
                <span className="text-slate-500 font-mono text-[10px]">Implemented by User & Task</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded border border-slate-700">
                <span className="font-semibold text-pink-400 block mb-1">Union Type</span>
                <p className="text-slate-300 mb-2"><code>union SearchResult = User | Task</code>.</p>
                <span className="text-slate-500 font-mono text-[10px]">globalSearch(query)</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded border border-slate-700">
                <span className="font-semibold text-pink-400 block mb-1">Enums</span>
                <p className="text-slate-300 mb-2"><code>TaskStatus</code>, <code>TaskPriority</code>, <code>UserRole</code>.</p>
                <span className="text-slate-500 font-mono text-[10px]">Type safety on both client & server</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded border border-slate-700">
                <span className="font-semibold text-pink-400 block mb-1">Input Types</span>
                <p className="text-slate-300 mb-2"><code>CreateTaskInput</code>, <code>TaskFilterInput</code>, etc.</p>
                <span className="text-slate-500 font-mono text-[10px]">Structured mutations</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded border border-slate-700">
                <span className="font-semibold text-pink-400 block mb-1">Subscriptions</span>
                <p className="text-slate-300 mb-2"><code>taskAdded</code>, <code>taskUpdated</code>.</p>
                <span className="text-slate-500 font-mono text-[10px]">graphql-ws over WebSocket</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'architecture' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" />
              <span>3-Tier Architecture (Resolver &rarr; Service &rarr; Repository)</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Clear separation between GraphQL transport, business rules, and database operations:
            </p>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/90 border-l-4 border-indigo-500 p-3 rounded-r-lg">
                <strong className="text-indigo-400 text-sm block">1. GraphQL Resolver Layer</strong>
                <p className="text-slate-300 mt-1">
                  Handles the GraphQL protocol: unpacks query arguments, handles auth from context, and delegates to services or DataLoaders.
                </p>
                <span className="font-mono text-slate-500 text-[11px] block mt-1">server/src/modules/task/task.resolvers.ts</span>
              </div>

              <div className="bg-slate-900/90 border-l-4 border-pink-500 p-3 rounded-r-lg">
                <strong className="text-pink-400 text-sm block">2. Service Layer</strong>
                <p className="text-slate-300 mt-1">
                  Enforces domain business rules, validates inputs, and triggers real-time PubSub events. Independent of GraphQL AST and HTTP.
                </p>
                <span className="font-mono text-slate-500 text-[11px] block mt-1">server/src/modules/task/task.service.ts</span>
              </div>

              <div className="bg-slate-900/90 border-l-4 border-emerald-500 p-3 rounded-r-lg">
                <strong className="text-emerald-400 text-sm block">3. Repository Layer</strong>
                <p className="text-slate-300 mt-1">
                  Database queries with Mongoose: pagination, filters, and batch loading methods for DataLoader.
                </p>
                <span className="font-mono text-slate-500 text-[11px] block mt-1">server/src/modules/task/task.repository.ts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'apollo' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-pink-400" />
              <span>Apollo Client in React</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Configured with a split link to route queries/mutations to HTTP and subscriptions to WebSocket.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-700">
                <strong className="text-sky-400 block mb-1">useQuery</strong>
                <p className="text-slate-300 mb-2">Fetches data with built-in <code>loading</code>, <code>error</code>, and <code>data</code> states.</p>
                <pre className="bg-slate-950 p-2 rounded text-[11px] font-mono text-slate-400 overflow-x-auto">
{`const { data, loading, error } = 
  useQuery(GET_TASKS, { 
    variables: { filter, pagination } 
  });`}
                </pre>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-700">
                <strong className="text-pink-400 block mb-1">useMutation</strong>
                <p className="text-slate-300 mb-2">Executes mutations with cache invalidation and optimistic updates.</p>
                <pre className="bg-slate-950 p-2 rounded text-[11px] font-mono text-slate-400 overflow-x-auto">
{`const [createTask] = useMutation(
  CREATE_TASK, {
    refetchQueries: [GET_TASKS]
  }
);`}
                </pre>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-700">
                <strong className="text-emerald-400 block mb-1">useSubscription</strong>
                <p className="text-slate-300 mb-2">Listens over WebSocket for instant live alerts on data changes.</p>
                <pre className="bg-slate-950 p-2 rounded text-[11px] font-mono text-slate-400 overflow-x-auto">
{`useSubscription(
  TASK_ADDED_SUBSCRIPTION, {
    onData: ({ data }) => { ... }
  }
);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'optimization' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>DataLoader (Solving N+1 Queries)</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              When querying tasks with authors (<code>tasks &#123; id author &#123; name &#125; &#125;</code>), a naive implementation makes 1 query for tasks + N queries for authors.
            </p>

            <div className="bg-slate-900/90 border border-slate-700 rounded-lg p-4 text-xs font-mono text-slate-300 space-y-2">
              <div className="text-pink-400 font-bold">DataLoader Flow:</div>
              <div>1. Coalesces individual author lookups within a single Node.js event tick.</div>
              <div>2. Executes a single bulk query: <code className="text-emerald-400">UserModel.find(&#123; _id: &#123; $in: [...] &#125; &#125;)</code>.</div>
              <div>3. Automatically caches results for the duration of that GraphQL request.</div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'stitching' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-pink-400" />
              <span>Schema Stitching vs. Apollo Federation</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Approaches to composing multiple independent GraphQL schemas into a single gateway:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/70 p-4 rounded-lg border border-pink-500/40">
                <span className="font-bold text-pink-400 block mb-1.5 text-sm">Schema Stitching (@graphql-tools/stitch)</span>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  <li>Programmatic: Schema merging happens in TypeScript code.</li>
                  <li>Combines standard GraphQL endpoints without custom directives.</li>
                  <li>Cross-service links defined with type extensions.</li>
                  <li>Accessible in this demo at <code>/graphql-stitched</code>.</li>
                </ul>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-lg border border-indigo-500/40">
                <span className="font-bold text-indigo-400 block mb-1.5 text-sm">Apollo Federation</span>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  <li>Declarative: Uses federation directives (<code>@key</code>, <code>@shareable</code>).</li>
                  <li>Requires an Apollo Router or Apollo Gateway.</li>
                  <li>Best for large multi-team microservice architectures.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
