import Link from 'next/link';
import { Agent } from '@/lib/types';
import { getInitials } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface AgentCardProps { agent: Agent; }

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link href={`/agents/${agent.id}`} className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">{getInitials(agent.name)}</div>
          <div><h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3><p className="text-sm text-gray-600">{agent.role}</p></div>
        </div>
        <StatusBadge status={agent.status} size="sm" />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
        <div><p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Completed</p><p className="text-xl font-bold text-gray-900">{agent.stats.totalCompleted}</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wide mb-1">In Progress</p><p className="text-xl font-bold text-gray-900">{agent.stats.inProgress}</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Time</p><p className="text-xl font-bold text-gray-900">{agent.stats.averageCompletionTime}m</p></div>
        <div><p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Failure Rate</p><p className="text-xl font-bold text-gray-900">{agent.stats.failureRate}%</p></div>
      </div>
    </Link>
  );
}