import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { Award, Users, Target, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">من نحن</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نحن متجر Accessory Mart، وجهتك المثالية للحصول على أفضل الإكسسوارات العصرية والأنيقة
            </p>
          </div>

          {/* Story Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
              <h2 className="text-3xl font-bold mb-6">قصتنا</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  بدأت رحلتنا في عام 2020 بحلم بسيط: توفير إكسسوارات عالية الجودة بأسعار معقولة للجميع. منذ ذلك الحين،
                  نمونا لنصبح واحدًا من أكثر المتاجر الإلكترونية موثوقية في المنطقة.
                </p>
                <p>
                  نؤمن بأن الإكسسوارات ليست مجرد منتجات، بل هي وسيلة للتعبير عن الذات وإضافة لمسة شخصية لإطلالتك
                  اليومية. لذلك، نحرص على انتقاء كل قطعة بعناية فائقة لضمان رضاك التام.
                </p>
                <p>
                  فريقنا المتخصص يعمل بلا كلل للبحث عن أحدث الصيحات والتصاميم العصرية من جميع أنحاء العالم، لنقدم لك
                  تشكيلة متنوعة تناسب جميع الأذواق والمناسبات.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">قيمنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">الجودة</h3>
                <p className="text-gray-600">نختار منتجاتنا بعناية لضمان أعلى معايير الجودة</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">العملاء أولاً</h3>
                <p className="text-gray-600">رضاك هو أولويتنا القصوى في كل ما نقوم به</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">الابتكار</h3>
                <p className="text-gray-600">نسعى دائماً لتقديم أحدث التصاميم والصيحات</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">الشغف</h3>
                <p className="text-gray-600">نحب ما نقوم به ونسعى للتميز في كل التفاصيل</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-gray-600">عميل سعيد</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600">منتج متنوع</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-600">علامة تجارية</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">99%</div>
                <div className="text-gray-600">رضا العملاء</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
