import fs from 'fs';
import path from 'path';
import { Agent, Task } from '../lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const AGENTS_FILE = path.join(DATA_DIR, 'agents.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const agents: Agent[] = [
  { id: 'agent_tobi', name: 'Tobi', role: 'Senior Software Engineer', status: 'busy', stats: { totalCompleted: 47, averageCompletionTime: 32, inProgress: 2, failureRate: 4 } },
  { id: 'agent_paige', name: 'Paige', role: 'Content Strategist', status: 'idle', stats: { totalCompleted: 89, averageCompletionTime: 18, inProgress: 0, failureRate: 2 } },
  { id: 'agent_scout', name: 'Scout', role: 'Competitive Researcher', status: 'busy', stats: { totalCompleted: 62, averageCompletionTime: 45, inProgress: 1, failureRate: 5 } },
  { id: 'agent_iris', name: 'Iris', role: 'Image Creation', status: 'idle', stats: { totalCompleted: 134, averageCompletionTime: 12, inProgress: 0, failureRate: 1 } },
  { id: 'agent_lincoln', name: 'Lincoln', role: 'SEO Strategist', status: 'busy', stats: { totalCompleted: 71, averageCompletionTime: 28, inProgress: 3, failureRate: 3 } },
  { id: 'agent_mark', name: 'Mark', role: 'Brand Strategist', status: 'idle', stats: { totalCompleted: 43, averageCompletionTime: 52, inProgress: 0, failureRate: 6 } },
  { id: 'agent_piper', name: 'Piper', role: 'Business Development', status: 'offline', stats: { totalCompleted: 38, averageCompletionTime: 67, inProgress: 0, failureRate: 8 } },
  { id: 'agent_doc', name: 'Doc', role: 'Technical Writer', status: 'busy', stats: { totalCompleted: 92, averageCompletionTime: 41, inProgress: 1, failureRate: 2 } },
  { id: 'agent_sarah', name: 'Sarah', role: 'Executive Assistant', status: 'idle', stats: { totalCompleted: 156, averageCompletionTime: 15, inProgress: 0, failureRate: 1 } },
];

const now = new Date().toISOString();
const h1 = new Date(Date.now() - 3600000).toISOString();
const h2 = new Date(Date.now() - 7200000).toISOString();
const d1 = new Date(Date.now() - 86400000).toISOString();

const tasks: Task[] = [
  { id: 'task_1', title: 'Refactor authentication module', description: 'Update auth system to use JWT with refresh token rotation and rate limiting.', assignedAgentId: 'agent_tobi', priority: 'high', status: 'in_progress', createdAt: h2, updatedAt: h1, handoffs: [], statusHistory: [{ id: 's1', status: 'queued', timestamp: h2 }, { id: 's2', status: 'in_progress', timestamp: h1 }] },
  { id: 'task_2', title: 'Design system documentation', description: 'Create comprehensive docs for the design system including colors, typography, and components.', assignedAgentId: 'agent_doc', priority: 'medium', status: 'in_progress', createdAt: d1, updatedAt: h2, handoffs: [], statusHistory: [{ id: 's3', status: 'queued', timestamp: d1 }, { id: 's4', status: 'in_progress', timestamp: h2 }] },
  { id: 'task_3', title: 'Competitor analysis report', description: 'Analyze top 5 competitors: pricing strategies, feature sets, and market positioning.', assignedAgentId: 'agent_scout', priority: 'high', status: 'in_progress', createdAt: d1, updatedAt: h1, handoffs: [], statusHistory: [{ id: 's5', status: 'queued', timestamp: d1 }, { id: 's6', status: 'in_progress', timestamp: h1 }] },
  { id: 'task_4', title: 'SEO optimization for blog', description: 'Optimize existing blog posts for target keywords and implement structured data markup.', assignedAgentId: 'agent_lincoln', priority: 'medium', status: 'queued', createdAt: h1, updatedAt: h1, handoffs: [], statusHistory: [{ id: 's7', status: 'queued', timestamp: h1 }] },
  { id: 'task_5', title: 'Product launch content calendar', description: 'Create a 3-month content calendar for product launch including social, blog, and email.', assignedAgentId: 'agent_paige', priority: 'high', status: 'done', createdAt: new Date(Date.now() - 259200000).toISOString(), updatedAt: d1, completedAt: d1, handoffs: [], statusHistory: [{ id: 's8', status: 'queued', timestamp: new Date(Date.now() - 259200000).toISOString() }, { id: 's9', status: 'in_progress', timestamp: new Date(Date.now() - 172800000).toISOString() }, { id: 's10', status: 'done', timestamp: d1 }] },
  { id: 'task_6', title: 'Brand guidelines update', description: 'Revise brand guidelines to include new visual identity elements and tone of voice.', assignedAgentId: 'agent_mark', priority: 'low', status: 'queued', createdAt: h2, updatedAt: h2, handoffs: [], statusHistory: [{ id: 's11', status: 'queued', timestamp: h2 }] },
  { id: 'task_7', title: 'API integration testing', description: 'Write comprehensive integration tests for the new third-party API connections.', assignedAgentId: 'agent_tobi', priority: 'high', status: 'queued', createdAt: now, updatedAt: now, handoffs: [], statusHistory: [{ id: 's12', status: 'queued', timestamp: now }] },
  { id: 'task_8', title: 'Meeting notes from Q4 planning', description: 'Compile and distribute meeting notes from Q4 strategic planning to all stakeholders.', assignedAgentId: 'agent_sarah', priority: 'medium', status: 'done', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: d1, completedAt: d1, handoffs: [], statusHistory: [{ id: 's13', status: 'queued', timestamp: new Date(Date.now() - 172800000).toISOString() }, { id: 's14', status: 'in_progress', timestamp: new Date(Date.now() - 129600000).toISOString() }, { id: 's15', status: 'done', timestamp: d1 }] },
  { id: 'task_9', title: 'Partnership proposal deck', description: 'Create presentation deck for potential partnership including case studies and ROI projections.', assignedAgentId: 'agent_paige', priority: 'high', status: 'in_progress', createdAt: h2, updatedAt: h1, handoffs: [{ id: 'hoff_1', fromAgentId: 'agent_piper', toAgentId: 'agent_paige', timestamp: h1, note: 'Paige has better context on our past partnerships.' }], statusHistory: [{ id: 's16', status: 'queued', timestamp: h2 }, { id: 's17', status: 'in_progress', timestamp: h1 }] },
  { id: 'task_10', title: 'Hero image for homepage', description: 'Create a compelling hero image representing core value proposition with modern aesthetic.', assignedAgentId: 'agent_iris', priority: 'medium', status: 'done', createdAt: new Date(Date.now() - 18000000).toISOString(), updatedAt: h2, completedAt: h2, handoffs: [], statusHistory: [{ id: 's18', status: 'queued', timestamp: new Date(Date.now() - 18000000).toISOString() }, { id: 's19', status: 'in_progress', timestamp: new Date(Date.now() - 10800000).toISOString() }, { id: 's20', status: 'done', timestamp: h2 }] },
];

fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2));
fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
console.log(`✅ Seeded: ${agents.length} agents, ${tasks.length} tasks`);