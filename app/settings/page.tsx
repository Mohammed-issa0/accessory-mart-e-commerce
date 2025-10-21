"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, MapPin, Lock } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }
    setUser(user)
    setName(user.user_metadata?.full_name || "")
    setPhone(user.user_metadata?.phone || "")
    setAddress(user.user_metadata?.address || "")
    setLoading(false)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: name,
        phone,
        address,
      },
    })

    if (error) {
      setMessage("حدث خطأ أثناء تحديث البيانات")
    } else {
      setMessage("تم تحديث البيانات بنجاح")
    }
    setSaving(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    if (newPassword.length < 6) {
      setMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      setSaving(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      setMessage("حدث خطأ أثناء تحديث كلمة المرور")
    } else {
      setMessage("تم تحديث كلمة المرور بنجاح")
      setCurrentPassword("")
      setNewPassword("")
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">إعدادات الحساب</h1>

        {message && <div className="mb-6 p-4 rounded-lg bg-primary/10 text-primary">{message}</div>}

        <div className="grid gap-8">
          {/* Profile Information */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="h-5 w-5" />
              المعلومات الشخصية
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" value={user?.email || ""} disabled className="flex-1" />
                </div>
                <p className="text-sm text-muted-foreground">لا يمكن تغيير البريد الإلكتروني</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أحمد محمد"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="الرياض، حي الندى"
                    className="flex-1"
                  />
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              تغيير كلمة المرور
            </h2>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "جاري التحديث..." : "تحديث كلمة المرور"}
              </Button>
            </form>
          </div>

          {/* Sign Out */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">تسجيل الخروج</h2>
            <p className="text-muted-foreground mb-4">سيتم تسجيل خروجك من جميع الأجهزة</p>
            <Button variant="destructive" onClick={handleSignOut}>
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
