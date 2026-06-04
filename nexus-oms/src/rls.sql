-- RLS Policies for Nexus OMS
-- Execute after creating tables and setting up auth

-- ============ USERS ============
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can manage all users
CREATE POLICY "Admins can manage all users"
  ON public.users FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============ CUSTOMERS ============
-- All authenticated users can read customers
CREATE POLICY "Staff can read customers"
  ON public.customers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Staff can insert customers
CREATE POLICY "Staff can insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Staff can update customers
CREATE POLICY "Staff can update customers"
  ON public.customers FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Only admins can delete customers
CREATE POLICY "Admins can delete customers"
  ON public.customers FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============ PRODUCTS ============
-- All authenticated users can read products
CREATE POLICY "Staff can read products"
  ON public.products FOR SELECT
  USING (auth.role() = 'authenticated');

-- Staff can insert products
CREATE POLICY "Staff can insert products"
  ON public.products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Staff can update products
CREATE POLICY "Staff can update products"
  ON public.products FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Only admins can delete products
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============ ORDERS ============
-- All authenticated users can read orders
CREATE POLICY "Staff can read orders"
  ON public.orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- Staff can insert orders
CREATE POLICY "Staff can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Staff can update order status
CREATE POLICY "Staff can update orders"
  ON public.orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Only admins can delete orders
CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============ ORDER ITEMS ============
-- All authenticated users can read order items
CREATE POLICY "Staff can read order items"
  ON public.order_items FOR SELECT
  USING (auth.role() = 'authenticated');

-- Staff can insert order items
CREATE POLICY "Staff can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Staff can update order items
CREATE POLICY "Staff can update order items"
  ON public.order_items FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Only admins can delete order items
CREATE POLICY "Admins can delete order items"
  ON public.order_items FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
