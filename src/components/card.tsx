/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import cardsData from '../../cards.json';

import { Comfortaa } from 'next/font/google';

const comfortaa = Comfortaa({
  subsets: ['latin'],
  weight: ['400'],
});

// Defines how far a card has to be swiped to activate index change
const SWIPE_THRESHOLD = 150;

const Card = ({ id, description }: { id?: string; description?: string }) => {
  // variables used to track card state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [pendingChange, setPendingChange] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [cardColor, setCardColor] = useState('#ffffff');

  // Variables used to handle animation and transitions
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-10, 0, 10]);

  // An async function that handles card swiping and transition
  const handleDragEnd = async (
    _: any,
    info: { offset: { x: number; y: number } }
  ) => {
    const offsetX = info.offset.x;

    if (Math.abs(offsetX) > SWIPE_THRESHOLD) {
      await controls.start({
        opacity: 0,
        scale: 0,
        transition: { duration: 0.2 },
      });
      setVisible(false);

      const nextIndex =
        offsetX > 0 && currentIndex < cardsData.length - 1
          ? currentIndex + 1
          : offsetX < 0 && currentIndex > 0
          ? currentIndex - 1
          : currentIndex;

      setPendingChange(nextIndex);
    } else {
      await controls.start({
        x: 0,
        rotate: 0,
        transition: { type: 'spring', stiffness: 300 },
      });
    }
  };

  // An async function that handles arrow button clicks to handle card swiping
  const handleArrowClick = async (dir: 'left' | 'right') => {
    if (
      (dir === 'left' && currentIndex === 0) ||
      (dir === 'right' && currentIndex === cardsData.length - 1)
    )
      return;

    const offset = dir === 'right' ? 300 : -300;
    setDirection(dir);
    await controls.start({
      x: offset,
      rotate: dir === 'right' ? 10 : -10,
      transition: { duration: 0.15 },
    });
    await controls.start({
      opacity: 0,
      scale: 0,
      transition: { duration: 0.2 },
    });

    setVisible(false);
    const newIndex = dir === 'right' ? currentIndex + 1 : currentIndex - 1;
    setPendingChange(newIndex);
  };

  // An useEffect for timing index change
  useEffect(() => {
    if (pendingChange !== null) {
      setTimeout(() => {
        setCurrentIndex(pendingChange);
        setPendingChange(null);
        setVisible(true);
        setDirection(null);
      }, 100);
    }
  }, [pendingChange]);

  // An useEffect for handling card animation
  useEffect(() => {
    if (visible) {
      controls.set({ opacity: 0, scale: 0, x: 0, rotate: 0 });
      controls.start({
        opacity: 1,
        scale: 1,
        x: 0,
        rotate: 0,
        transition: { duration: 0.2, ease: 'easeOut' },
      });
    }
  }, [visible, currentIndex]);

  // an useEffect for handling card color generation
  useEffect(() => {
    const card = cardsData[currentIndex];
    if (card) {
      const text = card.question ?? '';
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
      }
      const color = `hsl(${hash % 360}, 70%, 85%)`; // pastel color
      setCardColor(color);
    }
  }, [currentIndex]);

  // An async function for handling random button click
  const handleRandomClick = async () => {
    let randomIndex = currentIndex;
    while (randomIndex === currentIndex) {
      randomIndex = Math.floor(Math.random() * (cardsData.length - 1)) + 1;
    }

    await controls.start({
      opacity: 0,
      scale: 0,
      transition: { duration: 0.2 },
    });

    setVisible(false);
    setPendingChange(randomIndex);
  };

  return (
    <>
      {visible && (
        <motion.div
          className={`card ${comfortaa.className}`}
          drag='x'
          dragConstraints={{ left: -400, right: 400 }}
          animate={controls}
          style={{ rotate, backgroundColor: cardColor }}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          onUpdate={(latest) => {
            x.set(Number(latest.x ?? 0));
          }}
          initial={false}
        >
          <p className='w-full text-left pl-4 pt-2 font-bold'>
            Prompt #{cardsData[currentIndex]?.cardId ?? 'No ID available'}
          </p>
          <p className='h-full content-center mx-12 text-lg'>
            {cardsData[currentIndex]?.question ?? 'No description available'}
          </p>
        </motion.div>
      )}

      <footer className='shadow-overlay'>
        {/* Left Arrow Button */}
        <FaArrowCircleLeft
          onClick={() => handleArrowClick('left')}
          className='btn'
        />

        {/* Random Jump Button */}
        <GiPerspectiveDiceSixFacesRandom
          onClick={handleRandomClick}
          className='btn'
        >
          Random
        </GiPerspectiveDiceSixFacesRandom>

        {/* Right Arrow Button */}
        <FaArrowCircleRight
          onClick={() => handleArrowClick('right')}
          className='btn'
        />
      </footer>
    </>
  );
};

export default Card;
