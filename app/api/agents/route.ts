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
