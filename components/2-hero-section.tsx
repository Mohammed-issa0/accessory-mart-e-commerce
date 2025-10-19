"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import mainphoto from "@/public/imgs/mainphoto.png"
import main2 from "@/public/imgs/main2.jpg"
import main3 from "@/public/imgs/main3.jpg"
import Image from "next/image"
export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <section className="relative py-8 md:py-12 mt-[131px]">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 min-h-[500px] md:min-h-[600px]">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center" 
          >
            <Image src={mainphoto} alt="main Photo" className="w-full"/>

          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center min-h-[500px] md:min-h-[600px] px-6 md:px-12">
            <div className="text-center text-white max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">وصول تشكيلة الشتاء</h2>
              <p className="text-lg md:text-xl mb-8 text-gray-200 text-balance">
                اختاري من مجموعتنا المميزة من الاكسسوارات لتضيفي لمسة من الأناقة والثقة إلى كل يوم.
              </p>
              <Button
                size="lg"
                className="bg-white cursor-pointer text-black hover:bg-gray-100 text-base md:text-lg px-8 py-6 rounded-sm"
              >
                <ArrowRight className="ml-2 p-1 size-7 bg-black text-white rounded-sm" />
                استكشف المنتجات
                
              </Button>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            <button
              onClick={() => setCurrentSlide(0)}
              className={`w-2 h-2 rounded-full transition-all ${currentSlide === 0 ? "bg-white w-8" : "bg-white/50"}`}
              aria-label="Slide 1"
            />
            <button
              onClick={() => setCurrentSlide(1)}
              className={`w-2 h-2 rounded-full transition-all ${currentSlide === 1 ? "bg-white w-8" : "bg-white/50"}`}
              aria-label="Slide 2"
            />
            <button
              onClick={() => setCurrentSlide(2)}
              className={`w-2 h-2 rounded-full transition-all ${currentSlide === 2 ? "bg-white w-8" : "bg-white/50"}`}
              aria-label="Slide 3"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
