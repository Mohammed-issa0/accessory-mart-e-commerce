import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { Newspaper } from "lucide-react"

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Newspaper className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">المدونة</h1>
            <p className="text-xl text-gray-600 mb-8">
              نعمل حالياً على إطلاق مدونتنا التي ستحتوي على أحدث صيحات الموضة، نصائح التنسيق، ومراجعات المنتجات
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full font-medium">
              قريباً...
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
