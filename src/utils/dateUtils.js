/**
 * Date and Preparation Time Utilities
 */

/**
 * Calculates preparation time by subtracting 30 minutes from the selected date and time string.
 * @param {string} dateStr - Selected date string (e.g. '2026-09-10' or ISO)
 * @param {string} timeStr - Selected time string (e.g. '10:00:00', '10:00', '10:00 AM', '18:30')
 * @returns {{ prepTimeString: string, prepDateTimeISO: string, formattedSelectedDate: string, formattedSelectedTime: string }}
 */
export function calculatePrepTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) {
    return {
      prepTimeString: '30 minutes before',
      prepDateTimeISO: new Date().toISOString(),
      formattedSelectedDate: dateStr || '',
      formattedSelectedTime: timeStr || '',
    };
  }

  // Normalize time string (e.g. "10:00 AM", "6:15 PM", or "10:00:00")
  let hours = 10;
  let minutes = 0;

  const timeUpper = timeStr.trim().toUpperCase();
  const isPM = timeUpper.includes('PM');
  const isAM = timeUpper.includes('AM');
  
  // Extract numbers
  const match = timeUpper.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
  }

  // Parse Year, Month, Day from dateStr (YYYY-MM-DD)
  const [year, month, day] = dateStr.split('-').map((num) => parseInt(num, 10));
  
  // Create Date object in local time
  const targetDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

  // Subtract 30 minutes (30 * 60 * 1000 ms)
  const prepDate = new Date(targetDate.getTime() - 30 * 60 * 1000);

  // Format preparation time (e.g. "9:30 AM" or "5:45 PM")
  const prepTimeString = formatTime12H(prepDate.getHours(), prepDate.getMinutes());

  // Format selected time nicely for display
  const formattedSelectedTime = formatTime12H(hours, minutes);

  // Format selected date nicely (e.g. "September 10, 2026")
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formattedSelectedDate = targetDate.toLocaleDateString('en-US', options);

  return {
    prepTimeString,
    prepDateTimeISO: prepDate.toISOString(),
    formattedSelectedDate,
    formattedSelectedTime,
    prepDateObj: prepDate,
    targetDateObj: targetDate,
  };
}

/**
 * Format hours and minutes into 12-hour AM/PM string
 */
export function formatTime12H(hours, minutes) {
  const period = hours >= 12 ? 'PM' : 'AM';
  let h = hours % 12;
  if (h === 0) h = 12;
  const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${h}:${m} ${period}`;
}

/**
 * Formats countdown time remaining
 */
export function getTimeRemaining(targetDateTime) {
  const total = Date.parse(targetDateTime) - Date.parse(new Date());
  
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days: days < 10 ? `0${days}` : `${days}`,
    hours: hours < 10 ? `0${hours}` : `${hours}`,
    minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
    seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    isPast: false,
  };
}
