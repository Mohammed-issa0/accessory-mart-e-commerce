"use client"

import type React from "react"

import { Search, ShoppingCart, User, Menu, LogOut, Settings, Package, LayoutDashboard, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/context/cart-context"
import { useWishlist } from "@/lib/context/wishlist-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type Category = {
  id: string
  name_ar: string
  slug: string
}

type Product = {
  id: string
  name_ar: string
  slug: string
  price: number
}

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createBrowserClient()
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const router = useRouter()

  useEffect(() => {
    if (!supabase) return

    checkUser()
    fetchCategories()
    fetchNewProducts()

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

  const fetchCategories = async () => {
    if (!supabase) return

    const { data } = await supabase
      .from("categories")
      .select("id, name_ar, slug")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(10)

    if (data) {
      setCategories(data)
    }
  }

  const fetchNewProducts = async () => {
    if (!supabase) return

    const { data } = await supabase
      .from("products")
      .select("id, name_ar, slug, price")
      .eq("is_available", true)
      .order("created_at", { ascending: false })
      .limit(3)

    if (data) {
      setNewProducts(data)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  return (
    <header className="bg-white fixed top-0 left-0 w-full z-50 shadow-sm">
      {/* Desktop Header */}
      <div className="hidden md:block">
        {/* Top Navigation */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Menu Items */}
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-gray-600 transition-colors">
                الرئيسية
              </Link>
              <Link href="/about" className="hover:text-gray-600 transition-colors">
                من نحن
              </Link>
              <Link href="/products" className="hover:text-gray-600 transition-colors">
                تسوق
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>لوحة التحكم</span>
                </Link>
              )}
            </nav>

            {/* Center: Logo */}
            <div className="flex-1 text-center">
              <Link href="/">
                <h1 className="text-2xl font-bold tracking-wider">ACCESSORY MART</h1>
              </Link>
            </div>

            {/* Menu Items */}
            <nav className="flex items-center gap-6 text-sm pl-6">
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
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
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
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <LayoutDashboard className="ml-2 h-4 w-4" />
                            لوحة التحكم
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="cursor-pointer">
                        <Heart className="ml-2 h-4 w-4" />
                        المفضلة
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="ml-2 h-4 w-4" />
                        الإعدادات
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
            </div>

           
          </div>
        </div>

       
       
      </div>

      <div className="md:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Burger Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-right">القائمة</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {/* Navigation Links with Icons */}
                  <nav className="flex flex-col gap-2">
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      <span>الرئيسية</span>
                    </Link>
                    <Link
                      href="/about"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>من ��حن</span>
                    </Link>
                    <Link
                      href="/products"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span>تسوق</span>
                    </Link>
                    <Link
                      href="/blog"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                      <span>المدونة</span>
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>تواصل</span>
                    </Link>
                    <Link
                      href="/faq"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>الاسئلة</span>
                    </Link>
                  </nav>

                  {/* Categories with Icons */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2 px-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                      الفئات
                    </h3>
                    <div className="flex flex-col gap-1">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.slug}`}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          <span>{category.name_ar}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* New Products with Icon */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2 px-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      منتجات جديدة
                    </h3>
                    <div className="flex flex-col gap-1">
                      {newProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="flex items-center justify-between gap-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span>{product.name_ar}</span>
                          <span className="text-primary font-semibold">{product.price} ر.س</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex-1 text-center">
              <Link href="/">
                <h1 className="text-lg font-bold tracking-wider">ACCESSORY MART</h1>
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
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
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <LayoutDashboard className="ml-2 h-4 w-4" />
                            لوحة التحكم
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="cursor-pointer">
                        <Heart className="ml-2 h-4 w-4" />
                        المفضلة
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="ml-2 h-4 w-4" />
                        الإعدادات
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
