"use client"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/context/cart-context"
import { useWishlist } from "@/lib/context/wishlist-context"

interface Product {
  id: string
  name: string
  price: number
  slug: string
  image: string
  colors: string[]
}

export default function FeaturedProductsClient({ products }: { products: Product[] }) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
      })
    }
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">أبرز المنتجات</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Product Image */}
                <Link href={`/products/${product.slug}`}>
                  <div className="relative bg-gray-100 aspect-square">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleWishlist(product)
                      }}
                      className="absolute top-4 left-4 bg-white hover:bg-gray-50 rounded-full w-10 h-10"
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${
                          isInWishlist(product.id) ? "fill-red-500 stroke-red-500" : "stroke-black"
                        }`}
                      />
                    </Button>
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-sm md:text-base font-medium text-right flex-1 hover:text-gray-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    {product.colors.length > 0 && (
                      <div className="flex gap-1.5">
                        {product.colors.slice(0, 3).map((color, index) => (
                          <button
                            key={index}
                            className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: color }}
                            aria-label={`Color ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg md:text-xl font-bold text-right">{product.price.toFixed(2)} ريال</p>
                    <Button size="sm" onClick={() => handleAddToCart(product)} className="gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      أضف للسلة
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/products">
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              استكشف المزيد من المنتجات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
