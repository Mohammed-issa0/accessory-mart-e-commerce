import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Fetch order with items
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items(*)
      `,
      )
      .eq("id", id)
      .single()

    if (error) throw error

    // Generate PDF invoice (simplified version)
    // In production, use a library like jsPDF or pdfkit
    const invoiceHTML = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>فاتورة ${order.order_number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .invoice-details { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: right; }
          th { background-color: #f5f5f5; }
          .total { font-size: 18px; font-weight: bold; text-align: left; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>فاتورة رقم ${order.order_number}</h1>
          <p>تاريخ: ${new Date(order.created_at).toLocaleDateString("ar-SA")}</p>
        </div>
        
        <div class="invoice-details">
          <p><strong>اسم العميل:</strong> ${order.customer_name}</p>
          <p><strong>البريد الإلكتروني:</strong> ${order.customer_email}</p>
          <p><strong>رقم الهاتف:</strong> ${order.customer_phone}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item: any) => `
              <tr>
                <td>${item.product_name}</td>
                <td>${item.quantity}</td>
                <td>${item.price} ريال</td>
                <td>${item.total} ريال</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="total">
          <p>المجموع الفرعي: ${order.subtotal} ريال</p>
          <p>الضريبة: ${order.tax} ريال</p>
          <p>المجموع الكلي: ${order.total} ريال</p>
        </div>
      </body>
      </html>
    `

    // Return HTML as PDF (in production, convert to actual PDF)
    return new NextResponse(invoiceHTML, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.order_number}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating invoice:", error)
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
  }
}
