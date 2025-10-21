-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- Policies for products (public read, admin write)
CREATE POLICY "Anyone can view available products" ON public.products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- Policies for product_images (public read, admin write)
CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product images" ON public.product_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- Policies for product_colors (public read, admin write)
CREATE POLICY "Anyone can view product colors" ON public.product_colors
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product colors" ON public.product_colors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- Policies for customers
CREATE POLICY "Customers can view own profile" ON public.customers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all customers" ON public.customers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins can manage customers" ON public.customers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- Policies for orders
CREATE POLICY "Customers can view own orders" ON public.orders
  FOR SELECT USING (
    customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- Policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM public.orders WHERE customer_id IN (
        SELECT id FROM public.customers WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins can manage order items" ON public.order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- Policies for cart
CREATE POLICY "Users can manage own cart" ON public.cart
  FOR ALL USING (user_id = auth.uid());

-- Policies for wishlist
CREATE POLICY "Users can manage own wishlist" ON public.wishlist
  FOR ALL USING (user_id = auth.uid());

-- Policies for settings (public read, admin write)
CREATE POLICY "Anyone can view settings" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
  );
