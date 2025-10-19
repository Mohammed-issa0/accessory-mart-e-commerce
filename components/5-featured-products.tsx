"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import a1 from "@/public/imgs/a1.png"
import a2 from "@/public/imgs/a2.png"
import a3 from "@/public/imgs/a3.png"
import Image from "next/image"

export default function FeaturedProducts() {
  const [likedProducts, setLikedProducts] = useState<number[]>([2, 5])

  const toggleLike = (id: number) => {
    setLikedProducts((prev) => (prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]))
  }

  const products = [
    {
      id: 1,
      name: "حقيبة غوتشي GG مارمونت",
      price: 2980.0,
      image: a1,
      colors: ["#F5E6D3", "#000000"],
    },
    {
      id: 2,
      name: "حقيبة كتف من برادا",
      price: 1750.0,
      image: a2,
      colors: ["#000000", "#F5E6D3", "#E8E8F0"],
    },
    {
      id: 3,
      name: "حقيبة لويس فيتون باغاتيل",
      price: 4700.0,
      image: a3,
      colors: ["#FFFFFF", "#000000"],
    },
    {
      id: 4,
      name: "حقيبة غوتشي GG مارمونت",
      price: 2980.0,
      image: a1,
      colors: ["#F5E6D3", "#000000"],
    },
    {
      id: 5,
      name: "حقيبة كتف من برادا",
      price: 1750.0,
      image: a2,
      colors: ["#000000", "#F5E6D3", "#E8E8F0"],
    },
    {
      id: 6,
      name: "حقيبة لويس فيتون باغاتيل",
      price: 4700.0,
      image: a3,
      colors: ["#FFFFFF", "#000000"],
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">أبرز المنتجات</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="relative bg-gray-100 aspect-square">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-4 left-4 bg-white hover:bg-gray-50 rounded-full w-10 h-10"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        likedProducts.includes(product.id) ? "fill-black stroke-black" : "stroke-black"
                      }`}
                    />
                  </Button>
                </div>

                {/* Product Details */}
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="text-sm md:text-base font-medium text-right flex-1">{product.name}</h3>
                    <div className="flex gap-1.5">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                          style={{ backgroundColor: color }}
                          aria-label={`Color ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-right">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
