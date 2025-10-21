"use client"

import { Search, ShoppingCart, User, Menu, LogOut, Settings, Package } from "lucide-react"
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

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const supabase = createBrowserClient()

  useEffect(() => {
    if (!supabase) return

    checkUser()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadCartCount(session.user.id)
      } else {
        setCartCount(0)
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
      loadCartCount(user.id)
    }
  }

  const loadCartCount = async (userId: string) => {
    if (!supabase) return

    const { count } = await supabase.from("cart").select("*", { count: "exact", head: true }).eq("user_id", userId)

    setCartCount(count || 0)
  }

  const handleSignOut = async () => {
    if (!supabase) return

    await supabase.auth.signOut()
    setUser(null)
    setCartCount(0)
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
            <a href="#" className="hover:text-gray-600 transition-colors">
              من نحن
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              تسوق
            </a>
          </nav>

          {/* Center: Logo */}
          <div className="flex-1 text-center">
            <Link href="/">
              <h1 className="text-[14px] sm:text-lg md:text-2xl font-bold tracking-wider">ACCESSORY MART</h1>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm pl-6">
            <a href="#" className="hover:text-gray-600 transition-colors">
              المدونة
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              تواصل
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              الاسئلة
            </a>
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
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
                  </div>
                  <DropdownMenuSeparator />
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
