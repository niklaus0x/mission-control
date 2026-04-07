-- Mission Control Dashboard — Supabase schema
-- Run this in your Supabase SQL Editor to create the required tables.

-- Agents table
create table if not exists agents (
  id text primary key,
  name text not null,
  role text not null,
  status text not null default 'idle',
  avatar text,
  stats jsonb not null default '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'::jsonb
);

-- Tasks table
create table if not exists tasks (
  id text primary key,
  title text not null,
  description text not null,
  assigned_agent_id text not null references agents(id),
  priority text not null default 'medium',
  status text not null default 'queued',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  handoffs jsonb not null default '[]'::jsonb,
  status_history jsonb not null default '[]'::jsonb
);

-- Enable RLS
alter table agents enable row level security;
alter table tasks enable row level security;

-- Allow full public access (anon key is safe for this dashboard)
create policy "Allow all on agents" on agents for all to anon using (true) with check (true);
create policy "Allow all on tasks" on tasks for all to anon using (true) with check (true);

-- Seed agents
insert into agents (id, name, role, status, stats) values
  ('agent_tobi', 'Tobi', 'Senior Software Engineer', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_paige', 'Paige', 'Content Strategist', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_scout', 'Scout', 'Competitive Researcher', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_iris', 'Iris', 'Image Creation', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_lincoln', 'Lincoln', 'SEO Strategist', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_mark', 'Mark', 'Brand Strategist', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_piper', 'Piper', 'Business Development', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_doc', 'Doc', 'Technical Writer', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_sarah', 'Sarah', 'Executive Assistant', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_senior_developer', 'Senior Developer', 'Full-Stack Senior Engineer', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_tobi_alt', 'Tobi', 'Full-Stack Senior Engineer', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_tola', 'Tola', 'Social Media Strategist', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}'),
  ('agent_tomi', 'Tomi', 'Lead Generation Specialist', 'idle', '{"totalCompleted":0,"averageCompletionTime":0,"inProgress":0,"failureRate":0}')
on conflict (id) do nothing;
