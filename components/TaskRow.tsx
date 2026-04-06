import Link from 'next/link';
import { Task } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';
import StatusBadge from './StatusBadge';

export default function TaskRow({ task, showAgent = false, agentName }: { task: Task; showAgent?: boolean; agentName?: string }) {
  const getPriorityClass = (p: string) => p === 'high' ? 'mission-brief mission-brief-high' : p === 'medium' ? 'mission-brief mission-brief-medium' : 'mission-brief mission-brief-low';
  const getPriorityBadge = (p: string) => p === 'high' ? 'bg-red-500/20 text-red-400' : p === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-700/50 text-zinc-400';
  return (
    <Link href={`/tasks/${task.id}`} className={`block ${getPriorityClass(task.priority)} border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all duration-200`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-bold text-zinc-100 truncate mono">{task.title}</h3>
            <span className={`text-xs font-bold uppercase mono px-2 py-0.5 rounded ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
          </div>
          <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{task.description}</p>
          <div className="flex items-center gap-4 text-xs text-zinc-500 mono">
            {showAgent && agentName && <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span><span className="text-zinc-400">{agentName}</span></span>}
            <span>{formatRelativeTime(task.updatedAt)}</span>
            {task.handoffs.length > 0 && <span className="text-blue-400">{task.handoffs.length} transfer{task.handoffs.length > 1 ? 's' : ''}</span>}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {task.status === 'in_progress' && <div className="typing-indicator"><span></span><span></span><span></span></div>}
          <StatusBadge status={task.status} size="sm" />
        </div>
      </div>
    </Link>
  );
}