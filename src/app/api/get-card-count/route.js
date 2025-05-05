import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('topicall');
    const collection = db.collection('cards');
    const count = await collection.countDocuments();

    return new Response(JSON.stringify({ count }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error connecting to DB' }), {
      status: 500,
    });
  }
}
