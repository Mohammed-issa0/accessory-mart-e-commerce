import { Search, ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  return (
    <header className="border-b bg-white">
      {/* Top Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Language Switcher */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-3 text-sm">
              EN
            </Button>
            <Button variant="default" size="sm" className="h-8 px-3 text-sm bg-black text-white">
              AR
            </Button>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 text-center">
            <h1 className="text-xl md:text-2xl font-bold tracking-wider">ACCESSORY MART</h1>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Menu Items */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-gray-600 transition-colors">
                الرئيسية
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors">
                من نحن
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors">
                تسوق
              </a>
            </nav>

            {/* Dropdowns */}
            <div className="flex items-center gap-4 text-sm mr-auto">
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
