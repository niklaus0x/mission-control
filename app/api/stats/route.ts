import { NextRequest, NextResponse } from 'next/server';
import { getAllAgents, getAllTasks } from '@/lib/db';
import { DashboardStats } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const agents = getAllAgents();
    const tasks = getAllTasks();
    const stats: DashboardStats = {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status !== 'offline').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'done').length,
      failedTasks: tasks.filter(t => t.status === 'failed').length,
    };
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}