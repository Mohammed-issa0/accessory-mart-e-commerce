"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, CreditCard, Truck, Mail, Shield, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ الإعدادات بنجاح",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-600 mt-1">إدارة إعدادات المتجر والنظام</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="store" className="gap-2">
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">المتجر</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">الدفع</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck className="w-4 h-4" />
            <span className="hidden sm:inline">الشحن</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">البريد</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">الأمان</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">الإشعارات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات المتجر</CardTitle>
              <CardDescription>إعدادات المتجر الأساسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">اسم المتجر</Label>
                <Input id="store-name" defaultValue="Accessory Mart" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-description">وصف المتجر</Label>
                <Textarea id="store-description" defaultValue="متجر إلكتروني متخصص في بيع الإكسسوارات" rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-email">البريد الإلكتروني</Label>
                  <Input id="store-email" type="email" defaultValue="info@accessorymart.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-phone">رقم الهاتف</Label>
                  <Input id="store-phone" defaultValue="+966 50 123 4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-address">العنوان</Label>
                <Input id="store-address" defaultValue="الرياض، المملكة العربية السعودية" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إعدادات الضريبة</CardTitle>
              <CardDescription>إدارة الضرائب والرسوم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تفعيل الضريبة</Label>
                  <p className="text-sm text-gray-500">إضافة ضريبة القيمة المضافة للطلبات</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-rate">نسبة الضريبة (%)</Label>
                <Input id="tax-rate" type="number" defaultValue="15" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>طرق الدفع</CardTitle>
              <CardDescription>إدارة طرق الدفع المتاحة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>الدفع عند الاستلام</Label>
                  <p className="text-sm text-gray-500">السماح بالدفع النقدي عند التسليم</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>البطاقات الائتمانية</Label>
                  <p className="text-sm text-gray-500">قبول الدفع بالبطاقات الائتمانية</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>التحويل البنكي</Label>
                  <p className="text-sm text-gray-500">قبول الدفع عبر التحويل البنكي</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الشحن</CardTitle>
              <CardDescription>إدارة خيارات الشحن والتوصيل</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shipping-cost">تكلفة الشحن (ريال)</Label>
                <Input id="shipping-cost" type="number" defaultValue="25" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="free-shipping">الشحن المجاني عند (ريال)</Label>
                <Input id="free-shipping" type="number" defaultValue="200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-time">مدة التوصيل (أيام)</Label>
                <Input id="delivery-time" defaultValue="2-5 أيام عمل" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات البريد الإلكتروني</CardTitle>
              <CardDescription>إدارة قوالب البريد والإشعارات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>إشعار الطلب الجديد</Label>
                  <p className="text-sm text-gray-500">إرسال بريد عند استلام طلب جديد</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تأكيد الطلب للعميل</Label>
                  <p className="text-sm text-gray-500">إرسال بريد تأكيد للعميل</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تحديث حالة الطلب</Label>
                  <p className="text-sm text-gray-500">إشعار العميل بتحديثات الطلب</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الأمان والخصوصية</CardTitle>
              <CardDescription>إعدادات الأمان والحماية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>المصادقة الثنائية</Label>
                  <p className="text-sm text-gray-500">تفعيل المصادقة الثنائية للمسؤولين</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تسجيل النشاطات</Label>
                  <p className="text-sm text-gray-500">حفظ سجل بجميع العمليات</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الإشعارات</CardTitle>
              <CardDescription>إدارة إشعارات النظام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>إشعارات الطلبات</Label>
                  <p className="text-sm text-gray-500">تلقي إشعارات عند الطلبات الجديدة</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تنبيهات المخزون</Label>
                  <p className="text-sm text-gray-500">تنبيه عند انخفاض المخزون</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تقارير يومية</Label>
                  <p className="text-sm text-gray-500">استلام تقرير يومي بالمبيعات</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">إلغاء</Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </div>
  )
}
