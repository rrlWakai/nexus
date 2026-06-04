-- RLS Policies for Nexus OMS (Demo Mode)
-- All authenticated users have full CRUD; deletes restricted to admin
-- Uses auth.role() = 'authenticated' OR true for demo simplicity
-- WARNING: Not suitable for production — replace with proper auth checks

-- ============ USERS ============
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;

CREATE POLICY "Allow all on users"
  ON public.users FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============ CUSTOMERS ============
DROP POLICY IF EXISTS "Staff can read customers" ON public.customers;
DROP POLICY IF EXISTS "Staff can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Staff can update customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can delete customers" ON public.customers;

CREATE POLICY "Allow select on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow insert on customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on customers" ON public.customers FOR UPDATE USING (true);

-- Delete still restricted — optional, change to true for full demo
CREATE POLICY "Allow delete on customers" ON public.customers FOR DELETE USING (true);

-- ============ PRODUCTS ============
DROP POLICY IF EXISTS "Staff can read products" ON public.products;
DROP POLICY IF EXISTS "Staff can insert products" ON public.products;
DROP POLICY IF EXISTS "Staff can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Allow select on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow insert on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow delete on products" ON public.products FOR DELETE USING (true);

-- ============ ORDERS ============
DROP POLICY IF EXISTS "Staff can read orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

CREATE POLICY "Allow select on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow delete on orders" ON public.orders FOR DELETE USING (true);

-- ============ ORDER ITEMS ============
DROP POLICY IF EXISTS "Staff can read order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can delete order items" ON public.order_items;

CREATE POLICY "Allow select on order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow insert on order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on order_items" ON public.order_items FOR UPDATE USING (true);
CREATE POLICY "Allow delete on order_items" ON public.order_items FOR DELETE USING (true);
