<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import '../assets/landing.css'
import LandingNav from '../components/landing/LandingNav.vue'
import HeroSection from '../components/landing/HeroSection.vue'
import ProblemSection from '../components/landing/ProblemSection.vue'
import SolutionSection from '../components/landing/SolutionSection.vue'
import FeaturesSection from '../components/landing/FeaturesSection.vue'
import HowItWorksSection from '../components/landing/HowItWorksSection.vue'
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection.vue'
import BenefitsSection from '../components/landing/BenefitsSection.vue'
import AcademicSection from '../components/landing/AcademicSection.vue'
import FinalCtaSection from '../components/landing/FinalCtaSection.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'

const root = ref(null)
let observer = null

// Scroll reveal: observa todos os elementos [data-reveal] da página
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  )

  root.value?.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="root" class="landing">
    <LandingNav />
    <main>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DashboardPreviewSection />
      <BenefitsSection />
      <AcademicSection />
      <FinalCtaSection />
    </main>
    <LandingFooter />
  </div>
</template>
