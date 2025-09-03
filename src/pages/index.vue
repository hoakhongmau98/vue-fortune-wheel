<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Wheel of Fortune
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Interactive wheel of fortune with full SSR and SSG support, featuring smooth animations 
            and customizable prizes. Built with Vue 3, TypeScript, and Nuxt.js.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/demo" 
              class="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Demo
              <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
            </NuxtLink>
            <NuxtLink 
              to="/docs" 
              class="inline-flex items-center px-8 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 font-semibold rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              View Documentation
              <Icon name="heroicons:document-text" class="ml-2 w-5 h-5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Key Features
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="heroicons:server" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold mb-3">SSR & SSG Support</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Full server-side rendering and static site generation support for optimal performance and SEO.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="heroicons:cog" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Highly Customizable</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Customize colors, animations, prizes, and probabilities to match your brand and requirements.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="heroicons:accessibility" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Accessibility First</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Built with accessibility in mind, supporting screen readers, keyboard navigation, and reduced motion.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="heroicons:bolt" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Performance Optimized</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Optimized animations, code splitting, and lazy loading for smooth performance across all devices.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="heroicons:shield-check" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold mb-3">TypeScript Support</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Full TypeScript support with comprehensive type definitions for better development experience.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="heroicons:device-phone-mobile" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Responsive Design</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Fully responsive design that works perfectly on desktop, tablet, and mobile devices.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Demo Section -->
    <section class="demo-section py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Quick Demo
        </h2>
        <div class="flex justify-center">
          <div class="max-w-md">
            <FortuneWheel
              :prizes="demoPrizes"
              :canvas="demoCanvasConfig"
              @rotateEnd="onDemoRotateEnd"
              class="mx-auto"
            />
            <div class="text-center mt-6">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Click the button to spin the wheel and see it in action!
              </p>
              <div v-if="lastWonPrize" class="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                <p class="text-green-800 dark:text-green-200 font-semibold">
                  🎉 You won: {{ lastWonPrize.name || lastWonPrize.value }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technology Stack -->
    <section class="tech-section py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Built with Modern Technologies
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="tech-item">
            <div class="tech-icon">
              <Icon name="logos:vue" class="w-12 h-12" />
            </div>
            <h3 class="text-lg font-semibold mt-3">Vue 3</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">Composition API</p>
          </div>
          <div class="tech-item">
            <div class="tech-icon">
              <Icon name="logos:nuxt-icon" class="w-12 h-12" />
            </div>
            <h3 class="text-lg font-semibold mt-3">Nuxt.js</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">SSR & SSG</p>
          </div>
          <div class="tech-item">
            <div class="tech-icon">
              <Icon name="logos:typescript-icon" class="w-12 h-12" />
            </div>
            <h3 class="text-lg font-semibold mt-3">TypeScript</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">Type Safety</p>
          </div>
          <div class="tech-item">
            <div class="tech-icon">
              <Icon name="logos:tailwindcss-icon" class="w-12 h-12" />
            </div>
            <h3 class="text-lg font-semibold mt-3">Tailwind CSS</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">Utility First</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Get Started?
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Explore the full demo, read the documentation, and integrate the wheel of fortune into your project.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/demo" 
            class="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Explore Demo
            <Icon name="heroicons:play" class="ml-2 w-5 h-5" />
          </NuxtLink>
          <NuxtLink 
            to="/docs" 
            class="inline-flex items-center px-8 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 font-semibold rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            Read Docs
            <Icon name="heroicons:book-open" class="ml-2 w-5 h-5" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PrizeConfig, CanvasConfig } from '@/types/wheel'

// SEO
useHead({
  title: 'Wheel of Fortune - Interactive Lottery System',
  meta: [
    {
      name: 'description',
      content: 'Interactive wheel of fortune with SSR/SSG support, featuring smooth animations and customizable prizes. Built with Vue 3, TypeScript, and Nuxt.js.'
    }
  ]
})

// Demo data
const demoPrizes: PrizeConfig[] = [
  {
    id: 1,
    name: 'Blue Prize',
    value: 'Blue Prize Value',
    bgColor: '#45ace9',
    color: '#ffffff',
    probability: 30
  },
  {
    id: 2,
    name: 'Red Prize',
    value: 'Red Prize Value',
    bgColor: '#dd3832',
    color: '#ffffff',
    probability: 40
  },
  {
    id: 3,
    name: 'Yellow Prize',
    value: 'Yellow Prize Value',
    bgColor: '#fef151',
    color: '#000000',
    probability: 30
  }
]

const demoCanvasConfig: CanvasConfig = {
  radius: 200,
  btnWidth: 120,
  fontSize: 28,
  lineHeight: 24
}

const lastWonPrize = ref<PrizeConfig | null>(null)

function onDemoRotateEnd(prize: PrizeConfig) {
  lastWonPrize.value = prize
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, theme('colors.primary.50'), theme('colors.primary.100'));
  
  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, theme('colors.gray.900'), theme('colors.gray.800'));
  }
}

.feature-card {
  @apply bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow;
  
  .feature-icon {
    @apply w-12 h-12 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center mb-4;
  }
}

.tech-item {
  @apply text-center;
  
  .tech-icon {
    @apply flex justify-center items-center;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .feature-card {
    transition: none;
  }
}
</style>