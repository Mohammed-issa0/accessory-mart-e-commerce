import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import PromoSection from "@/components/promo-section"
import CategorySection from "@/components/category-section"
import FeaturedProducts from "@/components/featured-products"
import FeaturesSection from "@/components/features-section"
import AppDownloadSection from "@/components/app-download-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <PromoSection />
      <CategorySection />
      <FeaturedProducts />
      <FeaturesSection />
      <AppDownloadSection />
      <Footer />
    </main>
  )
}
