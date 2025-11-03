"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { apiClient } from "@/lib/api/client"

interface Category {
  id: string
  name_ar?: string
  name?: string
}

interface Color {
  color_name_ar: string
  color_name_en: string
  color_hex: string
}

interface ProductFormProps {
  categories: Category[]
  product?: any
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<{ url: string; file: File }[]>([])
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>(
    product?.images?.map((img: any) => ({ id: img.id, url: img.url })) || [],
  )
  const [colors, setColors] = useState<Color[]>(
    product?.product_colors?.map((c: any) => ({
      color_name_ar: c.color_name_ar,
      color_name_en: c.color_name_en || "",
      color_hex: c.color_hex,
    })) || [],
  )
  const [formData, setFormData] = useState({
    name_ar: product?.name_ar || "",
    name_en: product?.name_en || "",
    price: product?.price?.toString() || "",
    stock_quantity: product?.stock_quantity?.toString() || "",
    category_id: product?.category?.id || product?.category_id || "",
    description: product?.description || "",
    sku: product?.sku || "",
    is_available: product?.is_available ?? true,
    is_featured: product?.is_featured ?? false,
  })
  const router = useRouter()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
    }))

    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(images[index].url)
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addColor = () => {
    setColors([...colors, { color_name_ar: "", color_name_en: "", color_hex: "#000000" }])
  }

  const updateColor = (index: number, field: keyof Color, value: string) => {
    const newColors = [...colors]
    newColors[index][field] = value
    setColors(newColors)
  }

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitFormData = new FormData()

      submitFormData.append("name_ar", formData.name_ar)
      submitFormData.append("name_en", formData.name_en || formData.name_ar)
      submitFormData.append("price", formData.price)
      submitFormData.append("sku", formData.sku || `PRD-${Date.now()}`)
      submitFormData.append("description", formData.description)
      submitFormData.append("quantity", formData.stock_quantity)
      submitFormData.append("status", "published")
      submitFormData.append("is_featured", formData.is_featured ? "1" : "0")
      submitFormData.append("category_id", formData.category_id)
      submitFormData.append("has_variants", "false")

      const slug =
        product?.slug ||
        formData.name_ar
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\u0600-\u06FFa-z0-9-]/g, "") +
          "-" +
          Date.now()
      submitFormData.append("slug", slug)

      if (product) {
        submitFormData.append("_method", "PUT")
      }

      images.forEach((img) => {
        submitFormData.append("images[]", img.file)
      })

      colors.forEach((color, index) => {
        submitFormData.append(`product_colors[${index}][color_name_ar]`, color.color_name_ar)
        submitFormData.append(`product_colors[${index}][color_name_en]`, color.color_name_en)
        submitFormData.append(`product_colors[${index}][color_hex]`, color.color_hex)
      })

      console.log("[v0] Submitting product with", images.length, "new images and", colors.length, "colors")
      console.log("[v0] Form data entries:")
      for (const [key, value] of submitFormData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: [File: ${value.name}]`)
        } else {
          console.log(`  ${key}: ${value}`)
        }
      }

      if (product) {
        const deletedImageIds = product.images
          ?.filter((img: any) => !existingImages.find((ei) => ei.id === img.id))
          .map((img: any) => img.id)

        if (deletedImageIds && deletedImageIds.length > 0) {
          deletedImageIds.forEach((id: number) => {
            submitFormData.append("delete_images[]", id.toString())
          })
        }

        await apiClient.updateProduct(String(product.id), submitFormData)
        console.log("[v0] Product updated successfully")
      } else {
        await apiClient.createProduct(submitFormData)
        console.log("[v0] Product created successfully")
      }

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving product:", error)
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
                  {cat.name_ar || cat.name}
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

        {existingImages.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">الصور الحالية:</p>
            <div className="grid grid-cols-4 gap-4">
              {existingImages.map((img, index) => (
                <div key={img.id} className="relative group">
                  <Image
                    src={img.url || "/placeholder.svg"}
                    alt={`Existing ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">صور جديدة:</p>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={img.url || "/placeholder.svg"}
                    alt={`New ${index + 1}`}
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
                  <span className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    جديدة
                  </span>
                </div>
              ))}
            </div>
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
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">اسحب الصورة هنا أو اضغط لتختار من جهازك</p>
          <p className="text-xs text-gray-500">(الحد الأقصى 5 ميجا بايت PNG, JPEG, JPG أو GIF)</p>
        </label>
      </div>

      {/* Product Colors */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">ألوان المنتج</h2>
          <Button type="button" onClick={addColor} size="sm" variant="outline">
            <Plus className="w-4 h-4 ml-2" />
            إضافة لون
          </Button>
        </div>

        {colors.length > 0 ? (
          <div className="space-y-4">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`color_name_ar_${index}`}>اسم اللون (عربي)</Label>
                    <Input
                      id={`color_name_ar_${index}`}
                      value={color.color_name_ar}
                      onChange={(e) => updateColor(index, "color_name_ar", e.target.value)}
                      placeholder="مثال: أسود"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`color_name_en_${index}`}>اسم اللون (إنجليزي)</Label>
                    <Input
                      id={`color_name_en_${index}`}
                      value={color.color_name_en}
                      onChange={(e) => updateColor(index, "color_name_en", e.target.value)}
                      placeholder="Example: Black"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`color_hex_${index}`}>كود اللون</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`color_hex_${index}`}
                        type="color"
                        value={color.color_hex}
                        onChange={(e) => updateColor(index, "color_hex", e.target.value)}
                        className="w-16 h-9 p-1 cursor-pointer"
                      />
                      <Input
                        value={color.color_hex}
                        onChange={(e) => updateColor(index, "color_hex", e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => removeColor(index)}
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">
            لم يتم إضافة ألوان بعد. اضغط على "إضافة لون" لإضافة لون جديد
          </p>
        )}
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
          {loading ? "جاري الحفظ..." : product ? "تحديث المنتج" : "حفظ المنتج"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          إلغاء
        </Button>
      </div>
    </form>
  )
}
