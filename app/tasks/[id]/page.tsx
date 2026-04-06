'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Task, Agent, TaskStatus } from '@/lib/types';
import { formatDate, formatRelativeTime, getInitials, getPriorityColor, capitalize } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import HandoffModal from '@/components/HandoffModal';

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
      if (!taskRes.ok) { if (taskRes.status === 404) { router.push('/tasks'); return; } throw new Error('Failed to fetch task'); }
      setTask(await taskRes.json());
      setAgents(await agentsRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 3000); return () => clearInterval(interval); }, [params.id]);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;
    try {
      const response = await fetch(`/api/tasks/${task.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
      if (!response.ok) throw new Error('Failed to update status');
      fetchData();
    } catch (error) { alert('Failed to update status. Please try again.'); }
  };

  const handleHandoff = async (toAgentId: string, note?: string) => {
    if (!task) return;
    try {
      const response = await fetch(`/api/tasks/${task.id}/handoff`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ toAgentId, note }) });
      if (!response.ok) throw new Error('Failed to handoff task');
      fetchData();
    } catch (error) { alert('Failed to handoff task. Please try again.'); }
  };

  const getAgentName = (agentId: string) => agents.find(a => a.id === agentId)?.name || 'Unknown';

  if (isLoading) return (<div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div><p className="mt-4 text-gray-600">Loading task...</p></div></div>);
  if (!task) return null;

  const assignedAgent = agents.find(a => a.id === task.assignedAgentId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.push('/tasks')} className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-1">← Back to Tasks</button>
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
              <span className={`text-sm font-medium ${getPriorityColor(task.priority)} uppercase`}>{task.priority}</span>
            </div>
            <p className="text-gray-600 text-lg">{task.description}</p>
          </div>
          <StatusBadge status={task.status} size="lg" />
        </div>
        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
          <div><p className="text-sm text-gray-500 mb-1">Assigned To</p>{assignedAgent && (<div className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{getInitials(assignedAgent.name)}</div><div><p className="font-medium text-gray-900">{assignedAgent.name}</p><p className="text-xs text-gray-500">{assignedAgent.role}</p></div></div>)}</div>
          <div><p className="text-sm text-gray-500 mb-1">Created</p><p className="font-medium text-gray-900">{formatDate(task.createdAt)}</p><p className="text-xs text-gray-500">{formatRelativeTime(task.createdAt)}</p></div>
        </div>
        <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
          <select value={task.status} onChange={(e) => handleStatusChange(e.target.value as TaskStatus)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="queued">Queued</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="failed">Failed</option>
            <option value="blocked">Blocked</option>
          </select>
          <button onClick={() => setIsHandoffModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">Handoff Task</button>
        </div>
      </div>
      {task.statusHistory.length > 0 && (<div className="bg-white border border-gray-200 rounded-lg p-6 mb-6"><h2 className="text-xl font-bold text-gray-900 mb-4">Status History</h2><div className="space-y-3">{task.statusHistory.map(h => (<div key={h.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0"><StatusBadge status={h.status} size="sm" /><span className="text-sm text-gray-600">{formatDate(h.timestamp)}</span>{h.note && <span className="text-sm text-gray-500">• {h.note}</span>}</div>))}</div></div>)}
      {task.handoffs.length > 0 && (<div className="bg-white border border-gray-200 rounded-lg p-6"><h2 className="text-xl font-bold text-gray-900 mb-4">Handoff History</h2><div className="space-y-4">{task.handoffs.map(handoff => (<div key={handoff.id} className="border-l-4 border-blue-500 pl-4"><p className="font-medium text-gray-900">From <span className="text-blue-600">{getAgentName(handoff.fromAgentId)}</span> to <span className="text-blue-600">{getAgentName(handoff.toAgentId)}</span></p><p className="text-sm text-gray-600 mt-1">{formatDate(handoff.timestamp)}</p>{handoff.note && <p className="text-sm text-gray-700 mt-2 italic">"{handoff.note}"</p>}</div>))}</div></div>)}
      <HandoffModal agents={agents} currentAgentId={task.assignedAgentId} isOpen={isHandoffModalOpen} onClose={() => setIsHandoffModalOpen(false)} onSubmit={handleHandoff} />
    </div>
  );
}