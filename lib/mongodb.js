import { MongoClient } from 'mongodb';
import config from '../config';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!config.mongodb.uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (!config.mongodb.dbName) {
    throw new Error('Please define the MONGODB_DB environment variable');
  }

  const client = await MongoClient.connect(config.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Adjust based on your needs
  });

  const db = await client.db(config.mongodb.dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
