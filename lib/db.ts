import fs from 'fs';
import path from 'path';
import { Agent, Task, CreateTaskInput, UpdateTaskInput, HandoffTaskInput, TaskStatus } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const AGENTS_FILE = path.join(DATA_DIR, 'agents.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch { return defaultValue; }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getAllAgents(): Agent[] { return readJsonFile<Agent[]>(AGENTS_FILE, []); }
export function getAgentById(id: string): Agent | null { return getAllAgents().find(a => a.id === id) || null; }
export function updateAgent(id: string, updates: Partial<Agent>): Agent | null {
  const agents = getAllAgents();
  const index = agents.findIndex(a => a.id === id);
  if (index === -1) return null;
  agents[index] = { ...agents[index], ...updates };
  writeJsonFile(AGENTS_FILE, agents);
  return agents[index];
}

export function getAllTasks(): Task[] { return readJsonFile<Task[]>(TASKS_FILE, []); }
export function getTaskById(id: string): Task | null { return getAllTasks().find(t => t.id === id) || null; }
export function getTasksByAgentId(agentId: string): Task[] { return getAllTasks().filter(t => t.assignedAgentId === agentId); }

export function createTask(input: CreateTaskInput): Task {
  const tasks = getAllTasks();
  const now = new Date().toISOString();
  const newTask: Task = { id: generateId('task'), ...input, status: 'queued', createdAt: now, updatedAt: now, handoffs: [], statusHistory: [{ id: generateId('status'), status: 'queued', timestamp: now }] };
  tasks.push(newTask);
  writeJsonFile(TASKS_FILE, tasks);
  updateAgentStats(input.assignedAgentId);
  return newTask;
}

export function updateTask(id: string, updates: UpdateTaskInput): Task | null {
  const tasks = getAllTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  const task = tasks[index];
  const now = new Date().toISOString();
  if (updates.status && updates.status !== task.status) {
    task.statusHistory.push({ id: generateId('status'), status: updates.status, timestamp: now });
    if (updates.status === 'done' || updates.status === 'failed') task.completedAt = now;
  }
  tasks[index] = { ...task, ...updates, updatedAt: now };
  writeJsonFile(TASKS_FILE, tasks);
  updateAgentStats(task.assignedAgentId);
  return tasks[index];
}

export function handoffTask(taskId: string, fromAgentId: string, input: HandoffTaskInput): Task | null {
  const tasks = getAllTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) return null;
  const task = tasks[index];
  const now = new Date().toISOString();
  task.handoffs.push({ id: generateId('handoff'), fromAgentId, toAgentId: input.toAgentId, timestamp: now, note: input.note });
  task.assignedAgentId = input.toAgentId;
  task.updatedAt = now;
  tasks[index] = task;
  writeJsonFile(TASKS_FILE, tasks);
  updateAgentStats(fromAgentId);
  updateAgentStats(input.toAgentId);
  return task;
}

export function deleteTask(id: string): boolean {
  const tasks = getAllTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  const agentId = tasks[index].assignedAgentId;
  tasks.splice(index, 1);
  writeJsonFile(TASKS_FILE, tasks);
  updateAgentStats(agentId);
  return true;
}

function updateAgentStats(agentId: string): void {
  const agent = getAgentById(agentId);
  if (!agent) return;
  const tasks = getTasksByAgentId(agentId);
  const completedTasks = tasks.filter(t => t.status === 'done');
  const failedTasks = tasks.filter(t => t.status === 'failed');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  let totalTime = 0;
  completedTasks.forEach(t => { if (t.completedAt) totalTime += (new Date(t.completedAt).getTime() - new Date(t.createdAt).getTime()) / 60000; });
  updateAgent(agentId, {
    status: inProgressTasks.length > 0 ? 'busy' : tasks.some(t => t.status === 'blocked') ? 'blocked' : 'idle',
    stats: {
      totalCompleted: completedTasks.length,
      averageCompletionTime: completedTasks.length > 0 ? Math.round(totalTime / completedTasks.length) : 0,
      inProgress: inProgressTasks.length,
      failureRate: tasks.length > 0 ? Math.round((failedTasks.length / tasks.length) * 100) : 0,
    },
  });
}