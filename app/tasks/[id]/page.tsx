'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Task, Agent, TaskStatus } from '@/lib/types';
import { formatDate, formatRelativeTime, getInitials } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import HandoffModal from '@/components/HandoffModal';

const getAvatarGradient = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ['avatar-gradient-1','avatar-gradient-2','avatar-gradient-3','avatar-gradient-4','avatar-gradient-5'][hash % 5];
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [taskRes, agentsRes] = await Promise.all([fetch(`/api/tasks/${params.id}`), fetch('/api/agents')]);
      if (!taskRes.ok) { if (taskRes.status === 404) { router.push('/tasks'); return; } throw new Error('Failed'); }
      setTask(await taskRes.json());
      setAgents(await agentsRes.json());
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 3000); return () => clearInterval(i); }, [params.id]);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;
    await fetch(`/api/tasks/${task.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
    fetchData();
  };

  const handleHandoff = async (toAgentId: string, note?: string) => {
    if (!task) return;
    await fetch(`/api/tasks/${task.id}/handoff`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ toAgentId, note }) });
    fetchData();
  };

  const getAgentName = (agentId: string) => agents.find(a => a.id === agentId)?.name || 'Unknown';
  const getPriorityColor = (p: string) => p === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/50' : p === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-zinc-700/50 text-zinc-400 border-zinc-700';

  if (isLoading) return (<div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div><p className="mt-4 text-zinc-400 mono">Loading mission dossier...</p></div></div>);
  if (!task) return null;

  const assignedAgent = agents.find(a => a.id === task.assignedAgentId);

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-8 py-8">
        <button onClick={() => router.push('/tasks')} className="text-blue-400 hover:text-blue-300 mb-8 flex items-center gap-2 mono font-medium transition-colors">← Back to Mission Log</button>
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1.5 rounded-md border font-bold text-xs uppercase mono ${getPriorityColor(task.priority)}`}>{task.priority} Priority</span>
                <span className="text-xs text-zinc-600 mono">ID: {task.id.slice(0, 8)}</span>
              </div>
              <h1 className="text-4xl font-bold text-zinc-100 mb-3 mono">{task.title}</h1>
              <p className="text-lg text-zinc-400 leading-relaxed">{task.description}</p>
            </div>
            <StatusBadge status={task.status} size="lg" />
          </div>
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
            <div><p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 mono">Assigned Agent</p>{assignedAgent && (<div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm mono ${getAvatarGradient(assignedAgent.name)}`}>{getInitials(assignedAgent.name)}</div><div><p className="font-bold text-zinc-100 mono">{assignedAgent.name}</p><p className="text-xs text-zinc-500">{assignedAgent.role}</p></div></div>)}</div>
            <div><p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 mono">Created</p><p className="font-bold text-zinc-100 mono">{formatDate(task.createdAt)}</p><p className="text-xs text-zinc-500 mono">{formatRelativeTime(task.createdAt)}</p></div>
          </div>
          <div className="flex gap-3 pt-6 border-t border-zinc-800 mt-6">
            <select value={task.status} onChange={(e) => handleStatusChange(e.target.value as TaskStatus)} className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="queued">Queued</option><option value="in_progress">In Progress</option><option value="done">Done</option><option value="failed">Failed</option><option value="blocked">Blocked</option>
            </select>
            <button onClick={() => setIsHandoffModalOpen(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold mono transition-colors shadow-lg shadow-blue-500/20">Transfer Mission</button>
          </div>
        </div>
        {task.statusHistory.length > 0 && (<div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-6"><h2 className="text-xl font-bold text-zinc-100 mono uppercase mb-5">Status Timeline</h2><div className="space-y-4">{task.statusHistory.map(h => (<div key={h.id} className="flex items-start gap-4 pb-4 border-b border-zinc-800 last:border-0"><StatusBadge status={h.status} size="sm" /><div><p className="text-sm text-zinc-400 mono">{formatDate(h.timestamp)}</p>{h.note && <p className="text-sm text-zinc-500 mt-1 italic">"{h.note}"</p>}</div></div>))}</div></div>)}
        {task.handoffs.length > 0 && (<div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6"><h2 className="text-xl font-bold text-zinc-100 mono uppercase mb-5">Transfer History</h2><div className="space-y-5">{task.handoffs.map(h => (<div key={h.id} className="bg-zinc-950/50 border-l-4 border-blue-500 rounded-r-lg p-4"><div className="flex items-center gap-2 mb-2"><span className="font-bold text-zinc-100 mono">{getAgentName(h.fromAgentId)}</span><span className="text-blue-400">→</span><span className="font-bold text-zinc-100 mono">{getAgentName(h.toAgentId)}</span></div><p className="text-sm text-zinc-500 mono mb-2">{formatDate(h.timestamp)}</p>{h.note && <p className="text-sm text-zinc-400 bg-zinc-900/50 p-3 rounded italic border border-zinc-800">"{h.note}"</p>}</div>))}</div></div>)}
        <HandoffModal agents={agents} currentAgentId={task.assignedAgentId} isOpen={isHandoffModalOpen} onClose={() => setIsHandoffModalOpen(false)} onSubmit={handleHandoff} />
      </div>
    </div>
  );
}