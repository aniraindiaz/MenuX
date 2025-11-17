-- Enable RLS on menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read menu items (public menu view)
CREATE POLICY "Anyone can view menu items"
  ON public.menu_items
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert menu items
CREATE POLICY "Authenticated users can insert menu items"
  ON public.menu_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update menu items
CREATE POLICY "Authenticated users can update menu items"
  ON public.menu_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete menu items
CREATE POLICY "Authenticated users can delete menu items"
  ON public.menu_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Enable RLS on restaurant_settings
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read restaurant settings
CREATE POLICY "Anyone can view restaurant settings"
  ON public.restaurant_settings
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can update restaurant settings
CREATE POLICY "Authenticated users can update restaurant settings"
  ON public.restaurant_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);