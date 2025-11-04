"use client"

import { useEffect, useState } from "react"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/contexts/auth-context"
import { useCart } from "@/lib/context/cart-context"
import { Spinner } from "@/components/ui/spinner"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()
  const { addToCart } = useCart()

  useEffect(() => {
    if (user) {
      fetchFavorites()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      const response = await apiClient.getFavorites()
      setFavorites(response.data || [])
    } catch (error) {
      console.error("Error fetching favorites:", error)
      toast({
        title: "خطأ",
        description: "فشل في تحميل المفضلة",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (productId: number) => {
    try {
      await apiClient.toggleFavorite(productId)
      setFavorites((prev) => prev.filter((item) => item.id !== productId))
      toast({
        title: "تمت الإزالة",
        description: "تم إزالة المنتج من المفضلة",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إزالة المنتج",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = (product: any) => {
    const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.image_url || "/placeholder.svg"
    addToCart({
      id: product.id,
      name: product.name_ar,
      price: product.price,
      image: primaryImage,
    })
    toast({
      title: "تمت الإضافة",
      description: `تم إضافة ${product.name_ar} إلى السلة`,
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-4">يرجى تسجيل الدخول</h1>
            <p className="text-gray-600 mb-6">يجب تسجيل الدخول لعرض المفضلة</p>
            <Link href="/auth/login">
              <Button>تسجيل الدخول</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <Spinner className="w-8 h-8" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-right">المفضلة</h1>

          {favorites.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">المفضلة فارغة</h2>
              <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات إلى المفضلة بعد</p>
              <Link href="/products">
                <Button>تصفح المنتجات</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((product) => {
                const primaryImage =
                  product.product_images?.find((img: any) => img.is_primary)?.image_url || "/placeholder.svg"
                const colorAttr = product.available_attributes?.find(
                  (a: any) => a.slug === "color" || a.name?.toLowerCase() === "color",
                )
                const colors = colorAttr?.values || []

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-square bg-gray-100">
                        <Image
                          src={primaryImage || "/placeholder.svg"}
                          alt={product.name_ar}
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold mb-2 hover:text-gray-600 transition-colors">{product.name_ar}</h3>
                      </Link>

                      {colors.length > 0 && (
                        <div className="flex gap-1 mb-3">
                          {colors.slice(0, 3).map((color: any, idx: number) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hex_color }}
                              title={color.value}
                            />
                          ))}
                        </div>
                      )}

                      <p className="text-lg font-bold mb-4">${product.price.toFixed(2)}</p>

                      <div className="flex gap-2">
                        <Button onClick={() => handleAddToCart(product)} className="flex-1" size="sm">
                          <ShoppingCart className="w-4 h-4 ml-2" />
                          أضف للسلة
                        </Button>
                        <Button
                          onClick={() => handleRemoveFavorite(product.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
