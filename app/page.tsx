import Header from "@/components/1-header"
import HeroSection from "@/components/2-hero-section"
import PromoSection from "@/components/3-promo-section"
import CategorySection from "@/components/4-category-section"
import FeaturedProducts from "@/components/5-featured-products"
import NewProductsSection from "@/components/new-products-section"
import FeaturesSection from "@/components/6-features-section"
import AppDownloadSection from "@/components/7-app-download-section"
import Footer from "@/components/8-footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <PromoSection />
      <CategorySection />
      <NewProductsSection />
      <FeaturedProducts />
      <FeaturesSection />
      <AppDownloadSection />
      <Footer />
    </main>
  )
}
