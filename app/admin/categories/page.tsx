"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/contexts/auth-context"
import { useRouter } from "next/navigation"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Search, ImageIcon } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  images?: Array<{ id: number; url: string; alt?: string }>
  created_at?: string
  updated_at?: string
}

export default function CategoriesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_alt: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    } else if (user && !user.is_admin) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.is_admin) {
      fetchCategories()
    }
  }, [user])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.slug.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(categories)
    }
  }, [searchQuery, categories])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getCategories()
      const categoriesList = response.data || []
      setCategories(categoriesList)
      setFilteredCategories(categoriesList)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("slug", formData.slug)
      if (formData.description) {
        formDataToSend.append("description", formData.description)
      }
      if (formData.image_alt) {
        formDataToSend.append("image_alt", formData.image_alt)
      }
      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      if (selectedCategory) {
        // Update
        formDataToSend.append("_method", "PUT")
        await apiClient.updateCategory(selectedCategory.id.toString(), formDataToSend)
      } else {
        // Create
        await apiClient.createCategory(formDataToSend)
      }

      await fetchCategories()
      handleCloseDialog()
    } catch (error: any) {
      console.error("Error saving category:", error)
      alert(error.message || "فشل حفظ الفئة")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return

    try {
      await apiClient.deleteCategory(categoryToDelete.id.toString())
      await fetchCategories()
      setIsDeleteDialogOpen(false)
      setCategoryToDelete(null)
    } catch (error: any) {
      console.error("Error deleting category:", error)
      alert(error.message || "فشل حذف الفئة")
    }
  }

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setSelectedCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        image_alt: category.images?.[0]?.alt || "",
      })
      setImagePreview(category.images?.[0]?.url || "")
    } else {
      setSelectedCategory(null)
      setFormData({
        name: "",
        slug: "",
        description: "",
        image_alt: "",
      })
      setImagePreview("")
    }
    setImageFile(null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedCategory(null)
    setFormData({
      name: "",
      slug: "",
      description: "",
      image_alt: "",
    })
    setImageFile(null)
    setImagePreview("")
  }

  const handleOpenDeleteDialog = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteDialogOpen(true)
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user?.is_admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      
      <div className="flex">
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">إدارة الفئات</h1>
              <p className="text-gray-600">إضافة وتعديل وحذف الفئات</p>
            </div>

            {/* Search and Add */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="البحث عن فئة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleOpenDialog()} className="gap-2">
                      <Plus className="w-4 h-4" />
                      إضافة فئة جديدة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>{selectedCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}</DialogTitle>
                      <DialogDescription>
                        {selectedCategory ? "قم بتعديل بيانات الفئة" : "أدخل بيانات الفئة الجديدة"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">اسم الفئة *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="مثال: إكسسوارات الساعات"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">الرابط (Slug) *</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          required
                          placeholder="مثال: watch-accessories"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">الوصف</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="وصف الفئة (اختياري)"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image">صورة الفئة</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="flex-1"
                          />
                          {imagePreview && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                              <img
                                src={imagePreview || "/placeholder.svg"}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image_alt">نص بديل للصورة</Label>
                        <Input
                          id="image_alt"
                          value={formData.image_alt}
                          onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                          placeholder="وصف الصورة (اختياري)"
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={submitting}>
                          إلغاء
                        </Button>
                        <Button type="submit" disabled={submitting}>
                          {submitting ? "جاري الحفظ..." : selectedCategory ? "تحديث" : "إضافة"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {category.images && category.images.length > 0 ? (
                      <img
                        src={category.images[0].url || "/placeholder.svg"}
                        alt={category.images[0].alt || category.name}
                        className="w-[70%]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{category.slug}</p>
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 bg-transparent"
                        onClick={() => handleOpenDialog(category)}
                      >
                        <Pencil className="w-4 h-4" />
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => handleOpenDeleteDialog(category)}
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">لا توجد فئات</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الفئة "{categoryToDelete?.name}" نهائياً. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
