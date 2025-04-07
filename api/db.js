const { MongoClient } = require('mongodb');

// Cache the database connection for better performance with serverless functions
let cachedDb = null;

async function connectToDatabase() {
  // If the database connection is cached, use it
  if (cachedDb) {
    return cachedDb;
  }

  // If no connection is cached, create a new one
  const uri = process.env.MONGODB_URI || "mongodb+srv://aryankulkarni1104:Aryan%402005@cluster0.qxaih.mongodb.net/";
  
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // Connect to database
  const client = new MongoClient(uri);
  await client.connect();
  
  const dbName = "e_waste_quiz";
  const db = client.db(dbName);
  
  // Cache the database connection
  cachedDb = db;
  
  return db;
}

module.exports = { connectToDatabase };