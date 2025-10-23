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

interface Product {
  id: string
  name_ar: string
  price: number
  stock_quantity: number
  category: { name_ar: string } | null
  product_images: { image_url: string }[]
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
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      // Refresh the page to show updated data
      router.refresh()
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    } catch (error) {
      console.error("Error deleting product:", error)
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
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">رقم المنتج</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">اسم المنتج</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">السعر</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">المخزون</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الفئة</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((product, index) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{index + 1}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {product.product_images?.[0]?.image_url ? (
                        <Image
                          src={product.product_images[0].image_url || "/placeholder.svg"}
                          alt={product.name_ar}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                      )}
                    </div>
                    <span className="text-sm text-gray-900">{product.name_ar}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">{product.price} ج.س</td>
                <td className="py-3 px-4 text-sm text-gray-900">{product.stock_quantity} قطعة</td>
                <td className="py-3 px-4 text-sm text-gray-600">{product.category?.name_ar || "-"}</td>
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
            ))}
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
