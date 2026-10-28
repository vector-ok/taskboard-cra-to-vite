import { formatDistanceToNow, differenceInCalendarDays, format } from 'date-fns';

export function relativeTime(timestamp) {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export function dueLabel(dueInDays) {
  if (dueInDays === 0) return 'Due today';
  if (dueInDays < 0) return `${Math.abs(dueInDays)}d overdue`;
  return `${dueInDays}d left`;
}

export function isOverdue(task) {
  return differenceInCalendarDays(new Date(task.createdAt), new Date()) < -30;
}

export function shortDate(timestamp) {
  return format(new Date(timestamp), 'd MMM');
}

export function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
