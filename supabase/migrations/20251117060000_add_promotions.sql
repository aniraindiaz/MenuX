-- Create promotions table
create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to maintain updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists update_promotions_updated_at on public.promotions;
create trigger update_promotions_updated_at
before update on public.promotions
for each row execute function public.update_updated_at_column();

-- Enable RLS
alter table public.promotions enable row level security;

-- Policies
create policy "Promotions are readable by all"
on public.promotions for select using (true);

create policy "Promotions are manageable by authenticated"
on public.promotions for all to authenticated using (true) with check (true);