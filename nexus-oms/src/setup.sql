-- Nexus OMS — Complete Database Setup
-- Run this ENTIRE file in Supabase SQL Editor (one click)
-- Creates tables + permissive RLS (demo mode) + seed data

-- ============================
-- 1. TABLES
-- ============================

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  segment text DEFAULT 'Mid-Market',
  lifetime_value numeric DEFAULT 0,
  engagement_score numeric DEFAULT 0,
  last_active timestamptz DEFAULT now(),
  status text DEFAULT 'New',
  initials text GENERATED ALWAYS AS (
    UPPER(LEFT(name, 1) || COALESCE(LEFT(SPLIT_PART(name, ' ', 2), 1), ''))
  ) STORED,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  price numeric(10,2) NOT NULL,
  category text,
  stock integer DEFAULT 0,
  status text GENERATED ALWAYS AS (
    CASE
      WHEN stock = 0 THEN 'Out of Stock'
      WHEN stock <= 20 THEN 'Low Stock'
      ELSE 'In Stock'
    END
  ) STORED,
  demand_prediction numeric DEFAULT 50,
  demand_label text DEFAULT 'Stable',
  next_shipment date,
  image_url text,
  ai_recommended boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL DEFAULT 'ORD-' || LPAD(CAST(FLOOR(random() * 1000000) AS text), 6, '0'),
  customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE,
  total_amount numeric(10,2) DEFAULT 0,
  status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  priority numeric(3,1) DEFAULT 5.0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  subtotal numeric(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_customers_updated_at ON public.customers;
CREATE TRIGGER set_customers_updated_at
  BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================
-- 2. RLS POLICIES (Demo — permissive for anon key)
-- ============================

-- Users
DROP POLICY IF EXISTS "Allow all on users" ON public.users;
CREATE POLICY "Allow all on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Customers
DROP POLICY IF EXISTS "Allow select on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow insert on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow update on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow delete on customers" ON public.customers;
CREATE POLICY "Allow select on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow insert on customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on customers" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Allow delete on customers" ON public.customers FOR DELETE USING (true);

-- Products
DROP POLICY IF EXISTS "Allow select on products" ON public.products;
DROP POLICY IF EXISTS "Allow insert on products" ON public.products;
DROP POLICY IF EXISTS "Allow update on products" ON public.products;
DROP POLICY IF EXISTS "Allow delete on products" ON public.products;
CREATE POLICY "Allow select on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow insert on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow delete on products" ON public.products FOR DELETE USING (true);

-- Orders
DROP POLICY IF EXISTS "Allow select on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow update on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow delete on orders" ON public.orders;
CREATE POLICY "Allow select on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow delete on orders" ON public.orders FOR DELETE USING (true);

-- Order Items
DROP POLICY IF EXISTS "Allow select on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow insert on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow update on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow delete on order_items" ON public.order_items;
CREATE POLICY "Allow select on order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow insert on order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on order_items" ON public.order_items FOR UPDATE USING (true);
CREATE POLICY "Allow delete on order_items" ON public.order_items FOR DELETE USING (true);

-- ============================
-- 3. SEED DATA
-- ============================

INSERT INTO public.products (name, sku, price, category, stock, demand_prediction, demand_label, ai_recommended)
VALUES
  ('Lenovo LOQ Gaming Laptop', 'LEN-LOQ-15', 49999.00, 'Laptop', 15, 94, 'High', true),
  ('Samsung Galaxy A55', 'SAM-A55-5G', 18999.00, 'Cellphone', 42, 68, 'Rising', true),
  ('Office Work Table', 'OFC-WT-120', 8500.00, 'Furniture', 8, 42, 'Stable', false)
ON CONFLICT (sku) DO NOTHING;
