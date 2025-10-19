import c1 from "@/public/imgs/cap.svg"
import c2 from "@/public/imgs/hand-bag-02.svg"
import c3 from "@/public/imgs/shirt-01.png"
import Image from "next/image"
export default function CategorySection() {
  const categories = [
    { name: "الاطفال", icon: c1 },
    { name: "النساء", icon: c2 },
    { name: "الرجال", icon: c3 },
    { name: "الاطفال", icon: c1 },
    { name: "النساء", icon: c2 },
    { name: "الرجال", icon: c3 },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "shirt":
        return (
          <svg
            className="w-10 h-10 md:w-12 md:h-12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
          </svg>
        )
      case "cap":
        return (
          <svg
            className="w-10 h-10 md:w-12 md:h-12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        )
      case "bag":
        return (
          <svg
            className="w-10 h-10 md:w-12 md:h-12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        )
      default:
        return null
    }
  }

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
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mb-4 md:mb-6">
          {categories.map((category, index) => (
            <button
              key={`row1-${index}`}
              className="flex flex-col items-center justify-center h-[100px] md:h-[120px] gap-2 md:gap-3 p-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors aspect-square"
            >
              <Image src={category.icon} alt="icon" className="p-2"/>
              <span className="text-sm md:text-base font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <button
              key={`row2-${index}`}
              className="flex flex-col items-center justify-center h-[100px] md:h-[120px] gap-2 md:gap-3 p-6 md:p-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors aspect-square"
            >
              <Image src={category.icon} alt="icon" className="p-2"/>
              <span className="text-sm md:text-base font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
