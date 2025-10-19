export default function PromoSection() {
  return (
    <section className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-[100px] md:gap-[140px]">
          {/* Promo Code */}
          <div className="bg-black text-white px-8 py-3 rounded-lg text-center">
            <span className="text-lg md:text-xl font-bold">الرمز: SAO</span>
          </div>

          {/* Discount Tiers */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {/* 15% */}
            <div className="relative text-center"> 
              <div className="absolute rotate-90 -right-[18px] font-bold text-gray-600">خصم</div>
              <div className="text-3xl md:text-4xl font-bold mb-1">%15</div>
              <div className="text-sm font-bold text-gray-600">للطلبات +$399</div>
            </div>

            <div className="hidden md:block w-px h-16 bg-gray-300" />

            {/* 16% */}
            <div className="text-center relative">
              <div className="absolute rotate-90 -right-[18px] font-bold text-gray-600">خصم</div>
              <div className="text-3xl md:text-4xl font-bold mb-1">%16</div>
              <div className="text-sm font-bold text-gray-600">للطلبات +$999</div>
            </div>

            <div className="hidden md:block w-px h-16 bg-gray-300" />

            {/* 18% */}
            <div className="text-center relative">
              <div className="absolute rotate-90 -right-[18px] font-bold text-gray-600">خصم</div>
              <div className="text-3xl md:text-4xl font-bold mb-1">%18</div>
              <div className="text-sm font-bold text-gray-600">للطلبات +$1800</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
