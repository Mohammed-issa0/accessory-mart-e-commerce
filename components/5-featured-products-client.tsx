"use client"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/context/cart-context"
import { useWishlist } from "@/lib/context/wishlist-context"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

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

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-10"
        >
          أبرز المنتجات
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Product Image */}
                <Link href={`/products/${product.slug}`}>
                  <div className="relative bg-gray-100 aspect-square overflow-hidden">
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} className="w-full h-full">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-contain p-4 md:p-8"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-black/5"
                    />
                  </div>
                </Link>

                {/* Wishlist Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleWishlist(product)
                    }}
                    className="absolute top-2 left-2 md:top-4 md:left-4 bg-white hover:bg-gray-50 rounded-full w-8 h-8 md:w-10 md:h-10 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <motion.div
                      animate={isInWishlist(product.id) ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        className={`h-4 w-4 md:h-5 md:w-5 transition-all duration-300 ${
                          isInWishlist(product.id) ? "fill-red-500 stroke-red-500" : "stroke-black hover:stroke-red-500"
                        }`}
                      />
                    </motion.div>
                  </Button>
                </motion.div>

                {/* Product Details */}
                <div className="p-3 md:p-5">
                  <div className="flex items-center justify-between gap-2 md:gap-3 mb-2 md:mb-3">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-xs md:text-base font-medium text-right flex-1 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    {product.colors.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.15 }}
                        className="flex gap-1 md:gap-1.5"
                      >
                        {product.colors.slice(0, 3).map((color, colorIndex) => (
                          <motion.button
                            key={colorIndex}
                            whileHover={{ scale: 1.2 }}
                            className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-gray-300 hover:border-primary transition-all duration-200"
                            style={{ backgroundColor: color }}
                            aria-label={`Color ${colorIndex + 1}`}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <p className="text-base md:text-xl font-bold text-right">{product.price.toFixed(2)} ج.س</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="gap-1 md:gap-2 transition-all text-xs md:text-sm w-full md:w-auto"
                      >
                        <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                        أضف للسلة
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link href="/products">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                استكشف المزيد من المنتجات
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
