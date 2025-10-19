"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import a1 from "@/public/imgs/a1.png"
import a2 from "@/public/imgs/a2.png"
import a3 from "@/public/imgs/a3.png"
import Image from "next/image"
export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "حقيبة غوتشي GG مارمونت",
      price: 2980.0,
      image: a1,
      colors: ["#F5E6D3", "#000000"],
      liked: false,
    },
    {
      id: 2,
      name: "حقيبة كتف من برادا",
      price: 1750.0,
      image: a2,
      colors: ["#000000", "#F5E6D3", "#E8E8F0"],
      liked: true,
    },
    {
      id: 3,
      name: "حقيبة لويس فيتون باغاتيل",
      price: 4700.0,
      image: a3,
      colors: ["#FFFFFF", "#000000"],
      liked: false,
    },
    {
      id: 4,
      name: "حقيبة غوتشي GG مارمونت",
      price: 2980.0,
      image: a1,
      colors: ["#F5E6D3", "#000000"],
      liked: false,
    },
    {
      id: 5,
      name: "حقيبة كتف من برادا",
      price: 1750.0,
      image: a2,
      colors: ["#000000", "#F5E6D3", "#E8E8F0"],
      liked: true,
    },
    {
      id: 6,
      name: "حقيبة لويس فيتون باغاتيل",
      price: 4700.0,
      image: a3,
      colors: ["#FFFFFF", "#000000"],
      liked: false,
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">أبرز المنتجات</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative bg-gray-100 rounded-3xl overflow-hidden mb-4 aspect-square">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full p-3  group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 bg-white hover:bg-white rounded-full w-10 h-10"
                >
                  <Heart className={`h-5 w-5 ${product.liked ? "fill-black" : ""}`} />
                </Button>

                 <div className="absolute bottom-3 left-[100px] bg-white rounded-2xl p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex flex-col justify-center">
                  <h3 className="text-sm md:text-base font-medium text-right flex-1">{product.name}</h3>
                  <p className="text-lg md:text-xl font-bold text-right">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-1">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        className="w-5 h-5 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
              </div>
              </div>

             
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
