-- Insert sample categories first (if not exists)
INSERT INTO public.categories (name_ar, name_en, slug, is_active, display_order)
VALUES 
  ('إكسسوارات الهواتف', 'Phone Accessories', 'phone-accessories', true, 1),
  ('إكسسوارات الساعات', 'Watch Accessories', 'watch-accessories', true, 2),
  ('إكسسوارات الحاسوب', 'Computer Accessories', 'computer-accessories', true, 3),
  ('إكسسوارات السيارات', 'Car Accessories', 'car-accessories', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs
DO $$
DECLARE
  phone_cat_id UUID;
  watch_cat_id UUID;
  computer_cat_id UUID;
  car_cat_id UUID;
BEGIN
  SELECT id INTO phone_cat_id FROM public.categories WHERE slug = 'phone-accessories';
  SELECT id INTO watch_cat_id FROM public.categories WHERE slug = 'watch-accessories';
  SELECT id INTO computer_cat_id FROM public.categories WHERE slug = 'computer-accessories';
  SELECT id INTO car_cat_id FROM public.categories WHERE slug = 'car-accessories';

  -- Insert 10 sample products
  INSERT INTO public.products (name_ar, name_en, slug, description, price, stock_quantity, category_id, is_available, is_featured, sku)
  VALUES 
    (
      'حافظة هاتف جلدية فاخرة',
      'Premium Leather Phone Case',
      'premium-leather-phone-case-' || extract(epoch from now())::bigint,
      'حافظة هاتف مصنوعة من الجلد الطبيعي الفاخر، توفر حماية كاملة لهاتفك مع تصميم أنيق وعصري',
      149.99,
      50,
      phone_cat_id,
      true,
      true,
      'PHN-001'
    ),
    (
      'سماعات لاسلكية بلوتوث',
      'Wireless Bluetooth Earbuds',
      'wireless-bluetooth-earbuds-' || extract(epoch from now())::bigint,
      'سماعات لاسلكية عالية الجودة مع خاصية إلغاء الضوضاء وبطارية تدوم حتى 24 ساعة',
      299.99,
      30,
      phone_cat_id,
      true,
      true,
      'PHN-002'
    ),
    (
      'حامل هاتف للسيارة مغناطيسي',
      'Magnetic Car Phone Holder',
      'magnetic-car-phone-holder-' || extract(epoch from now())::bigint,
      'حامل هاتف مغناطيسي قوي للسيارة، سهل التركيب ويدعم جميع أحجام الهواتف',
      79.99,
      100,
      car_cat_id,
      true,
      false,
      'CAR-001'
    ),
    (
      'شاحن سريع لاسلكي',
      'Fast Wireless Charger',
      'fast-wireless-charger-' || extract(epoch from now())::bigint,
      'شاحن لاسلكي سريع بقوة 15 واط، متوافق مع جميع الأجهزة التي تدعم الشحن اللاسلكي',
      129.99,
      75,
      phone_cat_id,
      true,
      true,
      'PHN-003'
    ),
    (
      'سوار ساعة ذكية سيليكون',
      'Silicone Smart Watch Band',
      'silicone-smart-watch-band-' || extract(epoch from now())::bigint,
      'سوار ساعة ذكية مصنوع من السيليكون عالي الجودة، مريح ومقاوم للماء',
      59.99,
      120,
      watch_cat_id,
      true,
      false,
      'WTC-001'
    ),
    (
      'ماوس لاسلكي قابل لإعادة الشحن',
      'Rechargeable Wireless Mouse',
      'rechargeable-wireless-mouse-' || extract(epoch from now())::bigint,
      'ماوس لاسلكي بتصميم مريح، قابل لإعادة الشحن مع بطارية تدوم لأسابيع',
      89.99,
      60,
      computer_cat_id,
      true,
      false,
      'CMP-001'
    ),
    (
      'كيبورد ميكانيكي RGB',
      'RGB Mechanical Keyboard',
      'rgb-mechanical-keyboard-' || extract(epoch from now())::bigint,
      'لوحة مفاتيح ميكانيكية احترافية مع إضاءة RGB قابلة للتخصيص',
      399.99,
      25,
      computer_cat_id,
      true,
      true,
      'CMP-002'
    ),
    (
      'حامل لابتوب قابل للتعديل',
      'Adjustable Laptop Stand',
      'adjustable-laptop-stand-' || extract(epoch from now())::bigint,
      'حامل لابتوب قابل للتعديل بزوايا متعددة، مصنوع من الألمنيوم المتين',
      159.99,
      40,
      computer_cat_id,
      true,
      false,
      'CMP-003'
    ),
    (
      'كابل شحن سريع USB-C',
      'Fast Charging USB-C Cable',
      'fast-charging-usb-c-cable-' || extract(epoch from now())::bigint,
      'كابل شحن سريع بطول 2 متر، مصنوع من مواد عالية الجودة ومقاوم للتلف',
      39.99,
      200,
      phone_cat_id,
      true,
      false,
      'PHN-004'
    ),
    (
      'واقي شاشة زجاجي مقاوم للكسر',
      'Tempered Glass Screen Protector',
      'tempered-glass-screen-protector-' || extract(epoch from now())::bigint,
      'واقي شاشة زجاجي بتقنية 9H، يوفر حماية كاملة ضد الخدوش والكسر',
      49.99,
      150,
      phone_cat_id,
      true,
      false,
      'PHN-005'
    );

  -- Insert sample images for products (using placeholder images)
  INSERT INTO public.product_images (product_id, image_url, display_order, is_primary)
  SELECT 
    p.id,
    '/placeholder.svg?height=400&width=400&query=' || p.name_en,
    0,
    true
  FROM public.products p
  WHERE p.sku IN ('PHN-001', 'PHN-002', 'CAR-001', 'PHN-003', 'WTC-001', 'CMP-001', 'CMP-002', 'CMP-003', 'PHN-004', 'PHN-005');

END $$;
