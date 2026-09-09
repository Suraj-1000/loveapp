import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const NO_TEXT_STAGES = [
  "NO 😏",
  "NOPE 😂",
  "ARE YOU SURE? 👀",
  "TRY AGAIN 😌",
  "NOT ALLOWED ❤️",
  "WRONG BUTTON 😭",
  "NICE TRY 😜",
  "Press YES ❤️"
];

export const MovingNoButton = ({ onSelectNo }) => {
  const [attemptCount, setAttemptCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const currentText = NO_TEXT_STAGES[Math.min(attemptCount, NO_TEXT_STAGES.length - 1)];

  const moveButton = () => {
    const nextCount = attemptCount + 1;
    setAttemptCount(nextCount);

    // Calculate maximum allowed X and Y offsets so the button stays strictly within viewport bounds
    const btnWidth = buttonRef.current?.offsetWidth || 120;
    const btnHeight = buttonRef.current?.offsetHeight || 45;

    const padding = 40;
    const maxX = Math.min(window.innerWidth / 2 - btnWidth / 2 - padding, 140);
    const maxY = Math.min(window.innerHeight / 2 - btnHeight / 2 - padding, 160);

    // Generate random offset within [-maxX, maxX] and [-maxY, maxY]
    const randomX = (Math.random() - 0.5) * 2 * maxX;
    const randomY = (Math.random() - 0.5) * 2 * maxY;

    setPosition({ x: randomX, y: randomY });

    if (onSelectNo) {
      onSelectNo(nextCount);
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseEnter={moveButton}
      onTouchStart={(e) => {
        e.preventDefault();
        moveButton();
      }}
      onClick={moveButton}
      animate={{
        x: position.x,
        y: position.y,
        rotate: [0, -5, 5, -3, 0],
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 18,
      }}
      className="px-6 py-3 rounded-full font-semibold text-rose-200 bg-slate-900/80 border border-rose-500/30 hover:border-rose-400/70 hover:bg-rose-950/40 backdrop-blur-md shadow-lg transition-colors cursor-pointer select-none text-sm sm:text-base whitespace-nowrap active:scale-95 shrink-0 max-w-[220px] truncate"
    >
      {currentText}
    </motion.button>
  );
};
