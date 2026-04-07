'use client';

import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/lib/store';
import AgentCard from '@/components/AgentCard';
import StatsCard from '@/components/StatsCard';
import CreateTaskModal from '@/components/CreateTaskModal';
import AddAgentModal from '@/components/AddAgentModal';
import { CreateTaskInput, Task } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

export default function Home() {
  const { agents, stats, lastUpdated, setAgents, setStats, setTasks, tasks } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [agentsRes, statsRes, tasksRes] = await Promise.all([fetch('/api/agents'), fetch('/api/stats'), fetch('/api/tasks')]);
      const agentsData = await agentsRes.json();
      setAgents(agentsData.agents || agentsData);
      setStats(await statsRes.json());
      setTasks(await tasksRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setAgents, setStats, setTasks]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleCreateTask = async (input: CreateTaskInput) => {
    try {
      const response = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
      if (!response.ok) throw new Error('Failed to create task');
      fetchData();
    } catch (error) { alert('Failed to create task. Please try again.'); }
  };

  const handleAddAgent = async (input: any) => {
    try {
      const response = await fetch('/api/agents', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(input) 
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add agent');
      }
      
      const result = await response.json();
      setAgents([...agents, result.agent]);
    } catch (error: any) {
      throw error;
    }
  };

  if (isLoading) return (<div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div><p className="mt-4 text-zinc-400 mono">Loading mission control...</p></div></div>);

  const recentActivity = [...tasks].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 10);
  const getAgentName = (agentId: string) => agents.find(a => a.id === agentId)?.name || 'Unknown';

  return (
    <div className="min-h-screen">
      <div className="bg-zinc-900/50 border-b border-zinc-800 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <h1 className="text-2xl font-bold text-zinc-100 mono">MISSION CONTROL</h1>
                {lastUpdated && <p className="text-xs text-zinc-500 mono mt-1">Live · Updated {formatRelativeTime(lastUpdated.toISOString())}</p>}
              </div>
              {stats && (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2"><span className="status-light status-light-idle"></span><div><span className="text-xs text-zinc-500 mono">Active</span><p className="text-lg font-bold text-zinc-100 mono">{stats.activeAgents}</p></div></div>
                  <div className="h-8 w-px bg-zinc-800"></div>
                  <div><span className="text-xs text-zinc-500 mono">In Flight</span><p className="text-lg font-bold text-amber-400 mono">{stats.totalTasks - stats.completedTasks - stats.failedTasks}</p></div>
                  <div className="h-8 w-px bg-zinc-800"></div>
                  <div><span className="text-xs text-zinc-500 mono">Completed</span><p className="text-lg font-bold text-emerald-400 mono">{stats.completedTasks}</p></div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsAddAgentModalOpen(true)} className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold mono transition-all duration-200 shadow-lg shadow-blue-500/20">+ NEW AGENT</button>
              <button onClick={() => setIsCreateModalOpen(true)} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg font-bold mono transition-all duration-200 shadow-lg shadow-amber-500/20">+ NEW BRIEFING</button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1800px] mx-auto px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="mb-6"><h2 className="text-xl font-bold text-zinc-100 mono mb-2">AGENT OFFICE FLOOR</h2><p className="text-sm text-zinc-500">Real-time view of all active workstations</p></div>
            {stats && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"><StatsCard title="Total Agents" value={stats.totalAgents} /><StatsCard title="Active Agents" value={stats.activeAgents} /><StatsCard title="Total Tasks" value={stats.totalTasks} /><StatsCard title="Completed" value={stats.completedTasks} trend={stats.totalTasks > 0 ? { value: Math.round((stats.completedTasks / stats.totalTasks) * 100), isPositive: true } : undefined} /></div>)}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{agents.map(agent => <AgentCard key={agent.id} agent={agent} />)}</div>
            {agents.length === 0 && <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800 rounded-lg"><p className="text-zinc-500 mono">No agents found. Please seed the database.</p></div>}
          </div>
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-28">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
                <h2 className="text-sm font-bold text-zinc-100 mono uppercase mb-4 flex items-center gap-2"><span className="status-light status-light-busy"></span>Live Activity</h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {recentActivity.length === 0 && <p className="text-xs text-zinc-600 mono">No recent activity</p>}
                  {recentActivity.map((task: Task) => (
                    <div key={task.id} className="pb-3 border-b border-zinc-800 last:border-0">
                      <div className="flex items-start gap-2 mb-1">
                        <div className={`w-1 h-1 rounded-full mt-1.5 ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in_progress' ? 'bg-amber-500' : task.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <div className="flex-1 min-w-0"><p className="text-xs text-zinc-300 mono truncate">{task.title}</p><p className="text-xs text-zinc-600 mono mt-0.5">{getAgentName(task.assignedAgentId)}</p></div>
                      </div>
                      <p className="text-xs text-zinc-600 mono ml-3">{formatRelativeTime(task.updatedAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateTaskModal agents={agents} isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateTask} />
      <AddAgentModal isOpen={isAddAgentModalOpen} onClose={() => setIsAddAgentModalOpen(false)} onSubmit={handleAddAgent} />
    </div>
  );
}
