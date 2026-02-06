create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'New Conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id),
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists saved_recipes (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id),
  name text not null,
  cuisine text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  prep_time_minutes int not null,
  cook_time_minutes int not null,
  servings int not null default 2,
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists recipe_stats (
  cuisine text primary key,
  recipe_count int not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation_id on messages(conversation_id);
create index if not exists idx_messages_created_at on messages(created_at);
create index if not exists idx_saved_recipes_conversation_id on saved_recipes(conversation_id);
create index if not exists idx_saved_recipes_cuisine on saved_recipes(cuisine);

alter table conversations enable row level security;
alter table messages enable row level security;
alter table saved_recipes enable row level security;
alter table recipe_stats enable row level security;

create policy "Public access" on conversations for all using (true) with check (true);
create policy "Public access" on messages for all using (true) with check (true);
create policy "Public access" on saved_recipes for all using (true) with check (true);
create policy "Public access" on recipe_stats for all using (true) with check (true);
