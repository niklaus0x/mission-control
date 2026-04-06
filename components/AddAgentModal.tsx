'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agent: NewAgentInput) => Promise<void>;
}

export interface NewAgentInput {
  id: string;
  name: string;
  role: string;
  skills?: string[];
  status?: 'idle' | 'busy' | 'offline';
}

export default function AddAgentModal({ isOpen, onClose, onSubmit }: AddAgentModalProps) {
  const [formData, setFormData] = useState<NewAgentInput>({
    id: '',
    name: '',
    role: '',
    skills: [],
    status: 'idle',
  });
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation
    if (!formData.name.trim()) {
      setError('Agent name is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.role.trim()) {
      setError('Agent role is required');
      setIsSubmitting(false);
      return;
    }

    // Auto-generate ID from name if not provided
    const agentId = formData.id.trim() || 
      `agent_${formData.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;

    try {
      await onSubmit({
        ...formData,
        id: agentId,
      });
      
      // Reset form and close
      setFormData({
        id: '',
        name: '',
        role: '',
        skills: [],
        status: 'idle',
      });
      setSkillInput('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add agent');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter(s => s !== skill) || [],
    });
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-100 mono">ADD NEW AGENT</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-400 mono">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mono mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Alex"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mono"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mono mb-2">
              Role / Description *
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Data Analyst"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mono"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mono mb-2">
              Agent ID (optional)
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="Auto-generated from name"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mono text-xs"
              disabled={isSubmitting}
            />
            <p className="text-xs text-zinc-500 mono mt-1">Leave blank to auto-generate</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mono mb-2">
              Skills / Capabilities
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="e.g., Python, SQL"
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mono text-sm"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg font-medium mono text-sm transition-colors"
                disabled={isSubmitting || !skillInput.trim()}
              >
                Add
              </button>
            </div>
            {formData.skills && formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300 mono"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-zinc-500 hover:text-zinc-300 ml-1"
                      disabled={isSubmitting}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mono mb-2">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 mono"
              disabled={isSubmitting}
            >
              <option value="idle">Idle</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium mono transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg font-bold mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
