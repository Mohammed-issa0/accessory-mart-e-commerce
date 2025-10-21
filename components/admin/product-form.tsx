"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface Category {
  id: string
  name_ar: string
}

interface ProductFormProps {
  categories: Category[]
  product?: any
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [images, setImages] = useState<{ url: string; file?: File }[]>(
    product?.product_images?.map((img: any) => ({ url: img.image_url })) || [],
  )
  const [formData, setFormData] = useState({
    name_ar: product?.name_ar || "",
    name_en: product?.name_en || "",
    price: product?.price?.toString() || "",
    stock_quantity: product?.stock_quantity?.toString() || "",
    category_id: product?.category_id || "",
    description: product?.description || "",
    sku: product?.sku || "",
    is_available: product?.is_available ?? true,
    is_featured: product?.is_featured ?? false,
  })
  const router = useRouter()
  const supabase = createClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()
        return { url: data.url, file }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      setImages((prev) => [...prev, ...uploadedImages])
    } catch (error) {
      console.error("Error uploading images:", error)
      alert("حدث خطأ أثناء رفع الصور")
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = formData.name_ar
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")

      const endpoint = product ? `/api/products/${product.id}` : "/api/products/create"
      const method = product ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug: product?.slug || slug + "-" + Date.now(),
          images: images.map((img, index) => ({
            url: img.url,
            display_order: index,
            is_primary: index === 0,
          })),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `فشل في ${product ? "تحديث" : "إضافة"} المنتج`)
      }

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
      alert(error instanceof Error ? error.message : `حدث خطأ أثناء ${product ? "تحديث" : "إضافة"} المنتج`)
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name_ar">اسم المنتج (عربي) *</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                placeholder="مثال: ساعة ذكية"
                required
              />
            </div>

            <div>
              <Label htmlFor="name_en">اسم المنتج (إنجليزي)</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder="Example: Smart Watch"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">سعر المنتج *</Label>
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
              <Label htmlFor="stock_quantity">الكمية في المخزون *</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="sku">رمز المنتج (SKU)</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="PRD-001"
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

          <div className="flex items-center gap-6">
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

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                منتج مميز
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-6">صور المنتج</h2>

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-4">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <Image
                  src={img.url || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    رئيسية
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <label
          htmlFor="image-upload"
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer block"
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploadingImage}
          />
          {uploadingImage ? (
            <>
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-sm text-gray-600 mb-2">جاري رفع الصور...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">اسحب الصورة هنا أو اضغط لتختار من جهازك</p>
              <p className="text-xs text-gray-500">(الحد الأقصى 5 ميجا بايت PNG, JPEG, JPG أو GIF)</p>
            </>
          )}
        </label>
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
        <Button type="submit" disabled={loading || uploadingImage} className="flex-1">
          {loading ? "جاري الحفظ..." : product ? "تحديث المنتج" : "حفظ المنتج"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          إلغاء
        </Button>
      </div>
    </form>
  )
}
