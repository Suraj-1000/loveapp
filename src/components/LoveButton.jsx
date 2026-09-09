import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const LoveButton = ({ children, onClick, className = '', icon = true, fullWidth = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(244, 63, 94, 0.7)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 rounded-full shadow-[0_0_25px_rgba(225,29,72,0.5)] hover:from-rose-500 hover:to-pink-500 transition-all duration-300 cursor-pointer overflow-hidden border border-rose-400/40 group shrink-0 max-w-full ${
        fullWidth ? 'w-full' : 'whitespace-nowrap'
      } ${className}`}
    >
      {/* Radiant shimmer light line */}
      <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

      <span>{children || 'YES ❤️'}</span>
      {icon && <Heart className="w-5 h-5 fill-white animate-pulse shrink-0" />}
    </motion.button>
  );
};
