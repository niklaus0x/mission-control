/**
 * db.ts — In-memory data store for Vercel/serverless compatibility.
 *
 * Vercel's filesystem is read-only at runtime, so we cannot use fs.writeFileSync.
 * Instead, we keep agents and tasks in module-level memory, seeded from the
 * bundled config/agents.json at startup.
 *
 * NOTE: Data resets on each cold start. For persistence, swap the in-memory
 * arrays for a database (e.g. Supabase, PlanetScale, MongoDB Atlas).
 */
import { Agent, Task, CreateTaskInput, UpdateTaskInput, HandoffTaskInput } from './types';

// ─── Seed agents from bundled JSON ──────────────────────────────────────────
let seedAgents: Agent[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  seedAgents = require('../config/agents.json') as Agent[];
} catch {
  seedAgents = [];
}

// ─── In-memory stores ───────────────────────────────────────────────────────
let agents: Agent[] = [...seedAgents];
let tasks: Task[] = [];

// ─── Helpers ────────────────────────────────────────────────────────────────
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ─── Agent operations ───────────────────────────────────────────────────────
export function getAllAgents(): Agent[] {
  return agents;
}

export function getAgentById(id: string): Agent | null {
  return agents.find(a => a.id === id) || null;
}

export function updateAgent(id: string, updates: Partial<Agent>): Agent | null {
  const index = agents.findIndex(a => a.id === id);
  if (index === -1) return null;
  agents[index] = { ...agents[index], ...updates };
  return agents[index];
}

export function addAgent(agent: Agent): Agent {
  agents.push(agent);
  return agent;
}

// ─── Task operations ────────────────────────────────────────────────────────
export function getAllTasks(): Task[] {
  return tasks;
}

export function getTaskById(id: string): Task | null {
  return tasks.find(t => t.id === id) || null;
}

export function getTasksByAgentId(agentId: string): Task[] {
  return tasks.filter(t => t.assignedAgentId === agentId);
}

export function createTask(input: CreateTaskInput): Task {
  const now = new Date().toISOString();
  const newTask: Task = {
    id: generateId('task'),
    ...input,
    status: 'queued',
    createdAt: now,
    updatedAt: now,
    handoffs: [],
    statusHistory: [{ id: generateId('sc'), status: 'queued', timestamp: now }],
  };
  tasks.unshift(newTask);
  updateAgentStats(input.assignedAgentId);
  return newTask;
}

export function updateTask(id: string, updates: UpdateTaskInput): Task | null {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  const now = new Date().toISOString();
  const updatedTask: Task = {
    ...tasks[index],
    ...updates,
    updatedAt: now,
    completedAt: updates.status === 'done' ? now : tasks[index].completedAt,
    statusHistory: updates.status
      ? [...tasks[index].statusHistory, { id: generateId('sc'), status: updates.status, timestamp: now }]
      : tasks[index].statusHistory,
  };
  tasks[index] = updatedTask;
  updateAgentStats(tasks[index].assignedAgentId);
  return updatedTask;
}

export function handoffTask(taskId: string, fromAgentId: string, input: HandoffTaskInput): Task | null {
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) return null;
  const now = new Date().toISOString();
  tasks[index] = {
    ...tasks[index],
    assignedAgentId: input.toAgentId,
    updatedAt: now,
    handoffs: [
      ...tasks[index].handoffs,
      { id: generateId('ho'), fromAgentId, toAgentId: input.toAgentId, timestamp: now, note: input.note },
    ],
  };
  updateAgentStats(fromAgentId);
  updateAgentStats(input.toAgentId);
  return tasks[index];
}

export function deleteTask(id: string): boolean {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  const agentId = tasks[index].assignedAgentId;
  tasks.splice(index, 1);
  updateAgentStats(agentId);
  return true;
}

// ─── Stats helper ───────────────────────────────────────────────────────────
function updateAgentStats(agentId: string): void {
  const agent = getAgentById(agentId);
  if (!agent) return;
  const agentTasks = getTasksByAgentId(agentId);
  const completedTasks = agentTasks.filter(t => t.status === 'done');
  const failedTasks = agentTasks.filter(t => t.status === 'failed');
  const inProgressTasks = agentTasks.filter(t => t.status === 'in_progress');
  let totalTime = 0;
  completedTasks.forEach(t => {
    if (t.completedAt) totalTime += new Date(t.completedAt).getTime() - new Date(t.createdAt).getTime();
  });
  updateAgent(agentId, {
    status: inProgressTasks.length > 0 ? 'busy' : agentTasks.some(t => t.status === 'blocked') ? 'blocked' : 'idle',
    stats: {
      totalCompleted: completedTasks.length,
      averageCompletionTime: completedTasks.length > 0 ? Math.round(totalTime / completedTasks.length / 60000) : 0,
      inProgress: inProgressTasks.length,
      failureRate: agentTasks.length > 0 ? Math.round((failedTasks.length / agentTasks.length) * 100) : 0,
    },
  });
}
