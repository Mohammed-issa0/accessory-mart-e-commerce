"use client"

import { useSearchParams } from "next/navigation"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("orderNumber")

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 text-center max-w-2xl"
        >
          <div className="bg-white rounded-lg p-12">
            <div className="relative w-full h-64 mb-8">
              <Image
                src="/images/design-mode/Wait%20Checkout.png"
                alt="Successful transfer"
                fill
                className="object-contain"
              />
            </div>

            <h1 className="text-3xl font-bold mb-4">انتظر حتى يتم تأكيد التحويل......</h1>

            <p className="text-gray-600 mb-2">تم إنشاء طلبك بنجاح!</p>
            {orderNumber && (
              <p className="text-lg font-semibold mb-6">
                رقم الطلب: <span className="text-primary">{orderNumber}</span>
              </p>
            )}

            <p className="text-gray-700 mb-8">
              سيتم التواصل معك قريباً لتأكيد الطلب وترتيب التوصيل.
              <br />
              شكراً لثقتك بنا!
            </p>

            <div className="flex gap-4 justify-center">
              <Link href="/orders">
                <Button size="lg">عرض طلباتي</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg">
                  متابعة التسوق
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
