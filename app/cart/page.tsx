"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  product_id: string
  quantity: number
  products: {
    id: string
    name: string
    price: number
    image_url: string
    stock_quantity: number
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }
    setUser(user)
    loadCart(user.id)
  }

  const loadCart = async (userId: string) => {
    const { data, error } = await supabase
      .from("cart")
      .select(`
        id,
        product_id,
        quantity,
        products (
          id,
          name,
          price,
          image_url,
          stock_quantity
        )
      `)
      .eq("user_id", userId)

    if (!error && data) {
      setCartItems(data as any)
    }
    setLoading(false)
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const { error } = await supabase.from("cart").update({ quantity: newQuantity }).eq("id", itemId)

    if (!error) {
      setCartItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = async (itemId: string) => {
    const { error } = await supabase.from("cart").delete().eq("id", itemId)

    if (!error) {
      setCartItems((items) => items.filter((item) => item.id !== itemId))
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.products.price * item.quantity
    }, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل السلة...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" dir="rtl">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">سلة التسوق فارغة</h2>
          <p className="text-muted-foreground">لم تقم بإضافة أي منتجات بعد</p>
          <Link href="/">
            <Button>تصفح المنتجات</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-card border rounded-lg p-4 flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.products.image_url || "/placeholder.svg?height=96&width=96"}
                    alt={item.products.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{item.products.name}</h3>
                  <p className="text-lg font-bold text-primary">{item.products.price} ريال</p>

                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.products.stock_quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                  <p className="font-bold text-lg">{(item.products.price * item.quantity).toFixed(2)} ريال</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-semibold">{calculateTotal().toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الضريبة (15%)</span>
                  <span className="font-semibold">{(calculateTotal() * 0.15).toFixed(2)} ريال</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>المجموع الكلي</span>
                  <span className="text-primary">{(calculateTotal() * 1.15).toFixed(2)} ريال</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                إتمام الطلب
              </Button>

              <Link href="/">
                <Button variant="outline" className="w-full mt-3 bg-transparent">
                  متابعة التسوق
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
