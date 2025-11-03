"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { apiClient } from "@/lib/api/client"
import { Spinner } from "@/components/ui/spinner"

interface Category {
  id: number
  name: string
  name_ar?: string
  slug: string
}

interface Color {
  color_name_ar: string
  color_name_en: string
  color_hex: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<{ url: string; file: File }[]>([])
  const [colors, setColors] = useState<Color[]>([])
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
      submitFormData.append("has_variants", "false")

      images.forEach((img) => {
        submitFormData.append("images[]", img.file)
      })

      colors.forEach((color, index) => {
        submitFormData.append(`product_colors[${index}][color_name_ar]`, color.color_name_ar)
        submitFormData.append(`product_colors[${index}][color_name_en]`, color.color_name_en)
        submitFormData.append(`product_colors[${index}][color_hex]`, color.color_hex)
      })

      console.log("[v0] Submitting product with", images.length, "images and", colors.length, "colors")

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
