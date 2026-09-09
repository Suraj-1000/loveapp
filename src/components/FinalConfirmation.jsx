import React from 'react';
import { Calendar, Clock, Sparkles, Loader2 } from 'lucide-react';
import { LoveButton } from './LoveButton';

export const FinalConfirmation = ({ date, time, vibe, onConfirm, isSubmitting }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold text-rose-200">One last look 👀❤️</h3>
        <p className="text-slate-300 text-xs sm:text-sm">Does this sound like a perfect date to you?</p>
      </div>

      {/* Confirmation Summary Card */}
      <div className="bg-gradient-to-br from-slate-900/90 via-rose-950/40 to-slate-900/90 rounded-2xl p-5 border border-rose-500/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-rose-500/10">
          <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">Date</span>
            <span className="text-base font-bold text-white">{date || 'Select a date'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-rose-500/10">
          <div className="p-2.5 bg-pink-500/20 text-pink-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider block">Time</span>
            <span className="text-base font-bold text-white">{time || 'Select a time'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-rose-500/10">
          <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block">Date Vibe</span>
            <span className="text-base font-bold text-white">{vibe || 'Surprise Me'}</span>
          </div>
        </div>
      </div>

      {/* Confirm Action Button */}
      <LoveButton
        fullWidth
        onClick={onConfirm}
        className={isSubmitting ? 'opacity-80 pointer-events-none' : ''}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving our date... ❤️
          </span>
        ) : (
          'Confirm Date ❤️'
        )}
      </LoveButton>
    </div>
  );
};
