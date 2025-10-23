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
              <div className="relative bg-white rounded-2xl md:rounded-3xl overflow-visible shadow-sm hover:shadow-xl transition-all duration-300 pb-16 md:pb-20">
                {/* Product Image Container */}
                <Link href={`/products/${product.slug}`}>
                  <div className="relative bg-[#F5F3F0] aspect-square overflow-hidden rounded-2xl md:rounded-3xl">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} className="w-full h-full">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-contain p-6 md:p-10"
                      />
                    </motion.div>

                    {/* Wishlist Button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                      className="absolute top-3 right-3 md:top-4 md:right-4"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleWishlist(product)
                        }}
                        className="bg-white hover:bg-gray-50 rounded-full w-10 h-10 md:w-12 md:h-12 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <motion.div
                          animate={isInWishlist(product.id) ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart
                            className={`h-5 w-5 md:h-6 md:w-6 transition-all duration-300 ${
                              isInWishlist(product.id) ? "fill-black stroke-black" : "stroke-black hover:fill-black"
                            }`}
                          />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </div>
                </Link>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                  className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-lg"
                >
                  {/* Color circles and product name */}
                  <div className="flex items-center justify-between gap-4 mb-2">
                   

                    {/* Product name on the right */}
                    <Link href={`/products/${product.slug}`} className="flex-1 text-right">
                      <h3 className="text-xs md:text-sm font-medium hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                     {/* Color circles on the left */}
                    {product.colors.length > 0 && (
                      <div className="flex gap-1 md:gap-1.5">
                        {product.colors.slice(0, 3).map((color, colorIndex) => (
                          <motion.button
                            key={colorIndex}
                            whileHover={{ scale: 1.2 }}
                            className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-200 ${
                              colorIndex === 0 ? "border-gray-800" : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={`Color ${colorIndex + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price and cart button */}
                  <div className="flex items-center justify-between gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="icon"
                        onClick={() => handleAddToCart(product)}
                        className="rounded-full w-8 h-8 md:w-10 md:h-10 bg-black hover:bg-gray-800 transition-all"
                      >
                        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </Button>
                    </motion.div>

                    <p className="text-base md:text-xl font-bold text-right">${product.price.toFixed(2)}</p>
                  </div>
                </motion.div>
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
