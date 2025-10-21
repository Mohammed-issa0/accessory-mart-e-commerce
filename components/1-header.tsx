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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                      <span>الفئات</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <DropdownMenuItem key={category.id} asChild>
                          <Link href={`/products?category=${category.slug}`} className="cursor-pointer">
                            {category.name_ar}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>لا توجد فئات</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                      <span>منتجات جديدة</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {newProducts.length > 0 ? (
                      newProducts.map((product) => (
                        <DropdownMenuItem key={product.id} asChild>
                          <Link href={`/products/${product.slug}`} className="cursor-pointer flex justify-between">
                            <span>{product.name_ar}</span>
                            <span className="text-primary font-semibold">{product.price} ر.س</span>
                          </Link>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>لا توجد منتجات جديدة</DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/products" className="cursor-pointer text-primary font-semibold">
                        عرض جميع المنتجات
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <form onSubmit={handleSearch} className="relative w-full max-w-xs">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="بحث..."
                  className="pr-10 text-right"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
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
                  {/* Search in mobile */}
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="بحث..."
                      className="pr-10 text-right"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>

                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-2">
                    <Link
                      href="/"
                      className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      الرئيسية
                    </Link>
                    <Link
                      href="/about"
                      className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      من نحن
                    </Link>
                    <Link
                      href="/products"
                      className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      تسوق
                    </Link>
                    <Link
                      href="/blog"
                      className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      المدونة
                    </Link>
                    <Link
                      href="/contact"
                      className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      تواصل
                    </Link>
                    <Link
                      href="/faq"
                      className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      الاسئلة
                    </Link>
                  </nav>

                  {/* Categories */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2 px-4">الفئات</h3>
                    <div className="flex flex-col gap-1">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.slug}`}
                          className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {category.name_ar}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* New Products */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2 px-4">منتجات جديدة</h3>
                    <div className="flex flex-col gap-1">
                      {newProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors text-sm flex justify-between"
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
