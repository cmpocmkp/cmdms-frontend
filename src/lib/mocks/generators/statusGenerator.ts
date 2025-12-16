// Status Generation Utilities for Mock Data

import { Status, Priority } from '../../../types';

/**
 * Generate a random status
 */
export function randomStatus(): Status {
  const statuses: Status[] = [
    Status.PENDING,
    Status.IN_PROGRESS,
    Status.ON_TARGET,
    Status.OFF_TARGET,
    Status.OVERDUE,
    Status.COMPLETED,
  ];
  
  // Weighted distribution (more realistic)
  const weights = [15, 25, 20, 15, 10, 15]; // percentages
  const random = Math.random() * 100;
  
  let cumulative = 0;
  for (let i = 0; i < statuses.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return statuses[i];
    }
  }
  
  return Status.IN_PROGRESS;
}

/**
 * Generate status based on timeline
 */
export function statusFromTimeline(progress: number, deadline: string): Status {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  
  if (progress >= 100) {
    return Status.COMPLETED;
  }
  
  if (now > deadlineDate) {
    return Status.OVERDUE;
  }
  
  // Calculate expected progress
  const daysRemaining = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (progress >= 75) {
    return Status.ON_TARGET;
  } else if (progress >= 40 && daysRemaining > 10) {
    return Status.IN_PROGRESS;
  } else if (daysRemaining < 10) {
    return Status.OFF_TARGET;
  }
  
  return Status.IN_PROGRESS;
}

/**
 * Generate a random priority
 */
export function randomPriority(): Priority {
  const priorities: Priority[] = [Priority.HIGH, Priority.MEDIUM, Priority.LOW];
  
  // Weighted distribution
  const weights = [20, 50, 30]; // High=20%, Medium=50%, Low=30%
  const random = Math.random() * 100;
  
  let cumulative = 0;
  for (let i = 0; i < priorities.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return priorities[i];
    }
  }
  
  return Priority.MEDIUM;
}

/**
 * Generate progress percentage
 */
export function randomProgress(): number {
  // Weighted towards middle values (20-80%)
  const random = Math.random();
  
  if (random < 0.1) return Math.floor(Math.random() * 20); // 0-20%
  if (random < 0.3) return 20 + Math.floor(Math.random() * 30); // 20-50%
  if (random < 0.7) return 50 + Math.floor(Math.random() * 30); // 50-80%
  if (random < 0.9) return 80 + Math.floor(Math.random() * 15); // 80-95%
  return 100; // Completed
}

/**
 * Get status badge color
 */
export function getStatusColor(status: Status): string {
  const colors: Record<Status, string> = {
    [Status.PENDING]: 'gray',
    [Status.IN_PROGRESS]: 'blue',
    [Status.ON_TARGET]: 'green',
    [Status.OFF_TARGET]: 'yellow',
    [Status.OVERDUE]: 'red',
    [Status.COMPLETED]: 'green',
    [Status.CLOSED]: 'gray',
    [Status.DRAFT]: 'gray',
    [Status.PUBLISHED]: 'blue',
  };
  
  return colors[status] || 'gray';
}

/**
 * Get priority badge color
 */
export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    [Priority.HIGH]: 'red',
    [Priority.MEDIUM]: 'yellow',
    [Priority.LOW]: 'green',
  };
  
  return colors[priority] || 'gray';
}

/**
 * Get status label
 */
export function getStatusLabel(status: Status): string {
  const labels: Record<Status, string> = {
    [Status.PENDING]: 'Pending',
    [Status.IN_PROGRESS]: 'In Progress',
    [Status.ON_TARGET]: 'On Target',
    [Status.OFF_TARGET]: 'Off Target',
    [Status.OVERDUE]: 'Overdue',
    [Status.COMPLETED]: 'Completed',
    [Status.CLOSED]: 'Closed',
    [Status.DRAFT]: 'Draft',
    [Status.PUBLISHED]: 'Published',
  };
  
  return labels[status] || status;
}

/**
 * Calculate completion rate
 */
export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

