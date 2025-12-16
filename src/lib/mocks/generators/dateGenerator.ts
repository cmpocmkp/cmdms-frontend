// Date Generation Utilities for Mock Data

import { subDays, addDays, format, subMonths } from 'date-fns';

/**
 * Generate a random date within a range
 */
export function randomDate(start: Date, end: Date): string {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime).toISOString();
}

/**
 * Generate a date in the past (within last N days)
 */
export function pastDate(daysAgo: number): string {
  return subDays(new Date(), Math.floor(Math.random() * daysAgo)).toISOString();
}

/**
 * Generate a future date (within next N days)
 */
export function futureDate(daysAhead: number): string {
  return addDays(new Date(), Math.floor(Math.random() * daysAhead)).toISOString();
}

/**
 * Generate a deadline date (10-90 days from now)
 */
export function generateDeadline(): string {
  const days = 10 + Math.floor(Math.random() * 80);
  return addDays(new Date(), days).toISOString();
}

/**
 * Generate timeline with status
 * Returns: { deadline, status: 'on_target' | 'off_target' | 'overdue' | 'completed' }
 */
export function generateTimeline() {
  const now = new Date();
  const created = subDays(now, Math.floor(Math.random() * 180)); // Created 0-180 days ago
  
  // Random deadline 30-90 days from creation
  const deadline = addDays(created, 30 + Math.floor(Math.random() * 60));
  
  // Calculate progress based on time elapsed
  const totalDays = Math.floor((deadline.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  const timeProgress = (elapsedDays / totalDays) * 100;
  
  // Random actual progress (with some variation)
  const actualProgress = Math.min(100, Math.max(0, timeProgress + (Math.random() * 40 - 20)));
  
  // Determine status
  let status: 'on_target' | 'off_target' | 'overdue' | 'completed';
  
  if (actualProgress >= 100) {
    status = 'completed';
  } else if (now > deadline) {
    status = 'overdue';
  } else if (actualProgress >= timeProgress - 10) {
    status = 'on_target';
  } else {
    status = 'off_target';
  }
  
  return {
    created_at: created.toISOString(),
    deadline: deadline.toISOString(),
    progress: Math.floor(actualProgress),
    status,
  };
}

/**
 * Generate a meeting date (either past or future)
 */
export function generateMeetingDate(): string {
  const isPast = Math.random() > 0.3; // 70% past meetings, 30% future
  
  if (isPast) {
    return pastDate(180); // Within last 6 months
  } else {
    return futureDate(60); // Within next 2 months
  }
}

/**
 * Generate dates for last N months
 */
export function generateMonthlyDates(months: number): string[] {
  const dates: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    dates.push(subMonths(new Date(), i).toISOString());
  }
  return dates;
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date, formatStr = 'yyyy-MM-dd'): string {
  return format(new Date(date), formatStr);
}

/**
 * Check if date is past deadline
 */
export function isOverdue(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

/**
 * Generate created/updated timestamps
 */
export function generateTimestamps() {
  const created = pastDate(365);
  const updated = Math.random() > 0.5 ? pastDate(30) : created;
  
  return {
    created_at: created,
    updated_at: updated,
  };
}

