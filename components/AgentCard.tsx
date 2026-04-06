import Link from 'next/link';
import { Agent } from '@/lib/types';
import { getInitials } from '@/lib/utils';
import StatusBadge from './StatusBadge';

const getAvatarGradient = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ['avatar-gradient-1','avatar-gradient-2','avatar-gradient-3','avatar-gradient-4','avatar-gradient-5'][hash % 5];
};

export default function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link href={`/agents/${agent.id}`} className="block workstation-card rounded-lg p-5 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {agent.status === 'busy' && <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />}
      {agent.status === 'idle' && <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg mono ${getAvatarGradient(agent.name)}`}>{getInitials(agent.name)}</div>
            <div><h3 className="text-lg font-bold text-zinc-100 mono">{agent.name}</h3><p className="text-sm text-zinc-400">{agent.role}</p></div>
          </div>
          <StatusBadge status={agent.status} size="sm" />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800">
          <div className="bg-zinc-900/50 rounded p-2.5"><p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 mono">Completed</p><p className="text-2xl font-bold text-emerald-400 mono">{agent.stats.totalCompleted}</p></div>
          <div className="bg-zinc-900/50 rounded p-2.5"><p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 mono">Active</p><p className="text-2xl font-bold text-amber-400 mono">{agent.stats.inProgress}</p></div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-xs"><span className="text-zinc-500">Avg:</span><span className="text-zinc-300 mono font-medium">{agent.stats.averageCompletionTime}m</span></div>
          <div className="flex items-center gap-2 text-xs"><span className="text-zinc-500">Fail:</span><span className={`mono font-medium ${agent.stats.failureRate > 10 ? 'text-red-400' : 'text-zinc-300'}`}>{agent.stats.failureRate}%</span></div>
        </div>
      </div>
    </Link>
  );
}