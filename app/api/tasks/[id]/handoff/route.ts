import { NextRequest, NextResponse } from 'next/server';
import { getTaskById, handoffTask } from '@/lib/db';
import { HandoffTaskInput } from '@/lib/types';

type Params = Promise<{ id: string }>;

export async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const input: HandoffTaskInput = await request.json();
    if (!input.toAgentId) return NextResponse.json({ error: 'toAgentId is required' }, { status: 400 });
    const task = await getTaskById(id);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    if (task.assignedAgentId === input.toAgentId) {
      return NextResponse.json({ error: 'Cannot handoff to the same agent' }, { status: 400 });
    }
    const updatedTask = await handoffTask(id, task.assignedAgentId, input);
    if (!updatedTask) return NextResponse.json({ error: 'Failed to handoff task' }, { status: 500 });
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to handoff task' }, { status: 500 });
  }
}
