# Supabase Setup

## 1. Run the SQL migration

Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/lhnitdbruyunpmnjhkoe/sql) and run the contents of `lib/supabase-seed.sql`.

This creates the `agents` and `tasks` tables and seeds all 13 agents.

## 2. Add environment variables

### Local development
Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=https://lhnitdbruyunpmnjhkoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_JuUHwX_uybw8h7U4EFjTYw_80D9v5o_
```

### Vercel
In your Vercel project dashboard → Settings → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL` = `https://lhnitdbruyunpmnjhkoe.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_JuUHwX_uybw8h7U4EFjTYw_80D9v5o_`

## 3. Deploy
Push to main — Vercel will rebuild automatically.
