/*
  # Create products table and related schemas

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (integer)
      - `category` (text)
      - `brand` (text)
      - `in_stock` (integer)
      - `image_url` (text)
      - `specifications` (jsonb)
      - `features` (text[])
      - `rating` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on products table
    - Add policies for:
      - Anyone can view products
      - Only authenticated users (admins) can insert/update/delete products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name jsonb NOT NULL, -- Store translations: {"en": "Product Name", "fr": "Nom du Produit"}
  description jsonb NOT NULL, -- Store translations
  price integer NOT NULL,
  category jsonb NOT NULL, -- Store translations
  brand text NOT NULL,
  in_stock integer NOT NULL DEFAULT 0,
  image_url text NOT NULL,
  specifications jsonb NOT NULL DEFAULT '{}',
  features jsonb NOT NULL DEFAULT '[]', -- Store translations
  rating numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can modify products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial products
INSERT INTO products (name, description, price, category, brand, in_stock, image_url, specifications, features, rating) VALUES
(
  '{"en": "HP 67XL Black Ink Cartridge", "fr": "Cartouche d''encre HP 67XL Noir"}',
  '{"en": "High-yield ink cartridge for HP printers. Compatible with HP DeskJet and HP ENVY series.", "fr": "Cartouche d''encre à haut rendement pour imprimantes HP. Compatible avec les séries HP DeskJet et HP ENVY."}',
  22500,
  '{"en": "Ink Cartridges", "fr": "Cartouches d''Encre"}',
  'HP',
  15,
  'https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg',
  '{
    "type": {"en": "Ink Cartridge", "fr": "Cartouche d''Encre"},
    "color": {"en": "Black", "fr": "Noir"},
    "compatibility": {"en": "HP DeskJet, HP ENVY", "fr": "HP DeskJet, HP ENVY"},
    "yield": {"en": "400 pages", "fr": "400 pages"},
    "dimensions": {"en": "11.5 x 3.6 x 2.3 cm", "fr": "11.5 x 3.6 x 2.3 cm"},
    "weight": {"en": "50g", "fr": "50g"}
  }',
  '[
    {"en": "High-yield cartridge", "fr": "Cartouche à haut rendement"},
    {"en": "Original HP ink formula", "fr": "Formule d''encre HP originale"},
    {"en": "Smudge-resistant prints", "fr": "Impressions résistantes aux taches"},
    {"en": "Easy installation", "fr": "Installation facile"}
  ]',
  4.5
);

-- Add more initial products here...