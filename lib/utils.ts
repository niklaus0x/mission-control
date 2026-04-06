import { type ClassValue, clsx } from 'clsx';
import { AgentStatus, TaskStatus, TaskPriority } from './types';

export function cn(...inputs: ClassValue[]) { return clsx(inputs); }

export function getStatusColor(status: AgentStatus | TaskStatus): string {
  const colorMap: Record<string, string> = { idle: 'bg-green-500', busy: 'bg-yellow-500', blocked: 'bg-red-500', offline: 'bg-gray-500', queued: 'bg-blue-500', in_progress: 'bg-yellow-500', done: 'bg-green-500', failed: 'bg-red-500' };
  return colorMap[status] || 'bg-gray-500';
}

export function getPriorityColor(priority: TaskPriority): string {
  const colorMap: Record<TaskPriority, string> = { low: 'text-gray-600', medium: 'text-yellow-600', high: 'text-red-600' };
  return colorMap[priority];
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatRelativeTime(dateString: string): string {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateString);
}

export function getInitials(name: string): string { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
export function capitalize(str: string): string { return str.charAt(0).toUpperCase() + str.slice(1); }