import { create } from 'zustand';
import { Agent, Task, DashboardStats } from './types';

interface AppState {
  agents: Agent[]; tasks: Task[]; stats: DashboardStats | null; lastUpdated: Date | null;
  setAgents: (agents: Agent[]) => void; setTasks: (tasks: Task[]) => void; setStats: (stats: DashboardStats) => void;
  updateAgent: (agent: Agent) => void; updateTask: (task: Task) => void; addTask: (task: Task) => void;
  removeTask: (taskId: string) => void; markUpdated: () => void;
}

export const useStore = create<AppState>((set) => ({
  agents: [], tasks: [], stats: null, lastUpdated: null,
  setAgents: (agents) => set({ agents, lastUpdated: new Date() }),
  setTasks: (tasks) => set({ tasks, lastUpdated: new Date() }),
  setStats: (stats) => set({ stats, lastUpdated: new Date() }),
  updateAgent: (agent) => set((state) => ({ agents: state.agents.map(a => a.id === agent.id ? agent : a), lastUpdated: new Date() })),
  updateTask: (task) => set((state) => ({ tasks: state.tasks.map(t => t.id === task.id ? task : t), lastUpdated: new Date() })),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks], lastUpdated: new Date() })),
  removeTask: (taskId) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== taskId), lastUpdated: new Date() })),
  markUpdated: () => set({ lastUpdated: new Date() }),
}));