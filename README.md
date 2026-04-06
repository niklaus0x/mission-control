# Mission Control Dashboard

A full-stack Next.js application for managing AI agents and their tasks. This dashboard provides real-time monitoring, task assignment, handoff capabilities, and comprehensive analytics.

## Features

- **Agent Overview**: Monitor all agents with status indicators and performance stats
- **Task Management**: Create, assign, update, and track tasks across agents
- **Task Handoff**: Seamlessly transfer tasks between agents with notes
- **Real-time Updates**: Dashboard auto-refreshes every 3 seconds
- **Task History**: Complete audit trail of status changes and handoffs
- **Performance Analytics**: Track completion rates, average times, and failure rates

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Storage**: JSON file-based database
- **Real-time**: Polling (3-second intervals)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone and navigate to the project directory**:
   ```bash
   git clone https://github.com/niklaus0x/mission-control.git
   cd mission-control
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Seed the database** (populate with initial agents and tasks):
   ```bash
   npx tsx scripts/seed.ts
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## Pre-seeded Agents

1. **Tobi** - Senior Software Engineer
2. **Paige** - Content Strategist
3. **Scout** - Competitive Researcher
4. **Iris** - Image Creation
5. **Lincoln** - SEO Strategist
6. **Mark** - Brand Strategist
7. **Piper** - Business Development
8. **Doc** - Technical Writer
9. **Sarah** - Executive Assistant

## Adding New Agents

To add a new agent to the dashboard:

1. **Edit the agent registry** at `config/agents.json`:
   ```json
   {
     "id": "agent_new",
     "name": "Agent Name",
     "role": "Agent Role",
     "status": "idle",
     "stats": {
       "totalCompleted": 0,
       "averageCompletionTime": 0,
       "inProgress": 0,
       "failureRate": 0
     }
   }
   ```

2. **Commit and push** your changes:
   ```bash
   git add config/agents.json
   git commit -m "feat: add new agent"
   git push origin main
   ```

3. **Automatic sync**: The GitHub Actions workflow will automatically:
   - Validate the JSON format
   - Sync changes to `data/agents.json`
   - Make the new agent visible in the dashboard

The dashboard's `/api/agents` endpoint reads from the registry at runtime, so no rebuild is needed — just push the change and the new agent will appear automatically.

## API Endpoints

- **GET /api/agents** - Returns the current list of agents from the registry with metadata (count, source, timestamp)

## License

MIT
