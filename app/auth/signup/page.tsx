"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, UserIcon, Phone, CheckCircle, ArrowRight } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setError("التسجيل غير متوفر حالياً. يتم العمل على إضافة هذه الميزة في الـ API الخارجي.")
    setLoading(false)
  }

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-green-100 px-4"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800"
          >
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">تم إنشاء الحساب بنجاح!</h2>
            <p className="text-green-700 dark:text-green-300 mb-3">يمكنك الآن تسجيل الدخول إلى حسابك</p>
            <p className="text-green-700 dark:text-green-300 text-sm">جاري التحويل إلى صفحة تسجيل الدخول...</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
              <UserIcon className="w-8 h-8 text-primary-foreground" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold">إنشاء حساب جديد</h1>
          <p className="mt-2 text-muted-foreground">انضم إلى Accessory Mart</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-card p-8 rounded-lg border shadow-lg space-y-6"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-destructive/10 text-destructive p-3 rounded-md text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                الاسم الكامل
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أحمد محمد"
                required
                disabled={loading}
                className="transition-all focus:scale-[1.02]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                disabled={loading}
                className="transition-all focus:scale-[1.02]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                disabled={loading}
                className="transition-all focus:scale-[1.02]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
                className="transition-all focus:scale-[1.02]"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <Button type="submit" className="w-full group relative overflow-hidden" disabled={loading}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </span>
                <motion.div
                  className="absolute inset-0 bg-primary-foreground/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </Button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-sm text-muted-foreground"
          >
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-semibold">
              تسجيل الدخول
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}
