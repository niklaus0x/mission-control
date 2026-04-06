import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET /api/agents
 * 
 * Returns the list of agents from the registry.
 * Reads from config/agents.json (source of truth) if it exists,
 * otherwise falls back to data/agents.json for backwards compatibility.
 */
export async function GET() {
  try {
    const configPath = path.join(process.cwd(), 'config', 'agents.json');
    const dataPath = path.join(process.cwd(), 'data', 'agents.json');
    
    let agentsData;
    let source = 'config';
    
    // Try reading from config first (source of truth)
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      agentsData = JSON.parse(configContent);
    } 
    // Fall back to data directory for backwards compatibility
    else if (fs.existsSync(dataPath)) {
      const dataContent = fs.readFileSync(dataPath, 'utf-8');
      agentsData = JSON.parse(dataContent);
      source = 'data';
    } 
    // No agents file found
    else {
      return NextResponse.json(
        { error: 'Agents registry not found' },
        { status: 404 }
      );
    }
    
    // Validate that we have an array
    if (!Array.isArray(agentsData)) {
      return NextResponse.json(
        { error: 'Invalid agents data format' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      agents: agentsData,
      meta: {
        count: agentsData.length,
        source,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error reading agents registry:', error);
    return NextResponse.json(
      { error: 'Failed to read agents registry' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents
 * 
 * Adds a new agent to the registry.
 * Validates input, ensures unique ID, and writes to config/agents.json.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, skills = [], status = 'idle' } = body;

    // Validation
    if (!name || !role) {
      return NextResponse.json(
        { error: 'Name and role are required' },
        { status: 400 }
      );
    }

    const configPath = path.join(process.cwd(), 'config', 'agents.json');
    
    // Read current agents
    let agents = [];
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      agents = JSON.parse(content);
    } else {
      // If config doesn't exist yet, try data directory as fallback
      const dataPath = path.join(process.cwd(), 'data', 'agents.json');
      if (fs.existsSync(dataPath)) {
        const content = fs.readFileSync(dataPath, 'utf-8');
        agents = JSON.parse(content);
      }
    }

    // Check for duplicate ID
    if (agents.some((a: any) => a.id === id)) {
      return NextResponse.json(
        { error: `Agent with ID "${id}" already exists` },
        { status: 409 }
      );
    }

    // Create new agent
    const newAgent = {
      id,
      name,
      role,
      status,
      stats: {
        totalCompleted: 0,
        averageCompletionTime: 0,
        inProgress: 0,
        failureRate: 0,
      },
      ...(skills && skills.length > 0 && { skills }),
    };

    // Add to agents array
    agents.push(newAgent);

    // Ensure config directory exists
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Write to config/agents.json
    fs.writeFileSync(configPath, JSON.stringify(agents, null, 2));

    return NextResponse.json({
      success: true,
      agent: newAgent,
      message: 'Agent added successfully. GitHub Actions will sync to data/ on next push.',
    });
  } catch (error) {
    console.error('Error adding agent:', error);
    return NextResponse.json(
      { error: 'Failed to add agent' },
      { status: 500 }
    );
  }
}
