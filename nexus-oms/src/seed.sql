-- Nexus OMS Seed Data
-- Run this AFTER schema.sql in Supabase SQL Editor

INSERT INTO public.products (name, sku, price, category, stock, demand_prediction, demand_label, ai_recommended)
VALUES
  ('Lenovo LOQ Gaming Laptop', 'LEN-LOQ-15', 49999.00, 'Laptop', 15, 94, 'High', true),
  ('Samsung Galaxy A55', 'SAM-A55-5G', 18999.00, 'Cellphone', 42, 68, 'Rising', true),
  ('Office Work Table', 'OFC-WT-120', 8500.00, 'Furniture', 8, 42, 'Stable', false)
ON CONFLICT (sku) DO NOTHING;
