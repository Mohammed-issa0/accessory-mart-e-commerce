"use client"

import { Search, ShoppingCart, User, Menu, LogOut, Settings, Package, LayoutDashboard, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/context/cart-context"

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createBrowserClient()
  const { totalItems } = useCart()

  useEffect(() => {
    if (!supabase) return

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    if (!supabase) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      checkAdminStatus(user.id)
    }
  }

  const handleSignOut = async () => {
    if (!supabase) return

    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  const checkAdminStatus = async (userId: string) => {
    if (!supabase) return

    const { data: userData } = await supabase.from("users").select("is_admin").eq("id", userId).single()

    setIsAdmin(userData?.is_admin || false)
  }

  return (
    <header className=" bg-white fixed top-0 left-0 w-full z-50">
      {/* Top Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Menu Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              الرئيسية
            </Link>
            <Link href="/about" className="hover:text-gray-600 transition-colors">
              من نحن
            </Link>
            <Link href="/products" className="hover:text-gray-600 transition-colors">
              تسوق
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>لوحة التحكم</span>
            </Link>
          </nav>

          {/* Center: Logo */}
          <div className="flex-1 text-center">
            <Link href="/">
              <h1 className="text-[14px] sm:text-lg md:text-2xl font-bold tracking-wider">ACCESSORY MART</h1>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm pl-6">
            <Link href="/blog" className="hover:text-gray-600 transition-colors">
              المدونة
            </Link>
            <Link href="/contact" className="hover:text-gray-600 transition-colors">
              تواصل
            </Link>
            <Link href="/faq" className="hover:text-gray-600 transition-colors">
              الاسئلة
            </Link>
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            <Link href="/admin" className="md:hidden">
              <Button variant="default" size="icon" className="h-9 w-9">
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-semibold">{user.user_metadata?.full_name || "المستخدم"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {isAdmin && <p className="text-xs text-primary font-semibold mt-1">مدير النظام</p>}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <LayoutDashboard className="ml-2 h-4 w-4" />
                      لوحة التحكم
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">
                      <Heart className="ml-2 h-4 w-4" />
                      المفضلة
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="ml-2 h-4 w-4" />
                      الإعدادات
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="ml-2 h-4 w-4" />
                      طلباتي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Left: Language Switcher */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-3 text-sm">
              EN
            </Button>
            <Button variant="default" size="sm" className="h-8 px-3 text-sm bg-black text-white">
              AR
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Dropdowns */}
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                <span>الفئات</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                <span>منتجات جديدة</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input type="search" placeholder="بحث..." className="pr-10 text-right" />
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
