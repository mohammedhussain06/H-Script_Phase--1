import React from 'react'
import HeroSection       from './HeroSection.jsx'
import FeaturesSection   from './FeaturesSection.jsx'
import CodePreviewSection from './CodePreviewSection.jsx'
import HowItWorksSection from './HowItWorksSection.jsx'
import Footer            from './Footer.jsx'
import './Landing.css'

export default function Landing() {
  return (
    <main className="landing" id="landing-page">
      <HeroSection />
      <FeaturesSection />
      <CodePreviewSection />
      <HowItWorksSection />
      <Footer />
    </main>
  )
}
