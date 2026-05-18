import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import KPISection from '@/components/landing/KPISection';
import Categories from '@/components/landing/Categories';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <KPISection />
      <Categories />
      <Features />
      <Footer />
    </main>
  );
}
