import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      items,
      total,
      customerName,
      customerEmail,
      customerPhone,
      customerWhatsapp,
      deliveryAddress,
      paymentMethod = "cash",
      paymentReceipt,
      notes,
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 })
    }

    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
      return NextResponse.json(
        {
          error: "Missing required customer information",
        },
        { status: 400 },
      )
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const taxRate = 15.0
    const tax = (subtotal * taxRate) / 100
    const totalAmount = subtotal + tax

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_whatsapp: customerWhatsapp || null,
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        receipt_url: paymentReceipt || null,
        subtotal: subtotal,
        tax: tax,
        tax_rate: taxRate,
        total: totalAmount,
        status: "new",
        notes: notes || null,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name_ar,
      product_image: item.image,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    })
  } catch (error) {
    console.error("Error in POST /api/orders/create:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
