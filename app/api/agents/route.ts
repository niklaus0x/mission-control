import { NextRequest, NextResponse } from 'next/server';
import { getAllAgents } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const agents = getAllAgents();
    return NextResponse.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}