"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export default function ProductSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
    >
      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-square" />

      {/* Details Skeleton */}
      <div className="p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-1.5">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-5 h-5 rounded-full" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </motion.div>
  )
}
