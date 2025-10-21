import { Package, Tag, AlertTriangle, TrendingDown } from "lucide-react"

interface ProductsStatsProps {
  totalProducts: number
  activeCategories: number
  outOfStock: number
  lowStock: number
}

export default function ProductsStats({ totalProducts, activeCategories, outOfStock, lowStock }: ProductsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">إجمالي المنتجات</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-2">{totalProducts} منتج</p>
        <button className="text-sm text-gray-500 hover:text-gray-700">عرض التفاصيل</button>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Tag className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">الفئات النشطة</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-2">{activeCategories} فئة</p>
        <button className="text-sm text-gray-500 hover:text-gray-700">عرض التفاصيل</button>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">نفذ من المخزون</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-2">{outOfStock} منتجات</p>
        <button className="text-sm text-gray-500 hover:text-gray-700">عرض التفاصيل</button>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">مخزون منخفض</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-2">{lowStock} منتجات</p>
        <button className="text-sm text-gray-500 hover:text-gray-700">عرض التفاصيل</button>
      </div>
    </div>
  )
}
