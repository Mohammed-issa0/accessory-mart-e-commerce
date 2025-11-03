"use client"

import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"

interface Product {
  id: string | number
  name_ar: string
  price: number
  stock_quantity?: number
  quantity?: number
  category_id?: number
  category?: { name_ar?: string; name?: string } | null
  images?: { url: string }[]
  image_url?: string
}

interface ProductsTableProps {
  products: Product[]
  showAll?: boolean
}

export default function ProductsTable({ products, showAll = false }: ProductsTableProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const displayedProducts = showAll ? products : products.slice(0, 10)

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    setIsDeleting(true)
    try {
      await apiClient.deleteProduct(String(productToDelete.id))

      console.log("[v0] Product deleted successfully:", productToDelete.id)

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
      alert("حدث خطأ أثناء حذف المنتج")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الصورة</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">اسم المنتج</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">السعر</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">المخزون</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الفئة</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((product) => {
              const stockQuantity = product.stock_quantity ?? product.quantity ?? 0
              const imageUrl = product.images?.[0]?.url || product.image_url
              const categoryName = product.category?.name_ar || product.category?.name || "-"

              return (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={product.name_ar}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">📦</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900 font-medium">{product.name_ar}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{product.price} ج.س</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-sm ${
                        stockQuantity === 0
                          ? "text-red-600 font-semibold"
                          : stockQuantity < 10
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    >
                      {stockQuantity} قطعة
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{categoryName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المنتج؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المنتج "{productToDelete?.name_ar}" نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
