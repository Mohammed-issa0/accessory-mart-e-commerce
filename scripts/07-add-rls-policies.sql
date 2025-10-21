-- Enable Row Level Security on all tables
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

-- Categories: Public read, admin write
CREATE POLICY "Allow public read access to categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert on categories" ON public.categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on categories" ON public.categories
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete on categories" ON public.categories
  FOR DELETE USING (true);

-- Products: Public read, admin write
CREATE POLICY "Allow public read access to products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert on products" ON public.products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on products" ON public.products
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete on products" ON public.products
  FOR DELETE USING (true);

-- Product Images: Public read, admin write
CREATE POLICY "Allow public read access to product_images" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert on product_images" ON public.product_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on product_images" ON public.product_images
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete on product_images" ON public.product_images
  FOR DELETE USING (true);

-- Product Colors: Public read, admin write
CREATE POLICY "Allow public read access to product_colors" ON public.product_colors
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert on product_colors" ON public.product_colors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on product_colors" ON public.product_colors
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete on product_colors" ON public.product_colors
  FOR DELETE USING (true);

-- Users: Users can read and update their own data
CREATE POLICY "Allow users to read their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow all insert on users" ON public.users
  FOR INSERT WITH CHECK (true);

-- Admins: Public read for admin verification
CREATE POLICY "Allow public read access to admins" ON public.admins
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert on admins" ON public.admins
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on admins" ON public.admins
  FOR UPDATE USING (true);

-- Customers: Public read, admin write
CREATE POLICY "Allow public read access to customers" ON public.customers
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert on customers" ON public.customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on customers" ON public.customers
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete on customers" ON public.customers
  FOR DELETE USING (true);

-- Orders: Public read, admin write
CREATE POLICY "Allow public read access to orders" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert on orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on orders" ON public.orders
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete on orders" ON public.orders
  FOR DELETE USING (true);

-- Order Items: Public read, admin write
CREATE POLICY "Allow public read access to order_items" ON public.order_items
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert on order_items" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on order_items" ON public.order_items
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete on order_items" ON public.order_items
  FOR DELETE USING (true);

-- Cart: Users can manage their own cart
CREATE POLICY "Allow users to read their own cart" ON public.cart
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert into their own cart" ON public.cart
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own cart" ON public.cart
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete from their own cart" ON public.cart
  FOR DELETE USING (auth.uid() = user_id);

-- Wishlist: Users can manage their own wishlist
CREATE POLICY "Allow users to read their own wishlist" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert into their own wishlist" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete from their own wishlist" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- Settings: Public read, admin write
CREATE POLICY "Allow public read access to settings" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert on settings" ON public.settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on settings" ON public.settings
  FOR UPDATE USING (true);

-- Notifications: Users can read their own notifications
CREATE POLICY "Allow users to read their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow all insert on notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
