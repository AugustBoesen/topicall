/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/mongodb.ts
import { MongoClient, ServerApiVersion } from 'mongodb';

const password = encodeURIComponent('TRmhgzw5bZhzvPjj');
const uri = `mongodb+srv://augustboesen:${password}@topicall.vxutwbv.mongodb.net/?retryWrites=true&w=majority&appName=topicall`;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client;
let clientPromise: Promise<MongoClient>;

declare global {
    interface Global {
      _mongoClientPromise: Promise<MongoClient>;
    }
  }

  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;

export default clientPromise;
