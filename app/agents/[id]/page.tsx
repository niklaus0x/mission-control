'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Agent, Task } from '@/lib/types';
import { getInitials, formatRelativeTime } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import TaskRow from '@/components/TaskRow';

const getAvatarGradient = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ['avatar-gradient-1','avatar-gradient-2','avatar-gradient-3','avatar-gradient-4','avatar-gradient-5'][hash % 5];
};

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [agentRes, tasksRes] = await Promise.all([fetch(`/api/agents/${params.id}`), fetch(`/api/tasks?agentId=${params.id}`)]);
      if (!agentRes.ok) { if (agentRes.status === 404) { router.push('/'); return; } throw new Error('Failed to fetch agent'); }
      setAgent(await agentRes.json());
      setTasks(await tasksRes.json());
    } catch (error) { console.error('Failed to fetch data:', error); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 3000); return () => clearInterval(interval); }, [params.id]);

  if (isLoading) return (<div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div><p className="mt-4 text-zinc-400 mono">Loading agent desk...</p></div></div>);
  if (!agent) return null;

  const activeTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'queued');
  const completedTasks = tasks.filter(t => t.status === 'done');
  const failedTasks = tasks.filter(t => t.status === 'failed');

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <button onClick={() => router.push('/')} className="text-blue-400 hover:text-blue-300 mb-8 flex items-center gap-2 mono font-medium transition-colors">← Back to Office</button>
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-lg p-8 mb-8 relative overflow-hidden">
          {agent.status === 'busy' && <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />}
          {agent.status === 'idle' && <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none" />}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mono shadow-2xl ${getAvatarGradient(agent.name)}`}>{getInitials(agent.name)}</div>
                <div>
                  <h1 className="text-4xl font-bold text-zinc-100 mb-2 mono">{agent.name}</h1>
                  <p className="text-xl text-zinc-400">{agent.role}</p>
                  <div className="flex items-center gap-2 mt-3"><StatusBadge status={agent.status} size="md" /></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-zinc-800">
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800"><p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 mono">Completed</p><p className="text-4xl font-bold text-emerald-400 mono">{agent.stats.totalCompleted}</p></div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800"><p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 mono">In Progress</p><p className="text-4xl font-bold text-amber-400 mono">{agent.stats.inProgress}</p></div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800"><p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 mono">Avg Time</p><p className="text-4xl font-bold text-blue-400 mono">{agent.stats.averageCompletionTime}<span className="text-xl text-zinc-500">m</span></p></div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800"><p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 mono">Failure Rate</p><p className={`text-4xl font-bold mono ${agent.stats.failureRate > 10 ? 'text-red-400' : 'text-zinc-400'}`}>{agent.stats.failureRate}<span className="text-xl text-zinc-500">%</span></p></div>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          {activeTasks.length > 0 && (<div><div className="flex items-center gap-3 mb-5"><h2 className="text-2xl font-bold text-zinc-100 mono">ACTIVE MISSIONS</h2><span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-md text-sm font-bold mono">{activeTasks.length}</span></div><div className="space-y-3">{activeTasks.map(task => <TaskRow key={task.id} task={task} />)}</div></div>)}
          {completedTasks.length > 0 && (<div><div className="flex items-center gap-3 mb-5"><h2 className="text-2xl font-bold text-zinc-100 mono">COMPLETED MISSIONS</h2><span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-sm font-bold mono">{completedTasks.length}</span></div><div className="space-y-3">{completedTasks.slice(0, 10).map(task => <TaskRow key={task.id} task={task} />)}</div></div>)}
          {failedTasks.length > 0 && (<div><div className="flex items-center gap-3 mb-5"><h2 className="text-2xl font-bold text-zinc-100 mono">FAILED MISSIONS</h2><span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-md text-sm font-bold mono">{failedTasks.length}</span></div><div className="space-y-3">{failedTasks.map(task => <TaskRow key={task.id} task={task} />)}</div></div>)}
          {tasks.length === 0 && <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-lg"><p className="text-zinc-500 mono">No missions assigned to this agent yet.</p></div>}
        </div>
      </div>
    </div>
  );
}