"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Package, Truck, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    const orderNumber = searchParams.get("orderNumber")
    const customerName = searchParams.get("customerName")
    const customerEmail = searchParams.get("customerEmail")
    const customerPhone = searchParams.get("customerPhone")
    const shippingAddress = searchParams.get("shippingAddress")
    const shippingCity = searchParams.get("shippingCity")
    const total = searchParams.get("total")

    if (orderNumber) {
      setOrderData({
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        shippingCity,
        total,
      })
    }
  }, [searchParams])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-4 w-full">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center">
            {/* Success Icon */}
            <motion.div
              variants={itemVariants}
              animate={{ scale: [0, 1.1, 1] }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-6"
            >
              <div className="flex justify-center">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute inset-0 bg-green-100 rounded-full"
                  />
                  <CheckCircle className="h-24 w-24 text-green-500 relative z-10" />
                </div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">تم تأكيد طلبك بنجاح!</h1>
              <p className="text-gray-600 text-lg">شكراً لك على تسوقك معنا</p>
            </motion.div>

            {/* Order Number */}
            {orderData?.orderNumber && (
              <motion.div variants={itemVariants} className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600 mb-2">رقم الطلب</p>
                <p className="text-2xl font-bold text-blue-600">{orderData.orderNumber}</p>
              </motion.div>
            )}

            {/* Order Details */}
            <motion.div variants={itemVariants} className="bg-gray-50 rounded-lg p-6 mb-8 text-right">
              <h2 className="text-xl font-bold mb-6">تفاصيل الطلب</h2>

              <div className="space-y-4">
                {/* Customer Name */}
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">اسم المستقبل</p>
                    <p className="font-semibold">{orderData?.customerName}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني</p>
                    <p className="font-semibold">{orderData?.customerEmail}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">رقم الهاتف</p>
                    <p className="font-semibold">{orderData?.customerPhone}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">عنوان التوصيل</p>
                    <p className="font-semibold">
                      {orderData?.shippingAddress}, {orderData?.shippingCity}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-bold text-lg">المجموع الكلي</span>
                  <span className="font-bold text-lg text-primary">{orderData?.total} ريال</span>
                </div>
              </div>
            </motion.div>

            {/* Order Status Timeline */}
            <motion.div variants={itemVariants} className="bg-white border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-6 text-right">حالة الطلب</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1 bg-green-500 rounded"></div>
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="font-semibold text-green-600">تم استقبال الطلب</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1 bg-gray-300 rounded"></div>
                  <Package className="h-6 w-6 text-gray-400 flex-shrink-0" />
                  <span className="font-semibold text-gray-600">قيد المعالجة</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1 bg-gray-300 rounded"></div>
                  <Truck className="h-6 w-6 text-gray-400 flex-shrink-0" />
                  <span className="font-semibold text-gray-600">قيد الشحن</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/orders">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="w-full sm:w-auto">
                    عرض طلباتي
                  </Button>
                </motion.div>
              </Link>
              <Link href="/products">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                    متابعة التسوق
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Additional Info */}
            <motion.div variants={itemVariants} className="mt-12 p-6 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                سيتم إرسال تأكيد الطلب إلى بريدك الإلكتروني. يمكنك تتبع حالة طلبك من خلال صفحة "طلباتي" في حسابك.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
