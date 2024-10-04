import { MongoClient } from 'mongodb';

let cachedClient = null;
let isConnecting = false;
const maxRetries = 3;
const retryDelay = 1000; // 1 second

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function connectToCosmosDB() {
  if (cachedClient && cachedClient.topology && cachedClient.topology.isConnected()) {
    return cachedClient;
  }

  if (isConnecting) {
    while (isConnecting) {
      await delay(100);
    }
    if (cachedClient && cachedClient.topology && cachedClient.topology.isConnected()) {
      return cachedClient;
    }
  }

  isConnecting = true;

  try {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const client = await MongoClient.connect(process.env.COSMOSDB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        if (client.topology && client.topology.isConnected()) {
          console.log('Connected to CosmosDB');
          cachedClient = client;
          return client;
        }
      } catch (err) {
        console.error(`Connection attempt ${attempt} failed:`, err);
        if (attempt === maxRetries) throw err;
        await delay(retryDelay * attempt);
      }
    }
  } catch (err) {
    console.error('Failed to connect to CosmosDB after multiple attempts:', err);
    throw err;
  } finally {
    isConnecting = false;
  }
}

export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    console.log('Disconnected from CosmosDB');
  }
}

