"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Address = {
  id: string
  full_name: string
  phone: string
  email: string
  country: string
  city: string
  address_line1: string
  address_line2?: string
  postal_code?: string
  is_default: boolean
  address_type: string
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    country: "السعودية",
    city: "",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    is_default: false,
    address_type: "billing",
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching addresses:", error)
    } else {
      setAddresses(data || [])
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    if (editingAddress) {
      // Update existing address
      const { error } = await supabase.from("addresses").update(formData).eq("id", editingAddress.id)

      if (error) {
        toast({
          title: "خطأ",
          description: "فشل تحديث العنوان",
          variant: "destructive",
        })
      } else {
        toast({
          title: "تم التحديث",
          description: "تم تحديث العنوان بنجاح",
        })
        fetchAddresses()
        setDialogOpen(false)
        resetForm()
      }
    } else {
      // Create new address
      const { error } = await supabase.from("addresses").insert({
        ...formData,
        user_id: user.id,
      })

      if (error) {
        toast({
          title: "خطأ",
          description: "فشل إضافة العنوان",
          variant: "destructive",
        })
      } else {
        toast({
          title: "تم الإضافة",
          description: "تم إضافة العنوان بنجاح",
        })
        fetchAddresses()
        setDialogOpen(false)
        resetForm()
      }
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id)

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف العنوان",
        variant: "destructive",
      })
    } else {
      toast({
        title: "تم الحذف",
        description: "تم حذف العنوان بنجاح",
      })
      fetchAddresses()
    }
  }

  const resetForm = () => {
    setFormData({
      full_name: "",
      phone: "",
      email: "",
      country: "السعودية",
      city: "",
      address_line1: "",
      address_line2: "",
      postal_code: "",
      is_default: false,
      address_type: "billing",
    })
    setEditingAddress(null)
  }

  const openEditDialog = (address: Address) => {
    setEditingAddress(address)
    setFormData(address)
    setDialogOpen(true)
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-right">عنوان الفاتورة</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة عنوان جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-right">
                  {editingAddress ? "تعديل العنوان" : "إضافة عنوان جديد"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-right">
                    <Label htmlFor="full_name">الاسم الكامل *</Label>
                    <Input
                      id="full_name"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="text-right"
                    />
                  </div>
                  <div className="text-right">
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="text-right"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-right">
                    <Label htmlFor="country">الدولة *</Label>
                    <Input
                      id="country"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="text-right"
                    />
                  </div>
                  <div className="text-right">
                    <Label htmlFor="city">المدينة *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <Label htmlFor="address_line1">العنوان (سطر 1) *</Label>
                  <Input
                    id="address_line1"
                    required
                    value={formData.address_line1}
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    className="text-right"
                    placeholder="رقم المبنى، اسم الشارع"
                  />
                </div>

                <div className="text-right">
                  <Label htmlFor="address_line2">العنوان (سطر 2)</Label>
                  <Input
                    id="address_line2"
                    value={formData.address_line2}
                    onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                    className="text-right"
                    placeholder="رقم الشقة، الطابق (اختياري)"
                  />
                </div>

                <div className="text-right">
                  <Label htmlFor="postal_code">الرمز البريدي</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="text-right"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <Label htmlFor="is_default">تعيين كعنوان افتراضي</Label>
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">{editingAddress ? "تحديث" : "إضافة"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-gray-600 text-right mb-6">
          العناوين التالية سيتم استخدامها في صفحة إتمام الطلب بشكل افتراضي.
        </p>

        {addresses.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">لم تقم بإعداد هذا العنوان بعد.</p>
            <Button
              variant="link"
              onClick={() => {
                resetForm()
                setDialogOpen(true)
              }}
            >
              إضافة عنوان الفاتورة
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border rounded-lg p-4 relative"
              >
                {address.is_default && (
                  <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">افتراضي</span>
                )}
                <div className="text-right space-y-2">
                  <p className="font-semibold">{address.full_name}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-sm text-gray-600">{address.email}</p>
                  <p className="text-sm text-gray-600">
                    {address.address_line1}
                    {address.address_line2 && `, ${address.address_line2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.country}
                  </p>
                  {address.postal_code && <p className="text-sm text-gray-600">{address.postal_code}</p>}
                </div>
                <div className="flex gap-2 mt-4 justify-end">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(address)}>
                    <Edit className="w-4 h-4 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
