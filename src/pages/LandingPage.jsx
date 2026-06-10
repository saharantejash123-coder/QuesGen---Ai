import AppNavbar from '../components/questra/AppNavbar'
import Footer from '../components/Footer'
import HeroSection from '../components/landing/HeroSection'
import ProblemSolution from '../components/landing/ProblemSolution'
import FeaturesSection from '../components/landing/FeaturesSection'
import PricingSection from '../components/landing/PricingSection'
import StatsSection from '../components/landing/StatsSection'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AppNavbar role="landing" />
      <main>
        <HeroSection />
        <StatsSection />
        <ProblemSolution />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
