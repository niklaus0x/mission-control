'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import AgentCard from '@/components/AgentCard';
import StatsCard from '@/components/StatsCard';
import CreateTaskModal from '@/components/CreateTaskModal';
import { CreateTaskInput } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

export default function Home() {
  const { agents, stats, lastUpdated, setAgents, setStats, setTasks } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [agentsRes, statsRes, tasksRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/stats'),
        fetch('/api/tasks'),
      ]);

      const agentsData = await agentsRes.json();
      const statsData = await statsRes.json();
      const tasksData = await tasksRes.json();

      setAgents(agentsData);
      setStats(statsData);
      setTasks(tasksData);
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

  const handleCreateTask = async (input: CreateTaskInput) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error('Failed to create task');
      fetchData();
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Overview</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated {formatRelativeTime(lastUpdated.toISOString())}
            </p>
          )}
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          + New Task
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Agents" value={stats.totalAgents} />
          <StatsCard title="Active Agents" value={stats.activeAgents} />
          <StatsCard title="Total Tasks" value={stats.totalTasks} />
          <StatsCard
            title="Completed"
            value={stats.completedTasks}
            trend={
              stats.totalTasks > 0
                ? { value: Math.round((stats.completedTasks / stats.totalTasks) * 100), isPositive: true }
                : undefined
            }
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {agents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No agents found. Please seed the database.</p>
        </div>
      )}

      <CreateTaskModal
        agents={agents}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}