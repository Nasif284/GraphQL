import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/graphql_learning_db';

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI);
    console.log(`[MongoDB] Successfully connected to database at ${MONGO_URI}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    console.warn('[MongoDB] Please ensure MongoDB is running locally on port 27017.');
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
