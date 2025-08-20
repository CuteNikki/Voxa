import { ONLINE_THRESHOLD } from '@/constants/limits';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isToday(date: Date, now: Date = new Date()) {
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

function isYesterday(date: Date, now: Date = new Date()) {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate();
}

function getTimeString(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatSidebarTimestamp(timestamp: number) {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return getTimeString(date);
  }

  return date.toLocaleDateString([], {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPresenceTimestamp(timestamp?: number): string {
  if (typeof timestamp !== 'number' || isNaN(timestamp)) return 'Invalid date';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor(now.getTime() - date.getTime());

  if (diff < ONLINE_THRESHOLD) return 'Online';

  if (isToday(date, now)) return `Last Seen ${getTimeString(date)}`;

  if (isYesterday(date, now)) {
    return `Last Seen Yesterday, ${getTimeString(date)}`;
  }

  return `Last Seen ${date.toLocaleString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function formatMessageTimestamp(createdAt?: number): string {
  if (typeof createdAt !== 'number' || isNaN(createdAt)) return 'Invalid date';
  const date = new Date(createdAt);
  const now = new Date();

  if (isYesterday(date, now)) return `Yesterday, ${getTimeString(date)}`;
  if (isToday(date, now)) return getTimeString(date);
  return date.toLocaleString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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
