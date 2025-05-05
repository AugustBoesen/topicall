import clientPromise from '@/lib/mongodb';

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { cardId } = body;

    if (typeof cardId !== 'number') {
      return new Response(JSON.stringify({ message: 'Invalid cardId' }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db('topicall');
    const collection = db.collection('cards');

    // 1. Delete the target card
    const deleteResult = await collection.deleteOne({ cardId });

    if (deleteResult.deletedCount === 0) {
      return new Response(JSON.stringify({ message: 'Card not found' }), {
        status: 404,
      });
    }

    // 2. Find all cards with higher cardIds
    const cardsToShift = await collection
      .find({ cardId: { $gt: cardId } })
      .sort({ cardId: 1 })
      .toArray();

    // 3. Decrement each cardId
    const bulkOps = cardsToShift.map((card) => ({
      updateOne: {
        filter: { _id: card._id },
        update: { $inc: { cardId: -1 } },
      },
    }));

    if (bulkOps.length > 0) {
      await collection.bulkWrite(bulkOps);
    }

    return new Response(JSON.stringify({ message: 'Card deleted and IDs updated' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting card and shifting:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
    });
  }
}
