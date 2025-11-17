-- Add measure price columns to menu_items table
ALTER TABLE public.menu_items
ADD COLUMN IF NOT EXISTS price_30ml NUMERIC,
ADD COLUMN IF NOT EXISTS price_60ml NUMERIC,
ADD COLUMN IF NOT EXISTS price_90ml NUMERIC,
ADD COLUMN IF NOT EXISTS price_180ml NUMERIC;