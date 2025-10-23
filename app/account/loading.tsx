"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
    >
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    </motion.div>
  )
}
