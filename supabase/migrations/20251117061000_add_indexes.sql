-- Indexes to optimize common queries

-- menu_items: available filter + order by name
create index if not exists idx_menu_items_available_name on public.menu_items (available, name);

-- menu_items: admin ordering by category then name
create index if not exists idx_menu_items_category_name on public.menu_items (category, name);

-- promotions: active + sort order + created_at
create index if not exists idx_promotions_active_sort_created on public.promotions (active, sort_order, created_at desc);