<template>
  <div class="layout-default">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">W</span>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">Wheel of Fortune</span>
            </NuxtLink>
          </div>

          <!-- Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              to="/" 
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
            >
              Home
            </NuxtLink>
            <NuxtLink 
              to="/demo" 
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
            >
              Demo
            </NuxtLink>
            <NuxtLink 
              to="/docs" 
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
            >
              Documentation
            </NuxtLink>
          </div>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <!-- Color mode toggle -->
            <button
              @click="toggleColorMode"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <Icon
                :name="colorMode.value === 'dark' ? 'heroicons:sun' : 'heroicons:moon'"
                class="w-5 h-5 text-gray-700 dark:text-gray-300"
              />
            </button>

            <!-- Mobile menu button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <Icon
                :name="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'"
                class="w-5 h-5 text-gray-700 dark:text-gray-300"
              />
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-show="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
            <NuxtLink 
              to="/" 
              class="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
              active-class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
              @click="mobileMenuOpen = false"
            >
              Home
            </NuxtLink>
            <NuxtLink 
              to="/demo" 
              class="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
              active-class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
              @click="mobileMenuOpen = false"
            >
              Demo
            </NuxtLink>
            <NuxtLink 
              to="/docs" 
              class="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
              active-class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
              @click="mobileMenuOpen = false"
            >
              Documentation
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand -->
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">W</span>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">Wheel of Fortune</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Interactive wheel of fortune with full SSR and SSG support, featuring smooth animations and customizable prizes.
            </p>
          </div>

          <!-- Quick links -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                  Home
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/demo" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                  Demo
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/docs" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                  Documentation
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Technology -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Technology
            </h3>
            <ul class="space-y-2">
              <li class="text-gray-600 dark:text-gray-400 text-sm">Vue 3 + TypeScript</li>
              <li class="text-gray-600 dark:text-gray-400 text-sm">Nuxt.js SSR/SSG</li>
              <li class="text-gray-600 dark:text-gray-400 text-sm">Pinia State Management</li>
              <li class="text-gray-600 dark:text-gray-400 text-sm">Tailwind CSS</li>
            </ul>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {{ new Date().getFullYear() }} Wheel of Fortune. Built with ❤️ using modern web technologies.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const mobileMenuOpen = ref(false)

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Close mobile menu on route change
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>