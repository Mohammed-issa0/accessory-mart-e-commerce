# إعداد قاعدة البيانات - Accessory Mart

## نظرة عامة على قاعدة البيانات

تم تصميم قاعدة البيانات لدعم متجر إلكتروني متكامل مع لوحة تحكم إدارية شاملة.

## الجداول الرئيسية

### 1. المستخدمين والصلاحيات
- **users**: معلومات المستخدمين (مرتبط مع Supabase Auth)
- **admins**: المسؤولين ولوحة التحكم
- **customers**: ملفات العملاء وإحصائياتهم

### 2. المنتجات
- **categories**: تصنيفات المنتجات
- **products**: معلومات المنتجات الأساسية
- **product_images**: صور المنتجات (متعددة لكل منتج)
- **product_colors**: ألوان المنتجات المتاحة

### 3. الطلبات
- **orders**: معلومات الطلبات
- **order_items**: عناصر كل طلب

### 4. التسوق
- **cart**: سلة التسوق
- **wishlist**: قائمة الأمنيات

### 5. النظام
- **settings**: إعدادات المتجر
- **notifications**: الإشعارات

## الميزات الأمنية

### Row Level Security (RLS)
تم تفعيل RLS على جميع الجداول مع سياسات محددة:
- العملاء يمكنهم رؤية بياناتهم فقط
- المسؤولين لديهم صلاحيات كاملة
- البيانات العامة (المنتجات، التصنيفات) متاحة للجميع

### الدوال التلقائية (Triggers)
- تحديث `updated_at` تلقائياً
- توليد أرقام الطلبات تلقائياً
- تحديث إحصائيات العملاء عند إضافة طلبات
- تحديث عدد المبيعات للمنتجات

## خطوات التنفيذ

### 1. تشغيل السكربتات بالترتيب:

\`\`\`bash
# في لوحة تحكم Supabase SQL Editor
# قم بتشغيل الملفات بالترتيب التالي:

1. scripts/01-create-tables.sql
2. scripts/02-create-functions.sql
3. scripts/03-enable-rls.sql
4. scripts/04-seed-data.sql
\`\`\`

### 2. إعداد Google Authentication

في لوحة تحكم Supabase:
1. اذهب إلى Authentication > Providers
2. فعّل Google Provider
3. أضف Client ID و Client Secret من Google Cloud Console

### 3. إعداد Storage (اختياري)

لتخزين صور المنتجات:
\`\`\`sql
-- في Supabase Storage
-- أنشئ bucket جديد باسم 'products'
-- فعّل Public Access للصور
\`\`\`

## العلاقات بين الجداول

\`\`\`
users (Supabase Auth)
  ├── customers (user_id)
  ├── admins (user_id)
  ├── cart (user_id)
  ├── wishlist (user_id)
  └── notifications (user_id)

categories
  └── products (category_id)
      ├── product_images (product_id)
      ├── product_colors (product_id)
      └── order_items (product_id)

customers
  └── orders (customer_id)
      └── order_items (order_id)
\`\`\`

## الفهارس (Indexes)

تم إضافة فهارس على:
- `products.category_id` - للبحث حسب التصنيف
- `products.slug` - للوصول السريع للمنتجات
- `orders.customer_id` - لعرض طلبات العميل
- `orders.status` - للفلترة حسب الحالة
- `orders.created_at` - للترتيب الزمني

## ملاحظات مهمة

1. **الأمان**: جميع الجداول محمية بـ RLS
2. **الأداء**: تم إضافة فهارس على الأعمدة الأكثر استخداماً
3. **التوسع**: البنية قابلة للتوسع لإضافة ميزات جديدة
4. **الإحصائيات**: يتم تحديث الإحصائيات تلقائياً عبر Triggers

## البيانات التجريبية

السكربت `04-seed-data.sql` يضيف:
- 7 تصنيفات رئيسية
- 3 منتجات تجريبية
- إعدادات المتجر الأساسية

## الخطوات التالية

بعد تشغيل السكربتات:
1. أضف مسؤول أول في جدول `admins`
2. ارفع صور المنتجات إلى Storage
3. أضف المزيد من المنتجات عبر لوحة التحكم
4. اختبر نظام الطلبات والدفع
