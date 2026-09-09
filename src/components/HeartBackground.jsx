import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const HeartBackground = () => {
  // Generate static random positions for floating elements to avoid re-renders
  const hearts = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 95}%`,
      size: Math.random() * 24 + 14, // 14px to 38px
      duration: Math.random() * 12 + 10, // 10s to 22s
      delay: Math.random() * 8,
      opacity: Math.random() * 0.4 + 0.2,
      rotate: Math.random() * 360,
    }));
  }, []);

  const sparkles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 95}%`,
      left: `${Math.random() * 95}%`,
      size: Math.random() * 6 + 4,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft romantic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-rose-950/80 to-purple-950 opacity-95" />

      {/* Radial soft lighting glow circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/30 rounded-full blur-3xl animate-pulse-subtle" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl animate-pulse-subtle" />

      {/* Sparkles */}
      {sparkles.map((s) => (
        <motion.div
          key={`sparkle-${s.id}`}
          className="absolute bg-rose-200 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
          }}
          animate={{
            opacity: [0.1, 0.9, 0.1],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating Hearts */}
      {hearts.map((h) => (
        <motion.div
          key={`heart-${h.id}`}
          className="absolute text-rose-400/50 fill-current"
          style={{
            left: h.left,
            fontSize: `${h.size}px`,
            opacity: h.opacity,
          }}
          initial={{ y: '110vh', rotate: h.rotate }}
          animate={{
            y: '-10vh',
            x: ['-20px', '20px', '-10px', '15px'],
            rotate: [h.rotate, h.rotate + 180, h.rotate + 360],
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: 'linear',
          }}
        >
          <svg
            className="w-full h-full drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};
