import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { LoveButton } from './LoveButton';

export const DatePicker = ({ selectedDate, onSelectDate, onNext }) => {
  // Current month & year state for calendar view
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    // 0 = Sunday, 1 = Monday ... convert so Monday is index 0
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const formatDateString = (year, month, day) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-slate-300 text-sm">Pick a day when we can make memories together ❤️</p>
      </div>

      {/* Calendar Header */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-rose-500/20 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-rose-200 font-bold text-lg">
            <CalendarIcon className="w-5 h-5 text-rose-400" />
            <span>{monthNames[currentMonth]} {currentYear}</span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {daysOfWeek.map((day) => (
            <span key={day} className="text-xs font-semibold text-rose-400/80 py-1">
              {day}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Blank offset days */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}

          {/* Month Days */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = formatDateString(currentYear, currentMonth, dayNum);
            const cellDate = new Date(currentYear, currentMonth, dayNum);
            cellDate.setHours(0, 0, 0, 0);

            const isPast = cellDate < today;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                disabled={isPast}
                onClick={() => onSelectDate(dateStr)}
                className={`h-10 w-full rounded-xl text-sm font-medium transition-all flex items-center justify-center relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.6)] scale-105 z-10'
                    : isPast
                    ? 'text-slate-600 cursor-not-allowed opacity-40'
                    : 'text-slate-200 hover:bg-rose-950/60 hover:text-rose-200 hover:border hover:border-rose-500/30'
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date preview & Next Button */}
      <div className="space-y-4">
        {selectedDate && (
          <p className="text-center text-rose-300 text-sm font-medium">
            Selected: <span className="text-white font-bold underline decoration-rose-400">{selectedDate}</span>
          </p>
        )}

        <LoveButton
          fullWidth
          onClick={onNext}
          className={!selectedDate ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        >
          Continue to Time 🕐
        </LoveButton>
      </div>
    </div>
  );
};
