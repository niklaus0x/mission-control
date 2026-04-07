/**
 * db.ts — Supabase-powered data layer.
 *
 * All agents and tasks are persisted in Supabase Postgres.
 */
import { createClient } from '@supabase/supabase-js';
import { Agent, Task, CreateTaskInput, UpdateTaskInput, HandoffTaskInput } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Helpers ────────────────────────────────────────────────────────────────
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// ─── Agent operations ───────────────────────────────────────────────────────
export async function getAllAgents(): Promise<Agent[]> {
  const { data, error } = await supabase.from('agents').select('*').order('name');
  if (error) { console.error('getAllAgents error:', error); return []; }
  return (data || []) as Agent[];
}

export async function getAgentById(id: string): Promise<Agent | null> {
  const { data, error } = await supabase.from('agents').select('*').eq('id', id).single();
  if (error) return null;
  return data as Agent;
}

export async function updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | null> {
  const { data, error } = await supabase.from('agents').update(updates).eq('id', id).select().single();
  if (error) { console.error('updateAgent error:', error); return null; }
  return data as Agent;
}

export async function addAgent(agent: Omit<Agent, 'stats'> & { stats?: Agent['stats'] }): Promise<Agent> {
  const newAgent: Agent = {
    ...agent,
    stats: agent.stats ?? { totalCompleted: 0, averageCompletionTime: 0, inProgress: 0, failureRate: 0 },
  };
  const { data, error } = await supabase.from('agents').insert(newAgent).select().single();
  if (error) throw new Error(error.message);
  return data as Agent;
}

// ─── Task operations ────────────────────────────────────────────────────────
export async function getAllTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getAllTasks error:', error); return []; }
  return (data || []).map(mapTask);
}

export async function getTaskById(id: string): Promise<Task | null> {
  const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();
  if (error) return null;
  return mapTask(data);
}

export async function getTasksByAgentId(agentId: string): Promise<Task[]> {
  const { data, error } = await supabase.from('tasks').select('*').eq('assigned_agent_id', agentId);
  if (error) return [];
  return (data || []).map(mapTask);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const now = new Date().toISOString();
  const id = generateId('task');
  const row = {
    id,
    title: input.title,
    description: input.description,
    assigned_agent_id: input.assignedAgentId,
    priority: input.priority,
    status: 'queued',
    created_at: now,
    updated_at: now,
    handoffs: [],
    status_history: [{ id: generateId('sc'), status: 'queued', timestamp: now }],
  };
  const { data, error } = await supabase.from('tasks').insert(row).select().single();
  if (error) throw new Error(error.message);
  await updateAgentStats(input.assignedAgentId);
  return mapTask(data);
}

export async function updateTask(id: string, updates: UpdateTaskInput): Promise<Task | null> {
  const existing = await getTaskById(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  const row: Record<string, unknown> = { updated_at: now };
  if (updates.title) row.title = updates.title;
  if (updates.description) row.description = updates.description;
  if (updates.priority) row.priority = updates.priority;
  if (updates.status) {
    row.status = updates.status;
    if (updates.status === 'done') row.completed_at = now;
    row.status_history = [
      ...existing.statusHistory,
      { id: generateId('sc'), status: updates.status, timestamp: now },
    ];
  }
  const { data, error } = await supabase.from('tasks').update(row).eq('id', id).select().single();
  if (error) { console.error('updateTask error:', error); return null; }
  await updateAgentStats(existing.assignedAgentId);
  return mapTask(data);
}

export async function handoffTask(taskId: string, fromAgentId: string, input: HandoffTaskInput): Promise<Task | null> {
  const existing = await getTaskById(taskId);
  if (!existing) return null;
  const now = new Date().toISOString();
  const newHandoff = { id: generateId('ho'), fromAgentId, toAgentId: input.toAgentId, timestamp: now, note: input.note };
  const { data, error } = await supabase.from('tasks').update({
    assigned_agent_id: input.toAgentId,
    updated_at: now,
    handoffs: [...existing.handoffs, newHandoff],
  }).eq('id', taskId).select().single();
  if (error) return null;
  await updateAgentStats(fromAgentId);
  await updateAgentStats(input.toAgentId);
  return mapTask(data);
}

export async function deleteTask(id: string): Promise<boolean> {
  const task = await getTaskById(id);
  if (!task) return false;
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) return false;
  await updateAgentStats(task.assignedAgentId);
  return true;
}

// ─── Stats helper ───────────────────────────────────────────────────────────
async function updateAgentStats(agentId: string): Promise<void> {
  const agentTasks = await getTasksByAgentId(agentId);
  const completed = agentTasks.filter(t => t.status === 'done');
  const failed = agentTasks.filter(t => t.status === 'failed');
  const inProgress = agentTasks.filter(t => t.status === 'in_progress');
  let totalTime = 0;
  completed.forEach(t => {
    if (t.completedAt) totalTime += new Date(t.completedAt).getTime() - new Date(t.createdAt).getTime();
  });
  await updateAgent(agentId, {
    status: inProgress.length > 0 ? 'busy' : agentTasks.some(t => t.status === 'blocked') ? 'blocked' : 'idle',
    stats: {
      totalCompleted: completed.length,
      averageCompletionTime: completed.length > 0 ? Math.round(totalTime / completed.length / 60000) : 0,
      inProgress: inProgress.length,
      failureRate: agentTasks.length > 0 ? Math.round((failed.length / agentTasks.length) * 100) : 0,
    },
  });
}

// ─── Map DB row → Task type ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    assignedAgentId: row.assigned_agent_id,
    priority: row.priority,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    handoffs: row.handoffs || [],
    statusHistory: row.status_history || [],
  };
}
