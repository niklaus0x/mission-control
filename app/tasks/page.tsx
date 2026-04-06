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
  }, []);

  const getAgentName = (agentId: string) => agents.find(a => a.id === agentId)?.name || 'Unknown';
  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading tasks...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Tasks</h1>
        <div className="flex gap-2 flex-wrap">
          {['all', 'queued', 'in_progress', 'done', 'failed'].map(status => (
            <button key={status} onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}>
              {status === 'all' ? `All (${tasks.length})` : `${status.replace('_', ' ')} (${tasks.filter(t => t.status === status).length})`}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filteredTasks.map(task => <TaskRow key={task.id} task={task} showAgent={true} agentName={getAgentName(task.assignedAgentId)} />)}
      </div>
      {filteredTasks.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">{filter === 'all' ? 'No tasks found.' : `No ${filter.replace('_', ' ')} tasks.`}</p>
        </div>
      )}
    </div>
  );
}