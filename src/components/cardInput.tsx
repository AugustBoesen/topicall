'use client';

import { useState } from 'react';

export default function AddCardForm() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addCard = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Step 1: Fetch current number of cards
      const res = await fetch('/api/get-card-count'); // We'll define this API below
      const { count } = await res.json();
      const cardId = count + 1;

      // Step 2: Add new card
      const addRes = await fetch('/api/add-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, cardId }),
      });

      const data = await addRes.json();

      if (addRes.ok) {
        setMessage(`Card added with ID ${cardId}`);
        setQuestion('');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <input
        type='text'
        placeholder='Enter question'
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className='border px-2 py-1 rounded'
      />
      <button
        onClick={addCard}
        disabled={loading || !question}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      >
        {loading ? 'Adding...' : 'Add Card'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
