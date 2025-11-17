-- Create menu_items table to store food and drinks
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  description TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create restaurant_settings table
CREATE TABLE public.restaurant_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default restaurant settings
INSERT INTO public.restaurant_settings (restaurant_name) VALUES ('My Restaurant');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for menu_items
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for restaurant_settings
CREATE TRIGGER update_restaurant_settings_updated_at
  BEFORE UPDATE ON public.restaurant_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample menu items
INSERT INTO public.menu_items (name, category, price, description, available) VALUES
('Budweiser Magnum', 'Beer', 250.00, 'Premium lager beer', true),
('Budweiser Premium', 'Beer', 250.00, 'Premium quality beer', true),
('Corona', 'Beer', 250.00, 'Mexican lager', true),
('Cheese Balls', 'Appetizers', 200.00, 'Crispy fried cheese balls', true),
('Cheese Garlic Bread', 'Appetizers', 150.00, 'Toasted bread with cheese and garlic', true),
('Chicken Chimichuri Skewers', 'Appetizers', 280.00, 'Grilled chicken with chimichuri sauce', true);