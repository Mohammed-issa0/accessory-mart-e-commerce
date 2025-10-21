"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

interface Category {
  id: string
  name_ar: string
}

interface ProductFormProps {
  categories: Category[]
}

export default function ProductForm({ categories }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name_ar: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    description: "",
    is_available: true,
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name_ar: formData.name_ar,
            slug: formData.name_ar.toLowerCase().replace(/\s+/g, "-"),
            price: Number.parseFloat(formData.price),
            stock_quantity: Number.parseInt(formData.stock_quantity),
            category_id: formData.category_id || null,
            description: formData.description,
            is_available: formData.is_available,
          },
        ])
        .select()

      if (error) throw error

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error creating product:", error)
      alert("حدث خطأ أثناء إضافة المنتج")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Information */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-6">معلومات المنتج</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name_ar">اسم المنتج</Label>
            <Input
              id="name_ar"
              value={formData.name_ar}
              onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
              placeholder="مثال: ساعة ذكية"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">سعر المنتج</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="stock_quantity">الكمية في المخزون</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category_id">الفئة</Label>
            <select
              id="category_id"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">اختر الفئة</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_ar}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_available"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label htmlFor="is_available" className="cursor-pointer">
              المنتج متاح في المتجر
            </Label>
          </div>
        </div>
      </div>

      {/* Product Image */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-6">صورة المنتج</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">اسحب الصورة هنا أو اضغط لتختار من جهازك</p>
          <p className="text-xs text-gray-500">(الحد الأقصى 5 ميجا بايت PNG, JPEG, JPG أو GIF)</p>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-6">وصف المنتج</h2>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="اكتب وصفاً مختصراً للمنتج يوضح مميزاته واستخداماته"
          rows={6}
          className="resize-none"
        />
        <p className="text-xs text-gray-500 mt-2">الكلمات والأحرف والأرقام ستساعد العملاء على فهم المنتج</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "جاري الحفظ..." : "حفظ المنتج"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          إلغاء
        </Button>
      </div>
    </form>
  )
}
