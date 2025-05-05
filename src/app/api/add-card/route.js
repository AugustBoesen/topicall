// /app/api/add-card/route.js

import { MongoClient, ServerApiVersion } from 'mongodb';

const password = encodeURIComponent('TRmhgzw5bZhzvPjj');
const uri = `mongodb+srv://augustboesen:${password}@topicall.vxutwbv.mongodb.net/?retryWrites=true&w=majority&appName=topicall`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function POST(request) {
  const body = await request.json();
  const { question, cardId } = body;

  if (!question || typeof cardId !== 'number') {
    return new Response(JSON.stringify({ message: 'Missing fields' }), {
      status: 400,
    });
  }

  try {
    await client.connect();
    const db = client.db('topicall');
    const collection = db.collection('cards');

    const result = await collection.insertOne({ cardId, question });

    return new Response(
      JSON.stringify({ message: 'Card added', id: result.insertedId }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Insert failed' }), {
      status: 500,
    });
  } finally {
    await client.close();
  }
}
