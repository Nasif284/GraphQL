# GraphQL Learning Demo Project

A production-ready, beginner-friendly demo project demonstrating **GraphQL** using a clean **Layered Architecture** (`Resolver -> Service -> Repository`).

Built with **Node.js**, **Express**, **Apollo Server v4**, **MongoDB / Mongoose**, **graphql-ws**, **DataLoader**, and a modern **React + Vite + Apollo Client** frontend.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/graphql_learning_db`)

### 1. Start the GraphQL Server
```bash
cd server
npm install
npm run dev
```
The server will automatically connect to MongoDB, seed sample data, and start at:
- **Apollo Sandbox & GraphQL Endpoint:** `http://localhost:4000/graphql`
- **Schema Stitching Demo Endpoint:** `http://localhost:4000/graphql-stitched`
- **WebSocket Subscriptions:** `ws://localhost:4000/graphql`

### 2. Start the React Apollo Client
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Architecture

```
graphQl/
├── SYLLABUS_STUDY_GUIDE.md        # Comprehensive study guide answering your complete syllabus
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts              # Mongoose connection
│   │   │   ├── pubsub.ts          # PubSub subscription instance & topics
│   │   │   └── seed.ts            # Realistic demo data seeder
│   │   ├── context/
│   │   │   ├── dataLoaders.ts     # DataLoader (Solves N+1 query problem)
│   │   │   └── index.ts           # Apollo request context & auth factory
│   │   ├── errors/
│   │   │   └── index.ts           # Custom GraphQL errors & error codes
│   │   ├── modules/
│   │   │   ├── common/            # Custom DateTime scalar, Node interface, SearchResult union
│   │   │   ├── user/              # User Model, Repository, Service, TypeDefs, Resolvers
│   │   │   ├── task/              # Task Model, Repository, Service, TypeDefs, Resolvers
│   │   │   └── stitching/         # Schema Stitching implementation (@graphql-tools/stitch)
│   │   ├── schema.ts              # Modular schema composition (@graphql-tools/schema)
│   │   └── server.ts              # Express + Apollo Server 4 + WebSocket server
└── client/
    ├── src/
    │   ├── apollo/
    │   │   ├── client.ts          # Split HTTP & WebSocket Apollo Client setup
    │   │   └── graphql/           # Queries, Mutations, Subscriptions documents
    │   ├── components/
    │   │   ├── Navbar.tsx         # Header navigation & Apollo Sandbox links
    │   │   ├── TaskManager.tsx    # Live CRUD, filtering, pagination, optimistic UI
    │   │   ├── GlobalSearch.tsx   # Union types (SearchResult) & Interface showcase
    │   │   ├── LiveNotification.tsx # Real-time subscription alert banner
    │   │   └── SyllabusGuide.tsx  # In-app interactive learning companion
    │   ├── App.tsx
    │   └── main.tsx
```

---

## 🎯 Syllabus Coverage Matrix

| Syllabus Topic | Implementation in this Codebase |
| :--- | :--- |
| **GraphQL vs REST** | In-depth breakdown in `SYLLABUS_STUDY_GUIDE.md` & UI Syllabus Guide |
| **Schema & SDL** | `server/src/modules/task/task.typeDefs.ts`, `user.typeDefs.ts` |
| **Queries & Mutations** | Full CRUD implementation in `TaskManager.tsx` & Resolvers |
| **Subscriptions (Real-time)** | `graphql-ws` + `pubsub.publish` on backend, `useSubscription` in `LiveNotification.tsx` |
| **Resolvers & Arguments** | `task.resolvers.ts`, `user.resolvers.ts` |
| **Scalars, Objects, Enums** | `TaskStatus`, `TaskPriority`, `UserRole`, `DateTime` custom scalar |
| **Interfaces & Unions** | `Node` interface, `union SearchResult = User \| Task` in `GlobalSearch.tsx` |
| **Pagination & Filtering** | Limit/offset pagination and status/priority filters in `TaskRepository` |
| **Mongoose & MongoDB** | `UserModel`, `TaskModel`, CRUD repository operations |
| **Error Handling** | `AppGraphQLError` with extension codes (`NOT_FOUND`, `BAD_USER_INPUT`) |
| **Apollo Client in React** | `useQuery`, `useMutation`, `useSubscription`, `InMemoryCache` |
| **DataLoader (N+1 Solution)** | `server/src/context/dataLoaders.ts` batching author and task requests |
| **Schema Stitching** | `server/src/modules/stitching/stitchedSchema.ts` stitching User and Task subschemas |
