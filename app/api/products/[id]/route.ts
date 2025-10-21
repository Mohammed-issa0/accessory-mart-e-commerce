import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const productId = params.id
    const body = await request.json()

    const { images, ...productData } = body

    // Update product
    const { error: productError } = await supabase
      .from("products")
      .update({
        name_ar: productData.name_ar,
        name_en: productData.name_en,
        slug: productData.slug,
        description: productData.description,
        price: Number.parseFloat(productData.price),
        stock_quantity: Number.parseInt(productData.stock_quantity),
        category_id: productData.category_id || null,
        is_available: productData.is_available,
        is_featured: productData.is_featured,
        sku: productData.sku,
      })
      .eq("id", productId)

    if (productError) {
      console.error("Error updating product:", productError)
      return NextResponse.json({ error: productError.message }, { status: 500 })
    }

    // Delete existing images
    await supabase.from("product_images").delete().eq("product_id", productId)

    // Insert new images
    if (images && images.length > 0) {
      const imageRecords = images.map((img: any) => ({
        product_id: productId,
        image_url: img.url,
        display_order: img.display_order,
        is_primary: img.is_primary,
      }))

      const { error: imagesError } = await supabase.from("product_images").insert(imageRecords)

      if (imagesError) {
        console.error("Error inserting images:", imagesError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in PUT /api/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const productId = params.id

    // Delete product images first (foreign key constraint)
    await supabase.from("product_images").delete().eq("product_id", productId)

    // Delete product colors
    await supabase.from("product_colors").delete().eq("product_id", productId)

    // Delete the product
    const { error } = await supabase.from("products").delete().eq("id", productId)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
