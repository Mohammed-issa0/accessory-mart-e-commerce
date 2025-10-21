import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

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
}

export default function ProductsTable({ products }: ProductsTableProps) {
  return (
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
          {products.slice(0, 3).map((product, index) => (
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
              <td className="py-3 px-4 text-sm text-gray-900">{product.price} ريال</td>
              <td className="py-3 px-4 text-sm text-gray-900">{product.stock_quantity} قطعة</td>
              <td className="py-3 px-4 text-sm text-gray-600">{product.category?.name_ar || "-"}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
