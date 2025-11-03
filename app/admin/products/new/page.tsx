"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { apiClient } from "@/lib/api/client"
import { Spinner } from "@/components/ui/spinner"

interface Category {
  id: number
  name: string
  name_ar?: string
  slug: string
}

interface AttributeValue {
  id: number
  value: string
  hex_color?: string
}

interface Attribute {
  id: number
  name: string
  slug: string
  values: AttributeValue[]
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<{ url: string; file: File }[]>([])
  const [availableColors, setAvailableColors] = useState<AttributeValue[]>([])
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([])
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
    price: "",
    sku: "",
    description: "",
    compare_price: "",
    quantity: "",
    status: "published",
    is_featured: false,
    category_id: "",
  })

  useEffect(() => {
    fetchCategories()
    fetchAttributes()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await apiClient.getCategories()
      const categoriesList = data.data || data.categories || []
      console.log("[v0] Categories fetched:", categoriesList)
      setCategories(categoriesList)
    } catch (error) {
      console.error("[v0] Error fetching categories:", error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  const fetchAttributes = async () => {
    try {
      const data = await apiClient.getAttributes()
      const attributes: Attribute[] = data.data || []
      console.log("[v0] Attributes fetched:", attributes)

      // Find the color attribute
      const colorAttr = attributes.find((a) => a.slug?.toLowerCase() === "color" || a.name?.toLowerCase() === "color")

      if (colorAttr && colorAttr.values) {
        setAvailableColors(colorAttr.values)
        console.log("[v0] Available colors:", colorAttr.values)
      }
    } catch (error) {
      console.error("[v0] Error fetching attributes:", error)
    }
  }

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
    URL.revokeObjectURL(images[index].url)
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleColor = (colorId: number) => {
    setSelectedColorIds((prev) => (prev.includes(colorId) ? prev.filter((id) => id !== colorId) : [...prev, colorId]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitFormData = new FormData()

      // Add basic fields
      submitFormData.append("name_ar", formData.name_ar)
      submitFormData.append("name_en", formData.name_en || formData.name_ar)
      submitFormData.append("slug", formData.slug || formData.name_ar.toLowerCase().replace(/\s+/g, "-"))
      submitFormData.append("price", formData.price)
      submitFormData.append("sku", formData.sku || `PRD-${Date.now()}`)
      submitFormData.append("description", formData.description)
      submitFormData.append("compare_price", formData.compare_price || "")
      submitFormData.append("quantity", formData.quantity)
      submitFormData.append("status", formData.status)
      submitFormData.append("is_featured", formData.is_featured ? "1" : "0")
      submitFormData.append("category_id", formData.category_id)

      if (selectedColorIds.length > 0) {
        submitFormData.append("has_variants", "true")

        selectedColorIds.forEach((colorId, index) => {
          const color = availableColors.find((c) => c.id === colorId)
          const sku = `${formData.sku || "PRD"}-${color?.value || colorId}`

          submitFormData.append(`variants[${index}][sku]`, sku)
          submitFormData.append(`variants[${index}][price]`, formData.price)
          submitFormData.append(`variants[${index}][quantity]`, formData.quantity)
          submitFormData.append(`variants[${index}][is_default]`, index === 0 ? "1" : "0")
          submitFormData.append(`variants[${index}][attribute_values][]`, String(colorId))
        })
      } else {
        submitFormData.append("has_variants", "false")
      }

      // Add images
      images.forEach((img) => {
        submitFormData.append("images[]", img.file)
      })

      console.log(
        "[v0] Submitting product with",
        images.length,
        "images and",
        selectedColorIds.length,
        "color variants",
      )

      await apiClient.createProduct(submitFormData)

      console.log("[v0] Product created successfully")
      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Error creating product:", error)
      alert(error.message || "حدث خطأ أثناء إضافة المنتج")
    } finally {
      setLoading(false)
    }
  }

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة منتج جديد</h1>
          <p className="text-gray-600">أضف منتج جديد إلى متجرك</p>
        </div>
      </div>

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
                <Label htmlFor="quantity">الكمية في المخزون *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
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
              <Label htmlFor="category_id">الفئة *</Label>
              <select
                id="category_id"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
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
            />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">اسحب الصورة هنا أو اضغط لتختار من جهازك</p>
            <p className="text-xs text-gray-500">(PNG, JPEG, JPG أو GIF)</p>
          </label>
        </div>

        {/* Product Colors */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">ألوان المنتج</h2>

          {availableColors.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">اختر الألوان المتاحة للمنتج:</p>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => toggleColor(color.id)}
                    className={`relative w-16 h-16 rounded-lg border-2 transition-all ${
                      selectedColorIds.includes(color.id)
                        ? "border-black scale-110 shadow-lg"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color.hex_color }}
                    title={color.value}
                  >
                    {selectedColorIds.includes(color.id) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {selectedColorIds.length > 0 && (
                <p className="text-sm text-green-600">تم اختيار {selectedColorIds.length} لون</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              لا توجد ألوان متاحة. يرجى التأكد من إضافة خاصية "Color" في نظام الخصائص.
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
    </div>
  )
}
