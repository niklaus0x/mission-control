'use client';

import { useState } from 'react';
import { Agent, TaskPriority } from '@/lib/types';

interface CreateTaskModalProps { agents: Agent[]; isOpen: boolean; onClose: () => void; onSubmit: (data: { title: string; description: string; assignedAgentId: string; priority: TaskPriority; }) => void; }

export default function CreateTaskModal({ agents, isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    try { await onSubmit({ title, description, assignedAgentId, priority }); setTitle(''); setDescription(''); setAssignedAgentId(''); setPriority('medium'); onClose(); }
    catch (error) { console.error('Failed to create task:', error); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none" disabled={isSubmitting}>×</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Assign to Agent *</label><select value={assignedAgentId} onChange={(e) => setAssignedAgentId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isSubmitting}><option value="">Select an agent...</option>{agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name} - {agent.role}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label><select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isSubmitting}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium" disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Task'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}