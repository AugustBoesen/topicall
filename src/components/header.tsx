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
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <header className='shadow-overlay'>
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
        <div className='fixed top-18 left-0 w-full h-full p-4'>
          <div className='absolute flex justify-center justify-items-center w-full h-full left-0 top-0 -z-50 opacity-80 bg-black' />
          <p className='modal-text'>
            Swipe right or left to navigate through cards
          </p>
          <p className='modal-text'>
            Alternatively you can also use arrow keys
          </p>
          <p className='modal-text'>Press the dice to get a random card</p>
        </div>
      )}
    </header>
  );
};

export default Header;
