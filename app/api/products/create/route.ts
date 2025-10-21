import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Generate slug
    const slug =
      body.name_ar
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\u0600-\u06FFa-z0-9-]/g, "") +
      "-" +
      Date.now()

    // Insert product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert([
        {
          name_ar: body.name_ar,
          name_en: body.name_en || null,
          slug: slug,
          price: Number.parseFloat(body.price),
          stock_quantity: Number.parseInt(body.stock_quantity),
          category_id: body.category_id || null,
          description: body.description || null,
          sku: body.sku || null,
          is_available: body.is_available,
          is_featured: body.is_featured,
        },
      ])
      .select()
      .single()

    if (productError) {
      console.error("[v0] Product insert error:", productError)
      return NextResponse.json(
        {
          message: "فشل في إضافة المنتج. تأكد من تفعيل صلاحيات قاعدة البيانات (RLS Policies)",
          error: productError.message,
        },
        { status: 400 },
      )
    }

    // Insert images if any
    if (body.images && body.images.length > 0 && product) {
      const imageInserts = body.images.map((img: any) => ({
        product_id: product.id,
        image_url: img.url,
        display_order: img.display_order,
        is_primary: img.is_primary,
      }))

      const { error: imagesError } = await supabase.from("product_images").insert(imageInserts)

      if (imagesError) {
        console.error("[v0] Images insert error:", imagesError)
        // Product was created but images failed - still return success
      }
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ message: "حدث خطأ في الخادم", error: String(error) }, { status: 500 })
  }
}
