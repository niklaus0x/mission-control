import { AgentStatus, TaskStatus } from '@/lib/types';
import { getStatusColor, capitalize } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface StatusBadgeProps { status: AgentStatus | TaskStatus; size?: 'sm' | 'md' | 'lg'; }

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm', lg: 'px-3 py-1.5 text-base' };
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full font-medium text-white', getStatusColor(status), sizeClasses[size])}>
      <span className="relative flex h-2 w-2">
        {(status === 'busy' || status === 'in_progress') && (<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>)}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      {capitalize(status.replace('_', ' '))}
    </span>
  );
}