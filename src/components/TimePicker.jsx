import React from 'react';
import { Clock } from 'lucide-react';
import { LoveButton } from './LoveButton';

const PRESET_TIMES = [
  { label: '10:00 AM', value: '10:00 AM', desc: 'Morning Sun ☕' },
  { label: '01:00 PM', value: '01:00 PM', desc: 'Lunch Break 🍕' },
  { label: '06:00 PM', value: '06:00 PM', desc: 'Sunset Vibe 🌆' },
  { label: '08:00 PM', value: '08:00 PM', desc: 'Romantic Night 🌹' },
];

export const TimePicker = ({ selectedTime, onSelectTime, onNext }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-slate-300 text-sm">Select the perfect time for our rendezvous 🕐❤️</p>
      </div>

      {/* Quick Time Preset Cards */}
      <div className="grid grid-cols-2 gap-3">
        {PRESET_TIMES.map((preset) => {
          const isSelected = selectedTime === preset.value;
          return (
            <button
              key={preset.value}
              onClick={() => onSelectTime(preset.value)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-rose-600/30 to-pink-600/30 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-rose-500/40 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-lg text-rose-200">{preset.label}</span>
                <Clock className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
              </div>
              <span className="text-xs text-slate-400 font-medium">{preset.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Time Input */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-rose-500/20 text-center space-y-3">
        <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider">
          Or Pick Custom Time
        </label>
        <div className="flex items-center justify-center gap-2">
          <input
            type="time"
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              // Convert 24h to 12h AM/PM
              const [hStr, mStr] = val.split(':');
              let h = parseInt(hStr, 10);
              const m = parseInt(mStr, 10);
              const period = h >= 12 ? 'PM' : 'AM';
              if (h === 0) h = 12;
              else if (h > 12) h -= 12;
              const formatted = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m} ${period}`;
              onSelectTime(formatted);
            }}
            className="bg-slate-800 text-rose-100 font-bold px-4 py-2.5 rounded-xl border border-rose-500/30 focus:outline-none focus:border-rose-400 text-center text-lg shadow-inner cursor-pointer"
          />
        </div>
      </div>

      {/* Next Action */}
      <LoveButton
        fullWidth
        onClick={onNext}
        className={!selectedTime ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      >
        Choose Date Vibe ✨
      </LoveButton>
    </div>
  );
};
