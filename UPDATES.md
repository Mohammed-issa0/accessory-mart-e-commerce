# تحديثات موقع Accessory Mart E-commerce

## نظرة عامة
تم تحديث الموقع بالكامل للعمل مع الـ API الخارجي الجديد من `https://ecommerce-api.wildfleet.net/api`

---

## 1. تحديثات الـ API Client

### الميزات الجديدة المضافة:

#### المنتجات (Products):
- ✅ **إنشاء منتج جديد** - `POST /api/admin/products`
  - دعم رفع صور متعددة
  - دعم المتغيرات (variants) مع الخصائص
  - دعم الحالات: draft, published, archived
  
- ✅ **تحديث منتج** - `POST /api/admin/products/{id}` مع `_method=PUT`
  - تحديث جميع بيانات المنتج
  - إضافة/حذف الصور
  - إدارة المتغيرات
  
- ✅ **حذف منتج** - `DELETE /api/admin/products/{id}`
  - حذف المنتج نهائياً مع جميع بياناته

#### الفئات (Categories):
- ✅ **إنشاء فئة جديدة** - `POST /api/admin/categories`
- ✅ **تحديث فئة** - `POST /api/admin/categories/{id}` مع `_method=PUT`
- ✅ **حذف فئة** - `DELETE /api/admin/categories/{id}`

---

## 2. تحديثات لوحة التحكم (Admin Dashboard)

### صفحة المنتجات (`/admin/products`):
- ✅ عرض جميع المنتجات من الـ API
- ✅ عرض الفئات مع عدد المنتجات في كل فئة
- ✅ إحصائيات دقيقة:
  - إجمالي المنتجات
  - عدد الفئات النشطة
  - المنتجات غير المتوفرة
  - المنتجات قليلة المخزون
- ✅ فلترة المنتجات حسب الفئة
- ✅ زر حذف المنتج مع تأكيد
- ✅ زر تعديل المنتج

### صفحة إضافة منتج (`/admin/products/new`):
- ✅ نموذج كامل لإضافة منتج جديد
- ✅ رفع صور متعددة مع معاينة
- ✅ اختيار الفئة من القائمة
- ✅ حقول كاملة:
  - الاسم بالعربي والإنجليزي
  - السعر والكمية
  - رمز المنتج (SKU)
  - الوصف
  - حالة المنتج
  - منتج مميز

### صفحة تعديل منتج (`/admin/products/[id]/edit`):
- ✅ تحميل بيانات المنتج الحالية
- ✅ تعديل جميع الحقول
- ✅ إدارة الصور (إضافة/حذف)
- ✅ حفظ التعديلات

---

## 3. إصلاحات الواجهة

### القائمة المنسدلة للمستخدم (User Dropdown):
- ✅ **تم إصلاح المشكلة**: كانت جميع الروابط تذهب إلى لوحة التحكم
- ✅ **الآن**: كل رابط يذهب إلى صفحته الصحيحة:
  - "حسابي" → `/account`
  - "طلباتي" → `/account/orders`
  - "المفضلة" → `/account/wishlist`
  - "الإعدادات" → `/account/settings`
  - "لوحة التحكم" → `/admin` (للمدراء فقط)

### الصفحة الرئيسية:
- ✅ إصلاح مشكلة عدم ظهور المنتجات والفئات
- ✅ تحويل IDs من number إلى string لتطابق الواجهة
- ✅ معالجة آمنة للبيانات مع قيم افتراضية

---

## 4. الملفات المحدثة

### API Layer:
- `lib/api/config.ts` - إضافة endpoints جديدة
- `lib/api/client.ts` - إضافة methods للـ CRUD operations
- `app/api/products/[id]/route.ts` - إضافة DELETE method
- `app/api/admin/products/route.ts` - إضافة POST method للإنشاء
- `app/api/admin/products/[id]/route.ts` - إضافة POST method للتحديث

### Admin Pages:
- `app/admin/products/page.tsx` - تحديث لعرض البيانات من API
- `app/admin/products/new/page.tsx` - صفحة إضافة منتج جديدة
- `app/admin/products/[id]/edit/page.tsx` - صفحة تعديل المنتج
- `components/admin/products-table.tsx` - إضافة وظيفة الحذف

### UI Components:
- `components/1-header.tsx` - إصلاح روابط القائمة المنسدلة
- `components/4-category-section.tsx` - إصلاح عرض الفئات
- `components/5-featured-products.tsx` - إصلاح عرض المنتجات

---

## 5. متطلبات الـ API

### Authentication:
جميع عمليات الإدارة (Create, Update, Delete) تتطلب:
- Bearer Token في الـ Authorization header
- المستخدم يجب أن يكون مدير (is_admin = true)

### بنية البيانات:

#### إنشاء منتج:
\`\`\`
POST /api/admin/products
Content-Type: multipart/form-data

Fields:
- name_ar (required)
- name_en
- slug (required)
- price (required)
- sku (required)
- description
- compare_price
- quantity (required)
- status (draft/published/archived)
- is_featured (0/1)
- category_id (required)
- images[] (files)
- has_variants (true/false)
- variants[0][sku]
- variants[0][price]
- variants[0][quantity]
- variants[0][attribute_values][]
\`\`\`

#### تحديث منتج:
\`\`\`
POST /api/admin/products/{id}
Content-Type: multipart/form-data

Fields: (نفس حقول الإنشاء)
+ _method: PUT
+ delete_images[] (IDs of images to delete)
+ delete_variants (IDs of variants to delete)
\`\`\`

#### حذف منتج:
\`\`\`
DELETE /api/admin/products/{id}
Authorization: Bearer {token}
\`\`\`

---

## 6. الميزات القادمة

### قريباً:
- [ ] إدارة الفئات (إضافة/تعديل/حذف)
- [ ] إدارة الطلبات (عند توفر API endpoints)
- [ ] إدارة العملاء (عند توفر API endpoints)
- [ ] التقارير والإحصائيات (عند توفر API endpoints)
- [ ] إدارة المتغيرات (Variants) في نموذج المنتج

---

## 7. ملاحظات مهمة

### البيئة المحلية:
- الموقع يعمل على `http://localhost:3000`
- الـ API يعمل على `https://ecommerce-api.wildfleet.net/api`

### البيئة الإنتاجية:
- الموقع منشور على `https://emart0.vercel.app`
- يستخدم نفس الـ API الخارجي

### المصادقة:
- Token يُحفظ في localStorage
- يُرسل تلقائياً مع كل طلب يتطلب مصادقة
- يُحذف عند تسجيل الخروج

---

## 8. كيفية الاستخدام

### إضافة منتج جديد:
1. سجل دخول كمدير
2. اذهب إلى لوحة التحكم → المنتجات
3. اضغط على "إضافة منتج"
4. املأ البيانات المطلوبة
5. ارفع الصور
6. اضغط "حفظ المنتج"

### تعديل منتج:
1. من صفحة المنتجات، اضغط على أيقونة التعديل
2. عدّل البيانات المطلوبة
3. اضغط "تحديث المنتج"

### حذف منتج:
1. من صفحة المنتجات، اضغط على أيقونة الحذف
2. أكد عملية الحذف
3. سيتم حذف المنتج نهائياً

---

## 9. الدعم الفني

في حال واجهت أي مشاكل:
1. تحقق من console في المتصفح (F12)
2. تحقق من أن الـ API يعمل بشكل صحيح
3. تأكد من أنك مسجل دخول كمدير
4. تحقق من أن Token صالح

---

**آخر تحديث:** 2025
**الإصدار:** 2.0.0
