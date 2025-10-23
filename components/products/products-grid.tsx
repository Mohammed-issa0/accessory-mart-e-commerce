"use client"

import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/context/cart-context"
import { useWishlist } from "@/lib/context/wishlist-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  slug: string
  stock: number
  image: string
  colors: string[]
  category: string
}

export default function ProductsGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "تم الحذف من المفضلة",
        description: `تم حذف ${product.name} من المفضلة`,
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
      })
      toast({
        title: "تمت الإضافة للمفضلة",
        description: `تم إضافة ${product.name} إلى المفضلة`,
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
    toast({
      title: "تمت الإضافة للسلة",
      description: `تم إضافة ${product.name} إلى سلة التسوق`,
    })
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg mb-4">لم يتم العثور على منتجات</p>
        <p className="text-gray-500">جرب تغيير الفلاتر أو البحث عن شيء آخر</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          عرض <span className="font-bold">{products.length}</span> منتج
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Product Image */}
              <Link href={`/products/${product.slug}`}>
                <div className="relative bg-gray-100 aspect-square">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleWishlist(product)
                    }}
                    className="absolute top-3 left-3 bg-white hover:bg-gray-50 rounded-full w-9 h-9"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isInWishlist(product.id) ? "fill-red-500 stroke-red-500" : "stroke-black"
                      }`}
                    />
                  </Button>
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {product.stock} متبقي
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      نفذت الكمية
                    </span>
                  )}
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-4">
                {product.category && <p className="text-xs text-gray-500 mb-1">{product.category}</p>}
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-sm font-medium mb-2 hover:text-gray-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold">{product.price.toFixed(2)} ريال</p>
                  {product.colors.length > 0 && (
                    <div className="flex gap-1">
                      {product.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 ml-2" />
                  {product.stock === 0 ? "نفذت الكمية" : "أضف للسلة"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
