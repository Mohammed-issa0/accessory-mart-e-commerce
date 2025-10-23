"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star, ChevronLeft, Truck, Shield, RefreshCw, Ruler } from "lucide-react"
import { useCart } from "@/lib/context/cart-context"
import { useWishlist } from "@/lib/context/wishlist-context"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

const SIZES = ["XS", "S", "M", "L", "XL"]

interface ProductDetailClientProps {
  product: any
  similarProducts: any[]
}

export default function ProductDetailClient({ product, similarProducts }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("L")
  const [selectedColor, setSelectedColor] = useState(product.product_colors?.[0]?.color_hex || "")
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const { toast } = useToast()

  const images = product.product_images || []
  const colors = product.product_colors || []
  const primaryImage = images[0]?.image_url || "/placeholder.svg?height=600&width=600"

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

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "تمت الإزالة من المفضلة",
        description: `تم إزالة ${product.name_ar} من المفضلة`,
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name_ar,
        price: product.price,
        image: primaryImage,
        slug: product.slug,
      })
      toast({
        title: "تمت الإضافة إلى المفضلة",
        description: `تم إضافة ${product.name_ar} إلى المفضلة`,
      })
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
          <h1 className="text-3xl font-bold mb-4">{product.name_ar}</h1>

          

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
                    key={color.color_hex}
                    onClick={() => setSelectedColor(color.color_hex)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.color_hex ? "border-black scale-110" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.color_hex }}
                    title={color.color_name_ar}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="flex gap-4 mb-8">
            <div className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-md">
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            </div>
            <Button onClick={handleAddToCart} className="flex-1 h-auto py-3 text-base" size="lg">
              <ShoppingCart className="ml-2 h-5 w-5" />
              اضافة الى السلة
            </Button>
          </div>

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
              <Ruler className="h-6 w-6 text-gray-600" />
              <span className="text-sm">المقاسات والمقاربة</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <RefreshCw className="h-6 w-6 text-gray-600" />
              <span className="text-sm">شحن وإرجاع مجاني</span>
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
            onClick={handleToggleWishlist}
            className="absolute top-4 left-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>

          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
            <Image
              src={images[selectedImage]?.image_url || primaryImage}
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
                    src={img.image_url || "/placeholder.svg"}
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
              const itemImage = item.product_images?.find((img: any) => img.is_primary)?.image_url || "/placeholder.svg"
              const itemColors = item.product_colors || []

              return (
                <Link key={item.id} href={`/products/${item.slug}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-gray-50 rounded-2xl p-6 group cursor-pointer relative"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        if (isInWishlist(item.id)) {
                          removeFromWishlist(item.id)
                        } else {
                          addToWishlist({
                            id: item.id,
                            name: item.name_ar,
                            price: item.price,
                            image: itemImage,
                            slug: item.slug,
                          })
                        }
                      }}
                      className="absolute top-4 left-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart
                        className={`h-5 w-5 ${isInWishlist(item.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                      />
                    </button>

                    <div className="relative aspect-square mb-4">
                      <Image src={itemImage || "/placeholder.svg"} alt={item.name_ar} fill className="object-contain" />
                    </div>

                    <h3 className="font-semibold mb-2 text-center">{item.name_ar}</h3>

                    {/* Colors */}
                    {itemColors.length > 0 && (
                      <div className="flex justify-center gap-1 mb-3">
                        {itemColors.slice(0, 3).map((color: any, idx: number) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.color_hex }}
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
