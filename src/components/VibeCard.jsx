import React from 'react';
import { Check } from 'lucide-react';
import { LoveButton } from './LoveButton';

export const VIBE_OPTIONS = [
  { id: 'foodie', title: 'Foodie Date', emoji: '🍕', desc: 'Delicious food & cozy atmosphere' },
  { id: 'coffee', title: 'Coffee & Chit-Chat', emoji: '☕', desc: 'Warm drinks & sweet conversations' },
  { id: 'movie', title: 'Movie Date', emoji: '🎬', desc: 'Popcorn, dim lights & cuddling' },
  { id: 'walk', title: 'Walk & Explore', emoji: '🌆', desc: 'Sunset strolls & city lights' },
  { id: 'dessert', title: 'Dessert Date', emoji: '🍦', desc: 'Ice cream, pastries & late sweet treats' },
  { id: 'games', title: 'Games & Fun', emoji: '🎮', desc: 'Arcade games, laughter & playful competition' },
  { id: 'romantic', title: 'Romantic Date', emoji: '🌹', desc: 'Candlelight dinner, dressing up & romance' },
  { id: 'surprise', title: 'Surprise Me', emoji: '🎁', desc: 'You can trust me with the plan 😌' },
];

export const VibeCard = ({ selectedVibe, onSelectVibe, onNext }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <p className="text-slate-300 text-sm">Pick the mood that makes your heart smile ✨</p>
      </div>

      {/* Vibe Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
        {VIBE_OPTIONS.map((vibe) => {
          const isSelected = selectedVibe === vibe.title;
          return (
            <button
              key={vibe.id}
              onClick={() => onSelectVibe(vibe.title)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 relative ${
                isSelected
                  ? 'bg-gradient-to-br from-rose-600/30 via-pink-600/25 to-rose-950/40 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-rose-500/40 hover:bg-slate-800/80'
              }`}
            >
              <span className="text-2xl p-2 bg-slate-800/80 rounded-xl border border-rose-500/10">
                {vibe.emoji}
              </span>
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-bold text-sm text-rose-100 truncate">{vibe.title}</h4>
                <p className="text-xs text-slate-400 leading-snug line-clamp-2 mt-0.5">{vibe.desc}</p>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Next Action */}
      <LoveButton
        fullWidth
        onClick={onNext}
        className={!selectedVibe ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      >
        Review Details 👀❤️
      </LoveButton>
    </div>
  );
};
