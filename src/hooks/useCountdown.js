import { useState, useEffect } from 'react';
import { getTimeRemaining } from '../utils/dateUtils';

export const useCountdown = (targetDate) => {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    if (!targetDate) return;

    // Initial update
    setRemaining(getTimeRemaining(targetDate));

    // Update every second
    const interval = setInterval(() => {
      const updated = getTimeRemaining(targetDate);
      setRemaining(updated);

      if (updated.isPast) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return remaining;
};
