import { ONLINE_THRESHOLD } from '@/constants/limits';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names and removes duplicates.
 * @param inputs Class names to merge.
 * @returns A single string with merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if the user is online based on the last seen timestamp.
 * @param timestamp The last seen timestamp of the user.
 * @returns True if the user is online, false otherwise.
 */
export function isOnline(timestamp?: number): boolean {
  if (typeof timestamp !== 'number' || isNaN(timestamp)) return false;
  const now = Date.now();
  return now - timestamp < ONLINE_THRESHOLD;
}

/**
 * Checks if the given date is today compared to the current date.
 * @param date The date to check.
 * @param now The current date, defaults to now.
 * @returns True if the date is today, false otherwise.
 */
function isToday(date: Date, now: Date = new Date()) {
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

/**
 * Checks if the given date is yesterday compared to the current date.
 * @param date The date to check.
 * @param now The current date, defaults to now.
 * @returns True if the date is yesterday, false otherwise.
 */
function isYesterday(date: Date, now: Date = new Date()) {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate();
}

/**
 * Returns a formatted time string for the given date.
 * @param date The date to format.
 * @returns A string representing the time in "HH:MM" format.
 */
function getTimeString(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formats a timestamp for the sidebar.
 * Handles cases for today and older dates.
 * @param timestamp The timestamp to format.
 * @example
 * formatSidebarTimestamp(Date.now() - 1000 * 60 * 60); // "16:05"
 * formatSidebarTimestamp(Date.now() - 1000 * 60 * 60 * 24); // "20.08, 16:05"
 * @returns A formatted string representing the timestamp.
 */
export function formatSidebarTimestamp(timestamp: number) {
  const date = new Date(timestamp);

  if (isToday(date)) return getTimeString(date);
  return date.toLocaleDateString([], {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a presence timestamp into a human-readable string.
 * Handles cases for today, yesterday, and older dates.
 * @param timestamp The timestamp to format.
 * @example
 * formatPresenceTimestamp(Date.now() - 1000 * 60 * 60); // "16:05"
 * formatPresenceTimestamp(Date.now() - 1000 * 60 * 60 * 24); // "Yesterday, 16:05"
 * formatPresenceTimestamp(Date.now() - 1000 * 60 * 60 * 24 * 2); // "20.08.2025, 16:05"
 * @returns A formatted string representing the presence timestamp.
 */
export function formatPresenceTimestamp(timestamp?: number): string {
  if (typeof timestamp !== 'number' || isNaN(timestamp)) return 'Invalid date';
  const date = new Date(timestamp);
  const now = new Date();

  if (isToday(date, now)) return getTimeString(date);
  if (isYesterday(date, now)) return `Yesterday, ${getTimeString(date)}`;
  return date.toLocaleString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a message timestamp into a human-readable string.
 * Handles cases for today, yesterday, and older dates.
 * @param createdAt The timestamp of the message.
 * @example
 * formatMessageTimestamp(Date.now() - 1000 * 60 * 60); // "16:05"
 * formatMessageTimestamp(Date.now() - 1000 * 60 * 60 * 24); // "Yesterday, 16:05"
 * formatMessageTimestamp(Date.now() - 1000 * 60 * 60 * 24 * 2); // "20.08.2025, 16:05"
 * @returns A formatted string representing the message timestamp.
 */
export function formatMessageTimestamp(createdAt?: number): string {
  if (typeof createdAt !== 'number' || isNaN(createdAt)) return 'Invalid date';
  const date = new Date(createdAt);
  const now = new Date();

  if (isToday(date, now)) return getTimeString(date);
  if (isYesterday(date, now)) return `Yesterday, ${getTimeString(date)}`;
  return date.toLocaleString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a reaction timestamp into a human-readable string.
 * Handles cases for today, yesterday, and older dates.
 * @param createdAt The timestamp of the reaction.
 * @example
 * formatReactionTimestamp(Date.now() - 1000 * 60 * 60); // "Today, 16:05"
 * formatReactionTimestamp(Date.now() - 1000 * 60 * 60 * 24); // "Yesterday, 16:05"
 * formatReactionTimestamp(Date.now() - 1000 * 60 * 60 * 24 * 2); // "20.08.2025, 16:05"
 * @returns A formatted string representing the reaction timestamp.
 */
export function formatReactionTimestamp(createdAt?: number): string {
  if (typeof createdAt !== 'number' || isNaN(createdAt)) return 'Invalid date';
  const date = new Date(createdAt);
  const now = new Date();

  if (isToday(date, now)) return `Today, ${getTimeString(date)}`;
  if (isYesterday(date, now)) return `Yesterday, ${getTimeString(date)}`;
  return date.toLocaleString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
