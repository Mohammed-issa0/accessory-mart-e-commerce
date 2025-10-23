"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const supabase = createBrowserClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    setUser(user)
    setFormData({
      full_name: user.user_metadata?.full_name || "",
      phone: user.user_metadata?.phone || "",
      email: user.email || "",
    })
    setLoading(false)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: formData.full_name,
        phone: formData.phone,
      },
    })

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل تحديث الملف الشخصي",
        variant: "destructive",
      })
    } else {
      toast({
        title: "تم التحديث",
        description: "تم تحديث معلوماتك بنجاح",
      })
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    })

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل تحديث كلمة المرور",
        variant: "destructive",
      })
    } else {
      toast({
        title: "تم التحديث",
        description: "تم تحديث كلمة المرور بنجاح",
      })
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2 text-right">الإعدادات</h1>
        <p className="text-gray-600 text-right">إدارة معلومات حسابك</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4 text-right">المعلومات الشخصية</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="text-right">
            <Label htmlFor="full_name">الاسم الكامل</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="text-right"
            />
          </div>

          <div className="text-right">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="text-right"
            />
          </div>

          <div className="text-right">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" value={formData.email} disabled className="text-right bg-gray-100" />
            <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
          </div>

          <div className="flex justify-end">
            <Button type="submit">حفظ التغييرات</Button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4 text-right">تغيير كلمة المرور</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="text-right">
            <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="text-right"
            />
          </div>

          <div className="text-right">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="text-right"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">تحديث كلمة المرور</Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
