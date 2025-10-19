import type React from "react"
import type { Metadata } from "next"
import { Vazirmatn } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const vazirmatn = Vazirmatn({ subsets: ["arabic"] })

export const metadata: Metadata = {
  title: "Accessory Mart - متجر الاكسسوارات",
  description: "متجر الاكسسوارات - الأناقة في كل التفاصيل",
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${vazirmatn.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
