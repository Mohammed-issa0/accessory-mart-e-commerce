"use client"

import { useWishlist } from "@/lib/context/wishlist-context"
import { useCart } from "@/lib/context/cart-context"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">المفضلة</h1>

          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-6">لا توجد منتجات في المفضلة</p>
              <Link href="/products">
                <Button>تصفح المنتجات</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href={`/products/${item.slug}`}>
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-contain p-6"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-medium mb-2 hover:text-gray-600 transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-lg font-bold mb-4">{item.price.toFixed(2)} ريال</p>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => handleAddToCart(item)}>
                        <ShoppingCart className="w-4 h-4 ml-2" />
                        أضف للسلة
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeFromWishlist(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
