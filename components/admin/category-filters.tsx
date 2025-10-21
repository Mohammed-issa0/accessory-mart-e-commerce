"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

interface Category {
  id: string
  name_ar: string
  count: number
}

interface CategoryFiltersProps {
  totalProducts: number
  categories: Category[]
  selectedCategory?: string
}

export default function CategoryFilters({ totalProducts, categories, selectedCategory }: CategoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (categoryId?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set("category", categoryId)
    } else {
      params.delete("category")
    }
    params.delete("showAll") // Reset showAll when changing filters
    router.push(`/admin/products?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* All Products Button */}
      <Button variant={!selectedCategory ? "default" : "outline"} size="sm" onClick={() => handleFilterChange()}>
        الكل
        <span
          className={`mr-2 px-2 py-0.5 rounded text-xs ${!selectedCategory ? "bg-white text-black" : "bg-gray-100"}`}
        >
          {totalProducts}
        </span>
      </Button>

      {/* Category Buttons */}
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange(category.id)}
        >
          {category.name_ar}
          <span
            className={`mr-2 px-2 py-0.5 rounded text-xs ${
              selectedCategory === category.id ? "bg-white text-black" : "bg-gray-100"
            }`}
          >
            {category.count}
          </span>
        </Button>
      ))}
    </div>
  )
}
