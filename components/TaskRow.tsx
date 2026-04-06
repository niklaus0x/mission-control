import Link from 'next/link';
import { Task } from '@/lib/types';
import { formatRelativeTime, getPriorityColor } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface TaskRowProps { task: Task; showAgent?: boolean; agentName?: string; }

export default function TaskRow({ task, showAgent = false, agentName }: TaskRowProps) {
  return (
    <Link href={`/tasks/${task.id}`} className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-900 truncate">{task.title}</h3>
            <span className={`text-xs font-medium ${getPriorityColor(task.priority)} uppercase`}>{task.priority}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{task.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {showAgent && agentName && <span>Assigned to <span className="font-medium text-gray-700">{agentName}</span></span>}
            <span>{formatRelativeTime(task.updatedAt)}</span>
            {task.handoffs.length > 0 && <span className="text-blue-600">{task.handoffs.length} handoff{task.handoffs.length > 1 ? 's' : ''}</span>}
          </div>
        </div>
        <div className="flex-shrink-0"><StatusBadge status={task.status} size="sm" /></div>
      </div>
    </Link>
  );
}