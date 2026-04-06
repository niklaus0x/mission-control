export type AgentStatus = 'idle' | 'busy' | 'blocked' | 'offline';
export type TaskStatus = 'queued' | 'in_progress' | 'done' | 'failed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  avatar?: string;
  stats: {
    totalCompleted: number;
    averageCompletionTime: number;
    inProgress: number;
    failureRate: number;
  };
}

export interface TaskHandoff {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  timestamp: string;
  note?: string;
}

export interface TaskStatusChange {
  id: string;
  status: TaskStatus;
  timestamp: string;
  note?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedAgentId: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  handoffs: TaskHandoff[];
  statusHistory: TaskStatusChange[];
}

export interface CreateTaskInput {
  title: string;
  description: string;
  assignedAgentId: string;
  priority: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface HandoffTaskInput {
  toAgentId: string;
  note?: string;
}

export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
}