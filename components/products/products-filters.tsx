"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useState } from "react"

interface Category {
  id: string
  name_ar: string
  slug: string
}

export default function ProductsFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")

  const colorOptions = [
    { name: "أسود", hex: "#000000" },
    { name: "أبيض", hex: "#FFFFFF" },
    { name: "بيج", hex: "#D4B896" },
    { name: "أزرق", hex: "#A8C5E0" },
    { name: "أحمر", hex: "#DC143C" },
    { name: "أخضر", hex: "#228B22" },
    { name: "بني", hex: "#8B4513" },
    { name: "رمادي", hex: "#808080" },
    { name: "وردي", hex: "#FFC0CB" },
    { name: "أصفر", hex: "#FFD700" },
  ]

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setMinPrice("")
    setMaxPrice("")
    router.push("/products")
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set("minPrice", minPrice)
    else params.delete("minPrice")
    if (maxPrice) params.set("maxPrice", maxPrice)
    else params.delete("maxPrice")
    router.push(`/products?${params.toString()}`)
  }

  const hasFilters = searchParams.toString().length > 0

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm sticky top-36">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">الفلاتر</h2>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
            <X className="w-4 h-4 ml-1" />
            مسح الكل
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-bold mb-3">الفئات</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter("category", "")}
            className={`block w-full text-right px-3 py-2 rounded-md transition-colors ${
              !searchParams.get("category") ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
            }`}
          >
            جميع الفئات
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilter("category", category.slug)}
              className={`block w-full text-right px-3 py-2 rounded-md transition-colors ${
                searchParams.get("category") === category.slug
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              }`}
            >
              {category.name_ar}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-3">الألوان</h3>
        <div className="grid grid-cols-5 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.hex}
              onClick={() => updateFilter("color", color.hex)}
              className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                searchParams.get("color") === color.hex
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-bold mb-3">نطاق السعر</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="minPrice" className="text-sm">
              من (ريال)
            </Label>
            <Input
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="maxPrice" className="text-sm">
              إلى (ريال)
            </Label>
            <Input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="10000"
              min="0"
            />
          </div>
          <Button onClick={applyPriceFilter} className="w-full" size="sm">
            تطبيق
          </Button>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-bold mb-3">الترتيب</h3>
        <select
          value={searchParams.get("sort") || ""}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">الأحدث</option>
          <option value="price-asc">السعر: من الأقل للأعلى</option>
          <option value="price-desc">السعر: من الأعلى للأقل</option>
          <option value="name">الاسم: أ-ي</option>
        </select>
      </div>
    </div>
  )
}
