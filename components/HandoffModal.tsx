'use client';

import { useState } from 'react';
import { Agent } from '@/lib/types';
import { getInitials } from '@/lib/utils';

const getAvatarGradient = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ['avatar-gradient-1','avatar-gradient-2','avatar-gradient-3','avatar-gradient-4','avatar-gradient-5'][hash % 5];
};

interface HandoffModalProps { agents: Agent[]; currentAgentId: string; isOpen: boolean; onClose: () => void; onSubmit: (toAgentId: string, note?: string) => void; }

export default function HandoffModal({ agents, currentAgentId, isOpen, onClose, onSubmit }: HandoffModalProps) {
  const [toAgentId, setToAgentId] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const availableAgents = agents.filter(a => a.id !== currentAgentId);
  const currentAgent = agents.find(a => a.id === currentAgentId);
  const selectedAgent = agents.find(a => a.id === toAgentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    try { await onSubmit(toAgentId, note || undefined); setToAgentId(''); setNote(''); onClose(); }
    catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl max-w-2xl w-full">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div><h2 className="text-3xl font-bold text-zinc-100 mono">TRANSFER MISSION</h2><p className="text-sm text-zinc-500 mono mt-1">Reassign task to another agent</p></div>
            <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 text-2xl" disabled={isSubmitting}>✕</button>
          </div>
          {currentAgent && (
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold mono ${getAvatarGradient(currentAgent.name)}`}>{getInitials(currentAgent.name)}</div><div><p className="text-xs text-zinc-500 mono uppercase">From</p><p className="font-bold text-zinc-100 mono">{currentAgent.name}</p><p className="text-xs text-zinc-500">{currentAgent.role}</p></div></div>
                <span className="text-blue-400 text-2xl">→</span>
                {selectedAgent ? (<div className="flex items-center gap-3"><div><p className="text-xs text-zinc-500 mono uppercase text-right">To</p><p className="font-bold text-zinc-100 mono text-right">{selectedAgent.name}</p><p className="text-xs text-zinc-500 text-right">{selectedAgent.role}</p></div><div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold mono ${getAvatarGradient(selectedAgent.name)}`}>{getInitials(selectedAgent.name)}</div></div>) : (<div className="w-12 h-12 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center"><span className="text-zinc-600 text-2xl">?</span></div>)}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="block text-sm font-bold text-zinc-300 mb-2 mono uppercase tracking-wider">Select Target Agent *</label><select value={toAgentId} onChange={e => setToAgentId(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 mono focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isSubmitting}><option value="">Select an agent...</option>{availableAgents.map(a => <option key={a.id} value={a.id}>{a.name} - {a.role} ({a.status})</option>)}</select></div>
            <div><label className="block text-sm font-bold text-zinc-300 mb-2 mono uppercase tracking-wider">Transfer Note (Optional)</label><textarea value={note} onChange={e => setNote(e.target.value)} rows={4} placeholder="Add context or reason for transfer..." className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-600 mono focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isSubmitting} /></div>
            <div className="flex gap-4 pt-6 border-t border-zinc-800">
              <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 font-bold mono transition-colors" disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold mono transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50" disabled={isSubmitting || !toAgentId}>{isSubmitting ? 'Transferring...' : 'Confirm Transfer'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}