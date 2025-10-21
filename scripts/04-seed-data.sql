-- Insert categories
INSERT INTO public.categories (name_ar, name_en, slug, icon, display_order) VALUES
  ('الرجال', 'Men', 'men', '👔', 1),
  ('النساء', 'Women', 'women', '👜', 2),
  ('الاطفال', 'Children', 'children', '🧸', 3),
  ('اكسسوارات', 'Accessories', 'accessories', '💍', 4),
  ('حقائب', 'Bags', 'bags', '👜', 5),
  ('نظارات', 'Glasses', 'glasses', '🕶️', 6),
  ('مجوهرات', 'Jewelry', 'jewelry', '💎', 7)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (name_ar, name_en, slug, description, price, stock_quantity, category_id, is_featured, sku) 
SELECT 
  'ساعة ذكية', 
  'Smart Watch', 
  'smart-watch', 
  'ساعة ذكية عصرية بتصميم أنيق ومميزات متقدمة',
  299.00,
  45,
  (SELECT id FROM public.categories WHERE slug = 'accessories' LIMIT 1),
  true,
  'SW-001'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE sku = 'SW-001');

INSERT INTO public.products (name_ar, name_en, slug, description, price, stock_quantity, category_id, is_featured, sku)
SELECT
  'حقيبة جلدية',
  'Leather Bag',
  'leather-bag',
  'حقيبة جلدية فاخرة بتصميم عصري',
  149.00,
  23,
  (SELECT id FROM public.categories WHERE slug = 'bags' LIMIT 1),
  true,
  'LB-001'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE sku = 'LB-001');

INSERT INTO public.products (name_ar, name_en, slug, description, price, stock_quantity, category_id, is_featured, sku)
SELECT
  'نظارة شمسية',
  'Sunglasses',
  'sunglasses',
  'نظارة شمسية بتصميم كلاسيكي وحماية من الأشعة فوق البنفسجية',
  89.00,
  67,
  (SELECT id FROM public.categories WHERE slug = 'glasses' LIMIT 1),
  true,
  'SG-001'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE sku = 'SG-001');

-- Insert settings
INSERT INTO public.settings (key, value, description) VALUES
  ('site_name_ar', 'Accessory Mart', 'اسم المتجر بالعربية'),
  ('site_name_en', 'Accessory Mart', 'اسم المتجر بالإنجليزية'),
  ('tax_rate', '15', 'نسبة الضريبة المضافة'),
  ('currency', 'SAR', 'العملة المستخدمة'),
  ('free_shipping_threshold', '500', 'الحد الأدنى للشحن المجاني'),
  ('support_phone', '+966 50 123 4567', 'رقم الدعم الفني'),
  ('support_email', 'info@store.com', 'البريد الإلكتروني للدعم'),
  ('website_url', 'www.accessories-store.com', 'رابط الموقع')
ON CONFLICT (key) DO NOTHING;
