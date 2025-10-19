export default function CategorySection() {
  const categories = [
    { name: "الرجال", icon: "👕" },
    { name: "الاطفال", icon: "🧢" },
    { name: "النساء", icon: "👜" },
  ]

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">تسوّق حسب الفئة</h2>
          <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
            المزيد
          </a>
        </div>

        {/* First Row */}
        <div className="grid grid-cols-3 gap-4 ">
          {categories.map((category, index) => (
            <button
              key={`row1-${index}`}
              className="flex flex-col items-center gap-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="text-4xl md:text-5xl">
                {index === 0 && (
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                    <path d="M12 11v6M9 14h6" />
                  </svg>
                )}
                {index === 1 && (
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                )}
                {index === 2 && (
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                )}
              </div>
              <span className="text-sm md:text-base font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <button
              key={`row2-${index}`}
              className="flex flex-col items-center gap-3 p-6 md:p-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors aspect-square"
            >
              <div className="text-4xl md:text-5xl">
                {index === 0 && (
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                )}
                {index === 1 && (
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                )}
                {index === 2 && (
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                    <path d="M12 11v6M9 14h6" />
                  </svg>
                )}
              </div>
              <span className="text-sm md:text-base font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
