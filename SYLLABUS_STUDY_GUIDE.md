# GraphQL Complete Syllabus Study Guide & Architecture Manual

This comprehensive guide accompanies the demo project to help you master every topic in your GraphQL syllabus. It pairs theoretical explanations with direct code references from this project.


## Module 1: GraphQL Foundations & Concepts

### a) What is GraphQL?
GraphQL is an open-source data query and manipulation language for APIs, as well as a runtime for executing queries with existing data. Developed by Facebook in 2012 and open-sourced in 2015, GraphQL allows clients to define the exact structure of the data they need.

### b) Key Differences & Benefits: GraphQL vs. REST

| Feature | REST API | GraphQL API |
| :--- | :--- | :--- |
| **Endpoint Structure** | Multiple specialized endpoints (`/users`, `/tasks`, `/users/:id/tasks`) | Single smart endpoint (typically `/graphql` via HTTP POST) |
| **Over-fetching** | Server determines payload; client receives all fields even if only 1 is needed | Client queries only the exact fields required; no wasted bandwidth |
| **Under-fetching / Waterfall** | Fetching related data requires multiple sequential roundtrips | Resolves nested relational data in a single request |
| **Contract & Typing** | Often loose; OpenAPI/Swagger requires manual maintenance | Strict Schema Definition Language (SDL) serves as a binding contract |
| **API Versioning** | Usually requires URL versioning (`/api/v1`, `/api/v2`) | Field-level deprecation (`@deprecated`); evolve schema seamlessly |

### c) GraphQL Query Language and Schema Concepts
- **Schema (SDL)**: The blueprint of your API. Defines types, relations, queries, mutations, and subscriptions.
- **Query Language**: The syntax used by clients to request specific shapes of data matching the schema.

### d) Role of a GraphQL Server
The GraphQL server acts as an orchestration gateway between the client and backend data stores (databases, microservices, 3rd party APIs). It parses incoming queries, validates them against the schema AST, executes the matching resolver functions, and formats the output into a predictable JSON payload.

---

## Module 2: Core Building Blocks & Type System

### 1. Operations
- **Query (`type Query`)**: Read-only operations (equivalent to REST `GET`).
- **Mutation (`type Mutation`)**: Operations that cause state mutations on the server (equivalent to REST `POST`, `PUT`, `PATCH`, `DELETE`).
- **Subscription (`type Subscription`)**: Event-driven real-time streams maintaining an active WebSocket connection.

### 2. Resolvers
A resolver is a function that populates the data for a single field in your schema.
Every resolver function in GraphQL receives 4 standard arguments:
```ts
fieldResolver(parent, args, context, info)
```
1. `parent`: The return value of the parent resolver in the execution tree.
2. `args`: The arguments passed to the field in the GraphQL query.
3. `context`: A shared object created per-request (holds auth info, services, and DataLoaders).
4. `info`: AST containing field execution state and query selection sets.

### 3. Type System in this Codebase
1. **Scalar Types**:
   - Built-in: `Int`, `Float`, `String`, `Boolean`, `ID`.
   - Custom Scalar: `DateTime` (`server/src/modules/common/common.resolvers.ts`).
2. **Object Types**: `User`, `Task`, `TaskConnection`, `PageInfo`.
3. **Enums**: `TaskStatus` (`TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`), `TaskPriority`, `UserRole`.
4. **Interfaces**: `interface Node { id: ID! createdAt: DateTime! updatedAt: DateTime! }` implemented by both `User` and `Task`.
5. **Union Types**: `union SearchResult = User | Task`. Allows heterogeneous queries where items can be either type.
6. **Input Types**: `CreateTaskInput`, `UpdateTaskInput`, `TaskFilterInput`, `PaginationInput`.

---

## Module 3: Layered Architecture (Resolver &rarr; Service &rarr; Repository)

This project strictly adheres to clean separation of concerns:

