import { MongoClient } from "mongodb";

// Sanitize MongoDB URI by removing < > angle brackets if user copied from Atlas with brackets
function getSanitizedUri() {
  let uri = process.env.MONGODB_URI || "";
  if (!uri) return "";

  // Remove < and > from the user/password part if present
  uri = uri.replace(/<([^>]+)>/g, "$1");
  return uri;
}

const uri = getSanitizedUri();
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

let client;
let clientPromise = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        console.warn("MongoDB connection warning:", err.message);
        return null;
      });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode (Vercel Serverless)
    client = new MongoClient(uri, options);
    clientPromise = client.connect().catch((err) => {
      console.warn("MongoDB production connection warning:", err.message);
      return null;
    });
  }
}

export async function getDatabase(dbName = "eventify") {
  if (!clientPromise) return null;
  try {
    const connectedClient = await clientPromise;
    if (!connectedClient) return null;
    return connectedClient.db(dbName);
  } catch (error) {
    console.warn("Could not get MongoDB database:", error.message);
    return null;
  }
}

export default clientPromise;
