import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { Heart } from 'lucide-react';

export const Countdown = ({ targetDate }) => {
  const { days, hours, minutes, seconds, isPast } = useCountdown(targetDate);

  if (isPast) {
    return (
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-6 text-center text-white shadow-[0_0_30px_rgba(244,63,94,0.5)] border border-rose-400/50 animate-pulse">
        <Heart className="w-8 h-8 mx-auto mb-2 fill-white text-white" />
        <h3 className="text-2xl font-black tracking-wide">IT'S DATE TIME! ❤️</h3>
        <p className="text-rose-100 text-sm mt-1">Get ready for a wonderful time together!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-center">
      <div className="flex items-center justify-center gap-2 text-rose-300 font-semibold text-sm">
        <Heart className="w-4 h-4 fill-rose-400 text-rose-400 animate-pulse" />
        <span>Our date is coming...</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Days */}
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-3 sm:p-4 text-center shadow-lg">
          <span className="block text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-rose-200">
            {days}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-rose-400 uppercase tracking-widest mt-1 block">
            DAYS
          </span>
        </div>

        {/* Hours */}
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-3 sm:p-4 text-center shadow-lg">
          <span className="block text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200">
            {hours}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-pink-400 uppercase tracking-widest mt-1 block">
            HOURS
          </span>
        </div>

        {/* Minutes */}
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-3 sm:p-4 text-center shadow-lg">
          <span className="block text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-rose-200">
            {minutes}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-rose-400 uppercase tracking-widest mt-1 block">
            MINUTES
          </span>
        </div>

        {/* Seconds */}
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-3 sm:p-4 text-center shadow-lg">
          <span className="block text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200">
            {seconds}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-pink-400 uppercase tracking-widest mt-1 block">
            SECONDS
          </span>
        </div>
      </div>
    </div>
  );
};
