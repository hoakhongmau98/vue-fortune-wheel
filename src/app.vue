<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Auto-imported by Nuxt
useHead({
  title: 'Wheel of Fortune - Interactive Lottery System',
  meta: [
    { name: 'description', content: 'Interactive wheel of fortune with SSR/SSG support, featuring smooth animations and customizable prizes.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap', rel: 'stylesheet' }
  ]
})

// Initialize color mode
const colorMode = useColorMode()
colorMode.preference = 'system'
</script>

<style lang="scss">
@import '@/assets/styles/main.scss';

// Global styles for SSR/SSG compatibility
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// Ensure proper hydration
#__nuxt {
  min-height: 100vh;
}

// Accessibility improvements
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Focus styles for better accessibility
*:focus {
  outline: 2px solid theme('colors.primary.500');
  outline-offset: 2px;
}

// Dark mode transitions
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
</style>