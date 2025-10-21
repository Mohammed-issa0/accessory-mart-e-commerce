"use client"

import Image from "next/image"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

export default function CategorySectionClient({ categories }: { categories: Category[] }) {
  const firstRow = categories.slice(0, 6)
  const secondRow = categories.slice(6, 12)

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">تسوّق حسب الفئة</h2>
          <Link href="/products" className="text-sm text-gray-600 hover:text-black transition-colors">
            المزيد
          </Link>
        </div>

        {/* First Row */}
        {firstRow.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mb-4 md:mb-6">
            {firstRow.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="flex flex-col items-center justify-center h-[100px] md:h-[120px] gap-2 md:gap-3 p-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors aspect-square"
              >
                <Image
                  src={category.icon || "/placeholder.svg"}
                  alt={category.name}
                  width={48}
                  height={48}
                  className="p-2"
                />
                <span className="text-sm md:text-base font-medium text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Second Row */}
        {secondRow.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {secondRow.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="flex flex-col items-center justify-center h-[100px] md:h-[120px] gap-2 md:gap-3 p-6 md:p-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors aspect-square"
              >
                <Image
                  src={category.icon || "/placeholder.svg"}
                  alt={category.name}
                  width={48}
                  height={48}
                  className="p-2"
                />
                <span className="text-sm md:text-base font-medium text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
