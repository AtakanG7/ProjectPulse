import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const IDLE_TIMEOUT = 300000; 

let connection = null;
let lastActivityTime = null;

async function dbConnect() {
  if (connection && mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    lastActivityTime = Date.now();
    return connection;
  }

  try {
    connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, 
    });
    console.log('New database connection established');
    lastActivityTime = Date.now();

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Connection will be re-established on next operation.');
      connection = null;
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      connection = null;
    });

    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    connection = null;
    throw error;
  }
}

async function closeConnectionIfIdle() {
  if (connection && lastActivityTime && Date.now() - lastActivityTime > IDLE_TIMEOUT) {
    try {
      await mongoose.disconnect();
      connection = null;
      lastActivityTime = null;
      console.log('Database connection closed due to inactivity');
    } catch (error) {
      console.error('Error while closing idle connection:', error);
    }
  }
}

setInterval(closeConnectionIfIdle, 60000);

export default dbConnect;