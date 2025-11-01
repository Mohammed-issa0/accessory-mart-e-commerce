"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, user } = useAuth()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(email, password)

      setTimeout(() => {
        // Refresh to get updated user state
        router.refresh()
      }, 100)
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && !loading) {
      console.log(" User logged in, checking admin status:", user.is_admin)
      if (user.is_admin) {
        console.log(" Redirecting to admin panel...")
        router.push("/admin")
      } else {
        console.log(" Redirecting to home page...")
        router.push("/")
      }
    }
  }, [user, loading, router])

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
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold">تسجيل الدخول</h1>
          <p className="mt-2 text-muted-foreground">مرحباً بك في Accessory Mart</p>
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

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
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
              transition={{ delay: 0.6 }}
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
                disabled={loading}
                className="transition-all focus:scale-[1.02]"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Button type="submit" className="w-full group relative overflow-hidden" disabled={loading}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
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
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-muted-foreground"
          >
            ليس لديك حساب؟{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
              إنشاء حساب جديد
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}
