import { NextResponse } from 'next/server';
import { getAllAgents, addAgent } from '@/lib/db';

export async function GET() {
  try {
    const agents = await getAllAgents();
    return NextResponse.json({
      agents,
      meta: { count: agents.length, source: 'supabase', timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Error reading agents:', error);
    return NextResponse.json({ error: 'Failed to read agents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, skills = [], status = 'idle' } = body;

    if (!name || !role) {
      return NextResponse.json({ error: 'Name and role are required' }, { status: 400 });
    }

    const agentId = id?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

    const newAgent = await addAgent({
      id: `agent_${agentId}_${Date.now()}`,
      name,
      role,
      status,
      ...(skills?.length > 0 && { skills }),
    });

    return NextResponse.json({ success: true, agent: newAgent }, { status: 201 });
  } catch (error) {
    console.error('Error adding agent:', error);
    return NextResponse.json({ error: 'Failed to add agent' }, { status: 500 });
  }
}
