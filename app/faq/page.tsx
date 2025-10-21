"use client"

import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "كيف يمكنني تتبع طلبي؟",
      answer:
        "بعد إتمام عملية الشراء، ستتلقى رسالة تأكيد عبر البريد الإلكتروني تحتوي على رقم تتبع الشحنة. يمكنك استخدام هذا الرقم لتتبع طلبك من خلال صفحة 'طلباتي' في حسابك أو من خلال موقع شركة الشحن مباشرة.",
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer:
        "نوفر عدة طرق دفع آمنة ومريحة: الدفع عند الاستلام، البطاقات الائتمانية (فيزا، ماستركارد)، مدى، Apple Pay، والتحويل البنكي. جميع المعاملات محمية بأحدث تقنيات التشفير.",
    },
    {
      question: "كم تستغرق مدة التوصيل؟",
      answer:
        "عادةً ما يستغرق التوصيل من 2-5 أيام عمل داخل المملكة العربية السعودية. للمناطق النائية قد تستغرق المدة حتى 7 أيام. نوفر أيضاً خدمة التوصيل السريع خلال 24 ساعة في المدن الرئيسية.",
    },
    {
      question: "ما هي سياسة الاسترجاع والاستبدال؟",
      answer:
        "يمكنك إرجاع أو استبدال المنتجات خلال 14 يوماً من تاريخ الاستلام، بشرط أن تكون المنتجات في حالتها الأصلية مع العبوة والملحقات. نتحمل تكاليف الشحن في حالة وجود عيب في المنتج.",
    },
    {
      question: "هل المنتجات أصلية ومضمونة؟",
      answer:
        "نعم، جميع منتجاتنا أصلية 100% ومستوردة من موردين معتمدين. نقدم ضماناً على جميع المنتجات حسب نوع المنتج، ونوفر شهادات الأصالة عند الطلب.",
    },
    {
      question: "كيف يمكنني إلغاء طلبي؟",
      answer:
        "يمكنك إلغاء طلبك مجاناً قبل شحنه من خلال صفحة 'طلباتي' أو بالتواصل مع خدمة العملاء. بعد الشحن، يمكنك رفض استلام الطلب أو إرجاعه حسب سياسة الاسترجاع.",
    },
    {
      question: "هل تقدمون خدمة التغليف كهدية؟",
      answer:
        "نعم، نوفر خدمة التغليف الفاخر للهدايا مجاناً. يمكنك اختيار هذه الخدمة عند إتمام الطلب، وسنضيف بطاقة تهنئة مخصصة برسالتك.",
    },
    {
      question: "كيف أحصل على كود خصم؟",
      answer:
        "يمكنك الحصول على أكواد الخصم من خلال الاشتراك في نشرتنا البريدية، متابعة حساباتنا على وسائل التواصل الاجتماعي، أو خلال العروض الموسمية والمناسبات الخاصة.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">الأسئلة الشائعة</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              إجابات على الأسئلة الأكثر شيوعاً حول منتجاتنا وخدماتنا
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 text-right flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-lg">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-5">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">لم تجد إجابة لسؤالك؟</h2>
            <p className="text-gray-600 mb-6">فريق خدمة العملاء لدينا جاهز لمساعدتك</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                تواصل معنا
              </a>
              <a
                href="tel:+966501234567"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
