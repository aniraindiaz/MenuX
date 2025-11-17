alter table public.menu_items
  add column if not exists price_30ml numeric(10,2),
  add column if not exists price_60ml numeric(10,2),
  add column if not exists price_90ml numeric(10,2),
  add column if not exists price_180ml numeric(10,2);