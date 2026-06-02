import type { Priority } from '../types/types';

/**
 * Formats an ISO date string into a human-readable format.
 * Example: '2026-05-25T09:00:00.000Z' → '25 Thg 5, 2026'
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = [
    'Thg 1',
    'Thg 2',
    'Thg 3',
    'Thg 4',
    'Thg 5',
    'Thg 6',
    'Thg 7',
    'Thg 8',
    'Thg 9',
    'Thg 10',
    'Thg 11',
    'Thg 12',
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}

/**
 * Returns a CSS custom property name corresponding to the given priority level.
 * These map to CSS variables that should be defined in the app's theme.
 */
export function getPriorityColor(priority: Priority): string {
  const colorMap: Record<Priority, string> = {
    low: 'var(--priority-low)',
    medium: 'var(--priority-medium)',
    high: 'var(--priority-high)',
  };

  return colorMap[priority];
}

/**
 * Truncates text to a maximum length, appending an ellipsis if truncated.
 * Returns the original text if it's shorter than or equal to maxLength.
 */
export function truncateText(text: string, maxLength: number): string {
  if (maxLength < 0) {
    return text;
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength).trimEnd() + '…';
}
