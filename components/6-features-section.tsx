export default function FeaturesSection() {
  const features = [
    {
      title: "ضمان الجودة",
      description: "منتجات أصلية 100%",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "دعم 24/7",
      description: "نحن هنا لخدمتك",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
    },
    {
      title: "شحن مجاني",
      description: "على جميع الطلبات",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: "تصاميم فريدة",
      description: "قطع محدودة الإصدار",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ]

  const DecorativeStar = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" />
    </svg>
  )

  return (
    <section className="py-12 md:py-16 bg-gray-50 relative overflow-hidden">
      <DecorativeStar className="absolute top-12 left-12 w-12 h-12 md:w-16 md:h-16 text-black opacity-100" />
      <DecorativeStar className="absolute top-8 left-32 w-6 h-6 md:w-8 md:h-8 text-black opacity-100" />
      <DecorativeStar className="absolute top-32 right-16 w-10 h-10 md:w-12 md:h-12 text-black opacity-100" />
      <DecorativeStar className="absolute top-16 right-48 w-8 h-8 md:w-10 md:h-10 text-black opacity-100" />
      <DecorativeStar className="absolute bottom-24 left-24 w-8 h-8 md:w-10 md:h-10 text-black opacity-100" />
      <DecorativeStar className="absolute bottom-32 right-32 w-6 h-6 md:w-8 md:h-8 text-black opacity-100" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">لأن كل تفصيلة تروي حكاية</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-right flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
                <div className="bg-black text-white rounded-2xl p-4 flex-shrink-0">{feature.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
