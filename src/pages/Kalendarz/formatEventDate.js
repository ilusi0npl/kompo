// Format event date for display (handle config string, Sanity datetime, and undated events)
export const formatEventDate = (event) => {
  if (!event.date) {
    return event.dateText;
  }

  // If it's already formatted string from config (e.g., "13.12.25 | 18:00"), return as-is
  if (typeof event.date === 'string' && event.date.includes('|')) {
    return event.date;
  }

  // Otherwise parse as datetime and format
  const date = new Date(event.date);
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ' |');
};
