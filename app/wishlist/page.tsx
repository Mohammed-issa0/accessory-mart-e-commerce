"use client"

import { useWishlist } from "@/lib/context/wishlist-context"
import { useCart } from "@/lib/context/cart-context"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    })
    toast({
      title: "تمت الإضافة للسلة",
      description: `تم إضافة ${item.name} إلى سلة التسوق`,
    })
  }

  const handleRemoveFromWishlist = (item: any) => {
    removeFromWishlist(item.id)
    toast({
      title: "تم الحذف من المفضلة",
      description: `تم حذف ${item.name} من المفضلة`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8"
          >
            المفضلة
          </motion.h1>

          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="mb-6"
              >
                <Heart className="h-16 w-16 text-gray-300 mx-auto" />
              </motion.div>
              <p className="text-gray-600 mb-6 text-lg">لا توجد منتجات في المفضلة</p>
              <Link href="/products">
                <Button>تصفح المنتجات</Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {wishlist.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href={`/products/${item.slug}`}>
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} className="w-full h-full">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-contain p-6"
                        />
                      </motion.div>
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-medium mb-2 hover:text-gray-600 transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-lg font-bold mb-4">{item.price.toFixed(2)} ريال</p>

                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button size="sm" className="w-full" onClick={() => handleAddToCart(item)}>
                          <ShoppingCart className="w-4 h-4 ml-2" />
                          أضف للسلة
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" variant="outline" onClick={() => handleRemoveFromWishlist(item)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
