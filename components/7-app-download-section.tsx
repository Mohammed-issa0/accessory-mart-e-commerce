import { Button } from "@/components/ui/button"
import apple from "@/public/imgs/apple (1).png"
import Image from "next/image"
import phone1 from "@/public/imgs/phone (1).png"
export default function AppDownloadSection() {
  return (
    <section className="py-12 md:py-16 ">
      <div className="container mx-auto px-4">
        <div className="bg-gray-200 rounded-3xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            

            {/* Right: Content */}
            <div className="p-8 md:p-12 text-right">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                قم بتحميل تطبيقنا قريبًا على App Store و Google Play
              </h2>
              <p className="text-gray-600 mb-8 text-lg">تسوق بسهولة في أي وقت وفي أي مكان.</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 rounded-2xl px-8 py-6 text-base">
                  <Image src={apple} className="ml-2 h-6 w-6"/>
                  App Store
                </Button>
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 rounded-2xl px-8 py-6 text-base">
                  <svg className="ml-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>

            {/* Left: Phone Mockups */}
            <div className="relative h-[400px] md:h-[500px] flex items-center justify-center p-8">
              <Image
                src={phone1}
                alt="App Preview"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
