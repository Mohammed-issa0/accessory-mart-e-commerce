import type React from "react"
import type { Metadata } from "next"
import { Vazirmatn } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/context/cart-context"
import { WishlistProvider } from "@/lib/context/wishlist-context"
import { AuthProvider } from "@/lib/contexts/auth-context"

const vazirmatn = Vazirmatn({ subsets: ["arabic"] })

export const metadata: Metadata = {
  title: "Accessory Mart - متجر الاكسسوارات",
  description: "متجر الاكسسوارات - الأناقة في كل التفاصيل",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${vazirmatn.className} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
