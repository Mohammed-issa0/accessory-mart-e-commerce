"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import mainphoto from "@/public/imgs/mainphoto.png"
import main2 from "@/public/imgs/main2.jpg"
import main3 from "@/public/imgs/main3.jpg"
import wo2 from "@/public/imgs/wo2.jpg"
import wo3 from "@/public/imgs/wo3.jpg"
import Image from "next/image"
import Link from "next/link"
export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [main3, main2, wo2, wo3]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative py-8 md:py-12 mt-[131px]">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 min-h-[500px] md:min-h-[600px]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide || "/placeholder.svg"}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center min-h-[500px] md:min-h-[600px] px-6 md:px-12">
            <div className="text-center text-white max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">وصول تشكيلة الشتاء</h2>
              <p className="text-lg md:text-xl mb-8 text-gray-200 text-balance">
                اختاري من مجموعتنا المميزة من الاكسسوارات لتضيفي لمسة من الأناقة والثقة إلى كل يوم.
              </p>
              <Link href="/products">
              <Button
                size="lg"
                className="bg-white cursor-pointer text-black hover:bg-gray-100 text-base md:text-lg px-8 py-6 rounded-sm"
              >
                <ArrowRight className="ml-2 p-1 size-7 bg-black text-white rounded-sm" />
                استكشف المنتجات
              </Button>
              </Link>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? "bg-white w-8" : "bg-white/50 w-2"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
