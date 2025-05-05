/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { FaQuestion } from 'react-icons/fa6';
import { FaBackspace } from 'react-icons/fa';
import { Great_Vibes } from 'next/font/google';
import { useState } from 'react';

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
});

const Header = () => {
  const [deleteId, setDeleteId] = useState<number | ''>('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (deleteId === '' || isNaN(Number(deleteId))) {
      setDeleteMessage('Enter a valid number');
      return;
    }

    setDeleteLoading(true);
    setDeleteMessage('');

    try {
      const res = await fetch('/api/delete-card', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: deleteId }),
      });

      const data = await res.json();
      setDeleteMessage(data.message);
      if (res.ok) setDeleteId('');
    } catch (error) {
      console.error(error);
      setDeleteMessage('Error deleting card.');
    } finally {
      setDeleteLoading(false);
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
    setMessage('');
    setQuestion('');
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      setMessage('Please enter a question.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const countRes = await fetch('/api/get-card-count');
      const { count } = await countRes.json();
      const cardId = count + 1;

      const addRes = await fetch('/api/add-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          cardId,
        }),
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

  const [passwordInput, setPasswordInput] = useState('');
  const [correctPassword, setCorrectPassword] = useState('040599'); // replace with your correct password
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === correctPassword) {
      setIsPasswordCorrect(true);
    } else {
      setIsPasswordCorrect(false);
    }
  };

  return (
    <header className='shadow-overlay relative'>
      <h1 className={greatVibes.className}>TopicAll</h1>
      {modalOpen ? (
        <FaBackspace
          className='btn absolute right-0'
          onClick={handleModalToggle}
        />
      ) : (
        <FaQuestion
          className='btn absolute right-0'
          onClick={handleModalToggle}
        />
      )}
      <p className='absolute top-11 left-0 right-0 ml-18 text-xs text-slate-300'>
        &copy; Severi Boesen
      </p>

      {modalOpen && (
        <div className='fixed top-18 left-0 w-full h-full p-4 z-50'>
          {/* Dark overlay */}
          <div className='absolute inset-0 bg-black opacity-80 -z-10' />
          <div className='p-6 rounded shadow-md max-w-md mx-auto'>
            <p className='modal-text'>
              Swipe right or left to navigate through cards.
            </p>
            <p className='modal-text'>
              Alternatively you can also use arrow keys.
            </p>
            <p className='modal-text'>Press the dice to get a random card.</p>
            <div>
              {!isPasswordCorrect ? (
                <div className='bg-white w-full h-24'>
                  <h1>Moderator board</h1>
                  <input
                    type='password'
                    value={passwordInput}
                    onChange={handlePasswordInput}
                    placeholder='Enter password'
                  />
                  <button onClick={handlePasswordSubmit}>Submit</button>
                </div>
              ) : (
                <div className='mt-4 bg-blue-100 w-full h-24'>
                  <input
                    type='text'
                    placeholder='Add questions...'
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className='bg-white w-full p-2 border rounded mb-2'
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
                  >
                    {loading ? 'Adding...' : 'Add Card'}
                  </button>
                  {message && (
                    <p className='mt-2 text-sm text-white bg-black p-2 rounded'>
                      {message}
                    </p>
                  )}

                  <div className='mt-4 bg-red-100 w-full h-24'>
                    <input
                      type='number'
                      placeholder='Enter cardId to delete'
                      value={deleteId}
                      onChange={(e) => setDeleteId(Number(e.target.value))}
                      className='w-full p-2 border rounded mb-2'
                    />
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete Card'}
                    </button>
                    {deleteMessage && (
                      <p className='mt-2 text-sm text-white bg-black p-2 rounded'>
                        {deleteMessage}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
