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
    catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div><h2 className="text-3xl font-bold text-zinc-100 mono">NEW MISSION BRIEFING</h2><p className="text-sm text-zinc-500 mono mt-1">Create and assign a new task</p></div>
            <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 text-2xl" disabled={isSubmitting}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="block text-sm font-bold text-zinc-300 mb-2 mono uppercase tracking-wider">Mission Title *</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-600 mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter mission title..." required disabled={isSubmitting} /></div>
            <div><label className="block text-sm font-bold text-zinc-300 mb-2 mono uppercase tracking-wider">Mission Description *</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-600 mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Detailed mission briefing..." required disabled={isSubmitting} /></div>
            <div className="grid grid-cols-2 gap-6">
              <div><label className="block text-sm font-bold text-zinc-300 mb-2 mono uppercase tracking-wider">Assign to Agent *</label><select value={assignedAgentId} onChange={e => setAssignedAgentId(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 mono focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isSubmitting}><option value="">Select agent...</option>{agents.map(a => <option key={a.id} value={a.id}>{a.name} - {a.role}</option>)}</select></div>
              <div><label className="block text-sm font-bold text-zinc-300 mb-2 mono uppercase tracking-wider">Priority Level *</label><select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 mono focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isSubmitting}><option value="low">Low Priority</option><option value="medium">Medium Priority</option><option value="high">High Priority</option></select></div>
            </div>
            <div className="flex gap-4 pt-6 border-t border-zinc-800">
              <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 font-bold mono transition-colors" disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg font-bold mono transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Mission'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}