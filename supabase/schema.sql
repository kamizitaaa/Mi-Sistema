-- Run this in Supabase Dashboard > SQL Editor.
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

alter table public.notes enable row level security;

-- Each user can only see and change their own notes.
create policy "Users read own notes" on public.notes
  for select using (auth.uid() = user_id);
create policy "Users insert own notes" on public.notes
  for insert with check (auth.uid() = user_id);
create policy "Users delete own notes" on public.notes
  for delete using (auth.uid() = user_id);
