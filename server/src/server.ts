import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { schema } from './schema.js';
import { stitchedSchema } from './modules/stitching/stitchedSchema.js';
import { createContext } from './context/index.js';
import { connectDB } from './config/db.js';
import { seedInitialData } from './config/seed.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  await connectDB();
  await seedInitialData();

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async () => createContext({})
    },
    wsServer as any
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          };
        }
      }
    ],
    formatError: (formattedError) => ({
      message: formattedError.message,
      code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
      path: formattedError.path,
      locations: formattedError.locations,
      extensions: formattedError.extensions
    })
  });

  await server.start();

  const stitchedApolloServer = new ApolloServer({
    schema: stitchedSchema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  await stitchedApolloServer.start();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => createContext({ req })
    })
  );

  app.use(
    '/graphql-stitched',
    expressMiddleware(stitchedApolloServer, {
      context: async ({ req }) => createContext({ req })
    })
  );

  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
    console.log(`Stitched schema at http://localhost:${PORT}/graphql-stitched`);
    console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error('Server startup error:', error);
  process.exit(1);
});
