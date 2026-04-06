import { NextRequest, NextResponse } from 'next/server';
import { getAllTasks, createTask } from '@/lib/db';
import { CreateTaskInput } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    let tasks = getAllTasks();
    if (agentId) tasks = tasks.filter(task => task.assignedAgentId === agentId);
    tasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input: CreateTaskInput = await request.json();
    if (!input.title || !input.description || !input.assignedAgentId || !input.priority) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const task = createTask(input);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}