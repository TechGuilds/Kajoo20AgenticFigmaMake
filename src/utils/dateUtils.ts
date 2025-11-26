/**
 * Date utility functions for consistent date formatting across the app
 */

/**
 * Format date string to readable format
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormat options
 */
export function formatDate(
  dateString: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  };

  return date.toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format date to short format (e.g., "Jan 15, 2024")
 */
export function formatDateShort(dateString: string | Date): string {
  return formatDate(dateString, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format date to long format (e.g., "January 15, 2024")
 */
export function formatDateLong(dateString: string | Date): string {
  return formatDate(dateString, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format date with time (e.g., "Jan 15, 2024, 3:45 PM")
 */
export function formatDateTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format date to relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Future dates
  if (diffInSeconds < 0) {
    const absDiff = Math.abs(diffInSeconds);
    if (absDiff < 60) return 'in a few seconds';
    if (absDiff < 3600) return `in ${Math.floor(absDiff / 60)} minutes`;
    if (absDiff < 86400) return `in ${Math.floor(absDiff / 3600)} hours`;
    if (absDiff < 2592000) return `in ${Math.floor(absDiff / 86400)} days`;
    return formatDateShort(date);
  }

  // Past dates
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  return formatDateShort(date);
}

/**
 * Check if date is today
 */
export function isToday(dateString: string | Date): boolean {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * Check if date is in the past
 */
export function isPast(dateString: string | Date): boolean {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.getTime() < Date.now();
}

/**
 * Check if date is in the future
 */
export function isFuture(dateString: string | Date): boolean {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.getTime() > Date.now();
}

/**
 * Get time remaining until date (for countdowns)
 */
export function getTimeRemaining(dateString: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const total = date.getTime() - Date.now();
  
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, total };
}

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

/**
 * Get start of day for a date
 */
export function startOfDay(dateString: string | Date): Date {
  const date = typeof dateString === 'string' ? new Date(dateString) : new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get end of day for a date
 */
export function endOfDay(dateString: string | Date): Date {
  const date = typeof dateString === 'string' ? new Date(dateString) : new Date(dateString);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * Add days to a date
 */
export function addDays(dateString: string | Date, days: number): Date {
  const date = typeof dateString === 'string' ? new Date(dateString) : new Date(dateString);
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Subtract days from a date
 */
export function subtractDays(dateString: string | Date, days: number): Date {
  return addDays(dateString, -days);
}
