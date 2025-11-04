"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, ChevronLeft, Truck, Shield, RefreshCw, Package, Star } from "lucide-react"
import { useCart } from "@/lib/context/cart-context"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/contexts/auth-context"

const SIZES = ["XS", "S", "M", "L", "XL"]

interface ProductDetailClientProps {
  product: any
  similarProducts: any[]
}

export default function ProductDetailClient({ product, similarProducts }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("L")
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  const colorAttr = product.available_attributes?.find(
    (a: any) => a.slug === "color" || a.name?.toLowerCase() === "color",
  )
  const colors = colorAttr?.values || []
  const [selectedColor, setSelectedColor] = useState(colors[0]?.hex_color || "")

  const { addToCart } = useCart()
  const { toast } = useToast()
  const { user } = useAuth()

  const images = product.images || []
  const primaryImage = images[0]?.url || "/placeholder.svg?height=600&width=600"

  useEffect(() => {
    if (user && product.id) {
      checkFavoriteStatus()
    }
  }, [user, product.id])

  const checkFavoriteStatus = async () => {
    try {
      const response = await apiClient.checkFavorite(product.id.toString())
      setIsFavorited(response.is_favorited)
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name_ar,
      price: product.price,
      image: primaryImage,
    })
    toast({
      title: "تمت الإضافة إلى السلة",
      description: `تم إضافة ${product.name_ar} إلى سلة التسوق`,
    })
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "يجب تسجيل الدخول لإضافة المنتجات إلى المفضلة",
        variant: "destructive",
      })
      return
    }

    setFavoriteLoading(true)
    try {
      const response = await apiClient.toggleFavorite(product.id)
      setIsFavorited(response.is_favorited)
      toast({
        title: response.is_favorited ? "تمت الإضافة إلى المفضلة" : "تمت الإزالة من المفضلة",
        description: response.is_favorited
          ? `تم إضافة ${product.name_ar} إلى المفضلة`
          : `تم إزالة ${product.name_ar} من المفضلة`,
      })
    } catch (error: any) {
      toast({
        title: "حدث خطأ",
        description: error.message || "فشل في تحديث المفضلة",
        variant: "destructive",
      })
    } finally {
      setFavoriteLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-gray-900">
          الرئيسية
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <Link href="/products" className="hover:text-gray-900">
          {product.category?.name_ar || "المنتجات"}
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <span className="text-gray-900">{product.name_ar}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Left Side: Product Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="order-2 md:order-1"
        >
          {/* Product Title */}
          <h1 className="text-3xl font-bold mb-2">{product.name_ar}</h1>
          {product.name_en && <p className="text-lg text-gray-600 mb-4">{product.name_en}</p>}

          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-600 mr-2">(4.5)</span>
            </div>
            {product.sku && <span className="text-sm text-gray-500">SKU: {product.sku}</span>}
            {product.quantity !== undefined && (
              <span className={`text-sm ${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.quantity > 0 ? `متوفر (${product.quantity})` : "غير متوفر"}
              </span>
            )}
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">اختيار المقاس المناسب</h3>
            <div className="flex gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-md border-2 transition-all ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">الألوان المتاحة</h3>
              <div className="flex gap-2">
                {colors.map((color: any) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.hex_color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.hex_color ? "border-black scale-110" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.hex_color }}
                    title={color.value}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="flex gap-4 mb-8">
            <div className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-md">
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-sm text-gray-500 line-through mr-2">${product.compare_price.toFixed(2)}</span>
              )}
            </div>
            <Button onClick={handleAddToCart} className="flex-1 h-auto py-3 text-base" size="lg">
              <ShoppingCart className="ml-2 h-5 w-5" />
              اضافة الى السلة
            </Button>
          </div>

          {product.description && (
            <div className="mb-8 pb-8 border-b">
              <h3 className="text-lg font-semibold mb-3">وصف المنتج</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="h-6 w-6 text-gray-600" />
              <span className="text-sm">دفع آمن</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Truck className="h-6 w-6 text-gray-600" />
              <span className="text-sm">شحن مجاني</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Package className="h-6 w-6 text-gray-600" />
              <span className="text-sm">ضمان الجودة</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <RefreshCw className="h-6 w-6 text-gray-600" />
              <span className="text-sm">إرجاع مجاني</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Images */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="order-1 md:order-2 relative"
        >
          {/* Wishlist Button */}
          <button
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
            className="absolute top-4 left-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
          >
            <Heart className={`h-6 w-6 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>

          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
            <Image
              src={images[selectedImage]?.url || primaryImage}
              alt={product.name_ar}
              fill
              className="object-contain p-8"
              priority
            />
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.slice(0, 4).map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? "border-black" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img.url || "/placeholder.svg"}
                    alt={`صورة ${idx + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">منتجات مشابهة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProducts.map((item: any) => {
              const itemImage =
                item.images?.find((img: any) => img.is_primary)?.url || item.images?.[0]?.url || "/placeholder.svg"
              const itemColorAttr = item.available_attributes?.find(
                (a: any) => a.slug === "color" || a.name?.toLowerCase() === "color",
              )
              const itemColors = itemColorAttr?.values || []

              return (
                <Link key={item.id} href={`/products/${item.slug}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-gray-50 rounded-2xl p-6 group cursor-pointer relative"
                  >
                    <div className="relative aspect-square mb-4">
                      <Image src={itemImage || "/placeholder.svg"} alt={item.name_ar} fill className="object-contain" />
                    </div>

                    <h3 className="font-semibold mb-2 text-center">{item.name_ar}</h3>

                    {itemColors.length > 0 && (
                      <div className="flex justify-center gap-1 mb-3">
                        {itemColors.slice(0, 3).map((color: any, idx: number) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hex_color }}
                            title={color.value}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
