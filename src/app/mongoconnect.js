import { MongoClient, ServerApiVersion } from 'mongodb';
import fs from 'fs';

const password = encodeURIComponent('TRmhgzw5bZhzvPjj');
const uri = `mongodb+srv://augustboesen:${password}@topicall.vxutwbv.mongodb.net/?retryWrites=true&w=majority&appName=topicall`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  console.log('Connecting to MongoDB...');
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Create a new session
    const session = client.startSession();
    try {
      // Send a ping to confirm a successful connection
      await session.withTransaction(async () => {
        await client.db('admin').command({ ping: 1 });
      });
      console.log(
        'Pinged your deployment. You successfully connected to MongoDB!'
      );
      // List collections
      const db = client.db('topicall');
      const collections = db.collection('cards');
      const documents = await collections.find().toArray();
      // Store the documents in a JSON file
      fs.writeFileSync('cards.json', JSON.stringify(documents, null, 2));
      console.log('Documents stored in cards.json');
    } finally {
      // End the session
      await session.endSession();
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
