# Backend Migration Guide

## تم الانتقال إلى Backend جديد

تم إعادة بناء الباك إند بالكامل للاتصال بـ API خارجي (Laravel).

### الميزات المتوفرة حالياً من الـ API الخارجي:

✅ **المصادقة (Authentication)**
- تسجيل الدخول (Login)
- الحصول على بيانات المستخدم (Get User Profile)
- تسجيل الخروج (Logout)

✅ **المنتجات (Products)**
- قائمة جميع المنتجات
- تفاصيل منتج واحد

✅ **الفئات (Categories)**
- قائمة جميع الفئات
- تفاصيل فئة واحدة

### الميزات المحلية (Local Storage) - في انتظار إضافة Endpoints:

⏳ **السلة (Cart)**
- يتم حفظها محلياً في localStorage
- ستتم إضافة API endpoints لاحقاً

⏳ **المفضلة (Wishlist)**
- يتم حفظها محلياً في localStorage
- ستتم إضافة API endpoints لاحقاً

⏳ **الطلبات (Orders)**
- يتم حفظها محلياً في localStorage
- ستتم إضافة API endpoints لاحقاً

⏳ **لوحة التحكم ال��دارية (Admin Dashboard)**
- في انتظار إضافة endpoints للإدارة

⏳ **التسجيل (Registration)**
- في انتظار إضافة endpoint للتسجيل

### البنية التقنية الجديدة:

**API Client:**
- `lib/api/client.ts` - عميل API للاتصال بالـ backend الخارجي
- `lib/api/config.ts` - إعدادات الـ API والـ endpoints

**Authentication:**
- `lib/contexts/auth-context.tsx` - Context للمصادقة باستخدام Bearer Token
- يتم حفظ الـ token في localStorage

**API Proxy Routes:**
- `/api/auth/login` - تسجيل الدخول
- `/api/auth/user` - الحصول على بيانات المستخدم
- `/api/auth/logout` - تسجيل الخروج
- `/api/products` - قائمة المنتجات
- `/api/products/[id]` - تفاصيل منتج
- `/api/categories` - قائمة الفئات

### ملاحظات مهمة:

1. **تم إزالة Supabase بالكامل** للمنتجات والفئات والمصادقة
2. **السلة والمفضلة والطلبات** تعمل محلياً حتى يتم إضافة endpoints لها
3. **لوحة التحكم الإدارية** ستحتاج إلى endpoints جديدة للعمل
4. **التسجيل** غير متوفر حالياً - يحتاج إلى endpoint

### الخطوات التالية:

عند إضافة endpoints جديدة في الـ API الخارجي، يمكن تحديث:
1. `lib/api/config.ts` - إضافة الـ endpoints الجديدة
2. `lib/api/client.ts` - إضافة methods جديدة
3. إنشاء proxy routes في `/app/api/`
4. تحديث المكونات لاستخدام الـ API الجديد