```
[GraphQL Client] (React / Apollo Sandbox)
         │  HTTP / WebSocket
         ▼
┌────────────────────────────────────────────────────────┐
│  Layer 1: Resolvers (src/modules/*/resolvers.ts)       │
│  - Unpacks GraphQL args and context                    │
│  - Zero business logic                                 │
│  - Delegates to Services & DataLoaders                 │
└────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────┐
│  Layer 2: Services (src/modules/*/service.ts)          │
│  - Domain validation & business rules                  │
│  - Error throwing (NotFoundError, ValidationError)     │
│  - Triggers PubSub real-time events                    │
│  - Zero knowledge of GraphQL AST or HTTP               │
└────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────┐
│  Layer 3: Repositories (src/modules/*/repository.ts)   │
│  - Pure Data Access via Mongoose                       │
│  - MongoDB queries, pagination (limit/offset), filters │
│  - Batch retrieval methods (findByIds, findByAuthorIds)│
└────────────────────────────────────────────────────────┘
         │
         ▼
   [MongoDB Database]
```

---

## Module 4: Database Integration & Practical Operations

### Try These in Apollo Sandbox (`http://localhost:4000/graphql`)

#### 1. Fetch Paginated Tasks with Nested Authors
```graphql
query GetTasksWithAuthors {
  tasks(
    filter: { status: IN_PROGRESS }
    pagination: { limit: 5, offset: 0 }
  ) {
    items {
      id
      title
      status
      priority
      tags
      createdAt
      author {
        id
        name
        email
        role
      }
    }
    pageInfo {
      totalCount
      hasNextPage
      limit
      offset
    }
  }
}
```

#### 2. Create a New Task (Mutation)
```graphql
mutation CreateNewTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    title
    status
    priority
    author {
      name
    }
  }
}
```
*Variables:*
```json
{
  "input": {
    "title": "Learn GraphQL Layered Architecture",
    "description": "Study Resolver -> Service -> Repository pattern",
    "status": "TODO",
    "priority": "HIGH",
    "authorId": "REPLACE_WITH_USER_ID",
    "tags": ["learning", "architecture"]
  }
}
```

#### 3. Polymorphic Search Query (Union Type `SearchResult`)
```graphql
query PolymorphicSearch {
  globalSearch(query: "Alice") {
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
      author {
        name
      }
    }
  }
}
```

#### 4. Real-time Subscription (WebSocket)
```graphql
subscription OnTaskCreated {
  taskAdded {
    id
    title
    status
    priority
    author {
      name
    }
  }
}
```

---

## Module 5: Optimization with DataLoader (Solving the N+1 Problem)

### What is the N+1 Problem?
Suppose you query 10 tasks and include each task's `author`:
```graphql
query {
  tasks {
    items {
      title
      author { name } # <- Field resolver
    }
  }
}
```
Without DataLoader:
1. **1 query** fetches 10 tasks.
2. The `Task.author` field resolver executes 10 times, executing **10 separate queries** to find each author.
3. Total queries = `1 + 10 = 11 queries` (N+1 database roundtrips).

### How DataLoader Solves It (`server/src/context/dataLoaders.ts`):
1. **Batching**: Within a single Node.js event loop tick, DataLoader aggregates all individual user IDs requested by the resolvers.
2. **Single Query**: It calls `userRepo.findByIds(['id1', 'id2', ...])`, making **exactly 1 query** `find({ _id: { $in: [...] } })`.
3. **Per-request Caching**: If 5 tasks share the same author, the author is queried once and reused from cache.

---

## Module 6: Schema Stitching vs. Apollo Federation

| Concept | Schema Stitching (`@graphql-tools/stitch`) | Apollo Federation |
| :--- | :--- | :--- |
| **Approach** | Programmatic schema merging via code | Declarative entity resolution using schema directives (`@key`) |
| **Subschemas** | Standard, independent GraphQL servers | Subgraphs implementing the Federation specification |
| **Gateway** | Node.js gateway using `stitchSchemas` | Apollo Router (high-speed Rust binary) or Apollo Gateway |
| **Best For** | Merging legacy or 3rd-party GraphQL APIs without modifying their source code | Large microservice teams collaborating on a single unified enterprise graph |

### Live Stitching Endpoint:
This project includes a dedicated stitched schema running at:
`http://localhost:4000/graphql-stitched`

Inspect `server/src/modules/stitching/stitchedSchema.ts` to see how the isolated User and Task subschemas are merged with cross-service link extensions!
