'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import TaskRow from '@/components/TaskRow';

export default function TasksPage() {
  const { tasks, agents, setTasks, setAgents } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchData = async () => {
    try {
      const [tasksRes, agentsRes] = await Promise.all([fetch('/api/tasks'), fetch('/api/agents')]);
      setTasks(await tasksRes.json());
      setAgents(await agentsRes.json());
    } catch (error) { console.error('Failed to fetch data:', error); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 3000); return () => clearInterval(interval); }, []);

  const getAgentName = (agentId: string) => agents.find(a => a.id === agentId)?.name || 'Unknown';
  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const filters = [
    { key: 'all', label: 'All Missions', color: 'blue' as const },
    { key: 'queued', label: 'Queued', color: 'gray' as const },
    { key: 'in_progress', label: 'In Progress', color: 'amber' as const },
    { key: 'done', label: 'Completed', color: 'green' as const },
    { key: 'failed', label: 'Failed', color: 'red' as const },
  ];

  const colorMap = {
    blue: { active: 'bg-blue-500 text-white border-blue-500', inactive: 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-blue-500/50 hover:text-blue-400' },
    gray: { active: 'bg-zinc-600 text-white border-zinc-600', inactive: 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300' },
    amber: { active: 'bg-amber-500 text-zinc-950 border-amber-500', inactive: 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-amber-500/50 hover:text-amber-400' },
    green: { active: 'bg-emerald-500 text-zinc-950 border-emerald-500', inactive: 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-emerald-500/50 hover:text-emerald-400' },
    red: { active: 'bg-red-500 text-white border-red-500', inactive: 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-red-500/50 hover:text-red-400' },
  };

  if (isLoading) return (<div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div><p className="mt-4 text-zinc-400 mono">Loading mission log...</p></div></div>);

  return (
    <div className="min-h-screen">
      <div className="bg-zinc-900/50 border-b border-zinc-800 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-zinc-100 mono mb-2">MISSION LOG</h1>
          <p className="text-sm text-zinc-500 mono mb-5">All operational briefings and status reports</p>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => {
              const count = f.key === 'all' ? tasks.length : tasks.filter(t => t.status === f.key).length;
              const cls = filter === f.key ? colorMap[f.color].active : colorMap[f.color].inactive;
              return (<button key={f.key} onClick={() => setFilter(f.key)} className={`px-5 py-2.5 rounded-lg font-bold mono text-sm transition-all duration-200 border ${cls}`}>{f.label} <span className="opacity-75">({count})</span></button>);
            })}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="space-y-3">{filteredTasks.map(task => <TaskRow key={task.id} task={task} showAgent={true} agentName={getAgentName(task.assignedAgentId)} />)}</div>
        {filteredTasks.length === 0 && <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-lg"><p className="text-zinc-500 mono">{filter === 'all' ? 'No missions found.' : `No ${filter.replace('_', ' ')} missions.`}</p></div>}
      </div>
    </div>
  );
}