'use client';

import { useState } from 'react';
import { Agent } from '@/lib/types';

interface HandoffModalProps { agents: Agent[]; currentAgentId: string; isOpen: boolean; onClose: () => void; onSubmit: (toAgentId: string, note?: string) => void; }

export default function HandoffModal({ agents, currentAgentId, isOpen, onClose, onSubmit }: HandoffModalProps) {
  const [toAgentId, setToAgentId] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const availableAgents = agents.filter(a => a.id !== currentAgentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    try { await onSubmit(toAgentId, note || undefined); setToAgentId(''); setNote(''); onClose(); }
    catch (error) { console.error('Failed to handoff task:', error); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Handoff Task</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none" disabled={isSubmitting}>×</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Transfer to Agent *</label><select value={toAgentId} onChange={(e) => setToAgentId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isSubmitting}><option value="">Select an agent...</option>{availableAgents.map(agent => <option key={agent.id} value={agent.id}>{agent.name} - {agent.role}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label><textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Add context or reason for handoff..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isSubmitting} /></div>
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium" disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? 'Handing off...' : 'Handoff Task'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}