'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Agent, Task } from '@/lib/types';
import { getInitials, formatRelativeTime } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import TaskRow from '@/components/TaskRow';

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [agentRes, tasksRes] = await Promise.all([
        fetch(`/api/agents/${params.id}`),
        fetch(`/api/tasks?agentId=${params.id}`),
      ]);
      if (!agentRes.ok) {
        if (agentRes.status === 404) { router.push('/'); return; }
        throw new Error('Failed to fetch agent');
      }
      setAgent(await agentRes.json());
      setTasks(await tasksRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [params.id]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading agent...</p>
      </div>
    </div>
  );

  if (!agent) return null;

  const activeTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'queued');
  const completedTasks = tasks.filter(t => t.status === 'done');
  const failedTasks = tasks.filter(t => t.status === 'failed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.push('/')} className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-1">
        ← Back to Agents
      </button>
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {getInitials(agent.name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{agent.name}</h1>
              <p className="text-lg text-gray-600">{agent.role}</p>
            </div>
          </div>
          <StatusBadge status={agent.status} size="lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
          <div><p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Total Completed</p><p className="text-3xl font-bold text-gray-900">{agent.stats.totalCompleted}</p></div>
          <div><p className="text-sm text-gray-500 uppercase tracking-wide mb-1">In Progress</p><p className="text-3xl font-bold text-gray-900">{agent.stats.inProgress}</p></div>
          <div><p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Avg Time</p><p className="text-3xl font-bold text-gray-900">{agent.stats.averageCompletionTime}m</p></div>
          <div><p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Failure Rate</p><p className="text-3xl font-bold text-gray-900">{agent.stats.failureRate}%</p></div>
        </div>
      </div>
      <div className="space-y-6">
        {activeTasks.length > 0 && (<div><h2 className="text-xl font-bold text-gray-900 mb-4">Active Tasks ({activeTasks.length})</h2><div className="space-y-3">{activeTasks.map(task => <TaskRow key={task.id} task={task} />)}</div></div>)}
        {completedTasks.length > 0 && (<div><h2 className="text-xl font-bold text-gray-900 mb-4">Completed Tasks ({completedTasks.length})</h2><div className="space-y-3">{completedTasks.slice(0, 10).map(task => <TaskRow key={task.id} task={task} />)}</div></div>)}
        {failedTasks.length > 0 && (<div><h2 className="text-xl font-bold text-gray-900 mb-4">Failed Tasks ({failedTasks.length})</h2><div className="space-y-3">{failedTasks.map(task => <TaskRow key={task.id} task={task} />)}</div></div>)}
        {tasks.length === 0 && (<div className="text-center py-12 bg-white border border-gray-200 rounded-lg"><p className="text-gray-500">No tasks assigned to this agent yet.</p></div>)}
      </div>
    </div>
  );
}