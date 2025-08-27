<template>
  <div class="demo-page">
    <!-- Header -->
    <section class="demo-header py-8 bg-gradient-to-r from-primary-600 to-primary-700">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-white text-center mb-4">
          Wheel of Fortune Demo
        </h1>
        <p class="text-xl text-primary-100 text-center max-w-2xl mx-auto">
          Explore different configurations and see the wheel in action with various prize setups and animations.
        </p>
      </div>
    </section>

    <!-- Demo Controls -->
    <section class="demo-controls py-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                v-model="enableVerification"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Verification</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                v-model="useWeight"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Use Weight Mode</span>
            </label>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="resetAll"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Reset All
            </button>
            <button 
              @click="exportResults"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Export Results
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Wheels -->
    <section class="demo-wheels py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Canvas Wheel -->
          <div class="demo-wheel-section">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Canvas Wheel</h2>
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
              <FortuneWheel
                :prizes="canvasPrizes"
                :canvas="canvasConfig"
                :verify="enableVerification"
                :useWeight="useWeight"
                @rotateStart="onCanvasRotateStart"
                @rotateEnd="onCanvasRotateEnd"
                class="mx-auto"
              />
              
              <!-- Prize Controls -->
              <div class="mt-6">
                <h3 class="text-lg font-semibold mb-3">Prize Controls</h3>
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    v-for="prize in canvasPrizes" 
                    :key="prize.id"
                    @click="selectPrize(prize.id)"
                    :style="{ backgroundColor: prize.bgColor, color: prize.color }"
                    class="px-3 py-2 rounded text-sm font-medium hover:opacity-80 transition-opacity"
                  >
                    {{ prize.name }}
                  </button>
                </div>
              </div>

              <!-- Results -->
              <div class="mt-6">
                <h3 class="text-lg font-semibold mb-3">Results</h3>
                <div v-if="canvasResults.length > 0" class="space-y-2">
                  <div 
                    v-for="result in canvasResults.slice(0, 5)" 
                    :key="result.id"
                    class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded"
                  >
                    <span class="text-sm">{{ result.prize.name }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTime(result.timestamp) }}
                    </span>
                  </div>
                </div>
                <p v-else class="text-gray-500 dark:text-gray-400 text-sm">
                  No spins yet. Click the button to start!
                </p>
              </div>
            </div>
          </div>

          <!-- Image Wheel -->
          <div class="demo-wheel-section">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Image Wheel</h2>
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
              <FortuneWheel
                type="image"
                :prizes="imagePrizes"
                :useWeight="useWeight"
                :verify="enableVerification"
                :angleBase="-2"
                @rotateStart="onImageRotateStart"
                @rotateEnd="onImageRotateEnd"
                class="mx-auto"
              >
                <template #wheel>
                  <div class="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    🎰
                  </div>
                </template>
                <template #button>
                  <div class="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    SPIN
                  </div>
                </template>
              </FortuneWheel>

              <!-- Prize Controls -->
              <div class="mt-6">
                <h3 class="text-lg font-semibold mb-3">Prize Controls</h3>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    v-for="prize in imagePrizes" 
                    :key="prize.id"
                    @click="selectImagePrize(prize.id)"
                    class="px-3 py-2 rounded text-sm font-medium bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    {{ prize.value }}
                  </button>
                </div>
              </div>

              <!-- Results -->
              <div class="mt-6">
                <h3 class="text-lg font-semibold mb-3">Results</h3>
                <div v-if="imageResults.length > 0" class="space-y-2">
                  <div 
                    v-for="result in imageResults.slice(0, 5)" 
                    :key="result.id"
                    class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded"
                  >
                    <span class="text-sm">{{ result.prize.value }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTime(result.timestamp) }}
                    </span>
                  </div>
                </div>
                <p v-else class="text-gray-500 dark:text-gray-400 text-sm">
                  No spins yet. Click the button to start!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics -->
    <section class="demo-stats py-12 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Statistics
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="stat-card">
            <div class="stat-icon">
              <Icon name="heroicons:chart-bar" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Total Spins</h3>
            <p class="text-3xl font-bold text-primary-600">{{ totalSpins }}</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <Icon name="heroicons:trophy" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Unique Prizes</h3>
            <p class="text-3xl font-bold text-primary-600">{{ uniquePrizes }}</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <Icon name="heroicons:clock" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Session Time</h3>
            <p class="text-3xl font-bold text-primary-600">{{ sessionTime }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Configuration Panel -->
    <section class="config-panel py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Configuration
        </h2>
        <div class="max-w-4xl mx-auto bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Canvas Configuration -->
            <div>
              <h3 class="text-xl font-semibold mb-4">Canvas Configuration</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Radius</label>
                  <input 
                    v-model.number="canvasConfig.radius"
                    type="range" 
                    min="150" 
                    max="350" 
                    step="10"
                    class="w-full"
                  >
                  <span class="text-sm text-gray-500">{{ canvasConfig.radius }}px</span>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">Button Width</label>
                  <input 
                    v-model.number="canvasConfig.btnWidth"
                    type="range" 
                    min="80" 
                    max="200" 
                    step="10"
                    class="w-full"
                  >
                  <span class="text-sm text-gray-500">{{ canvasConfig.btnWidth }}px</span>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">Font Size</label>
                  <input 
                    v-model.number="canvasConfig.fontSize"
                    type="range" 
                    min="20" 
                    max="50" 
                    step="2"
                    class="w-full"
                  >
                  <span class="text-sm text-gray-500">{{ canvasConfig.fontSize }}px</span>
                </div>
              </div>
            </div>

            <!-- Prize Configuration -->
            <div>
              <h3 class="text-xl font-semibold mb-4">Prize Configuration</h3>
              <div class="space-y-4">
                <div v-for="(prize, index) in canvasPrizes" :key="prize.id" class="border rounded p-3">
                  <h4 class="font-medium mb-2">{{ prize.name }}</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-xs text-gray-500">Probability</label>
                      <input 
                        v-model.number="prize.probability"
                        type="number" 
                        min="0" 
                        max="100"
                        class="w-full px-2 py-1 text-sm border rounded"
                      >
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500">Weight</label>
                      <input 
                        v-model.number="prize.weight"
                        type="number" 
                        min="0"
                        class="w-full px-2 py-1 text-sm border rounded"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PrizeConfig, CanvasConfig } from '@/types/wheel'

// SEO
useHead({
  title: 'Demo - Wheel of Fortune',
  meta: [
    {
      name: 'description',
      content: 'Interactive demo of the wheel of fortune component with various configurations and real-time statistics.'
    }
  ]
})

// Demo state
const enableVerification = ref(false)
const useWeight = ref(false)
const selectedPrizeId = ref(0)

// Canvas wheel data
const canvasPrizes = ref<PrizeConfig[]>([
  {
    id: 1,
    name: 'Blue',
    value: 'Blue Prize',
    bgColor: '#45ace9',
    color: '#ffffff',
    probability: 30,
    weight: 3
  },
  {
    id: 2,
    name: 'Red',
    value: 'Red Prize',
    bgColor: '#dd3832',
    color: '#ffffff',
    probability: 40,
    weight: 4
  },
  {
    id: 3,
    name: 'Yellow',
    value: 'Yellow Prize',
    bgColor: '#fef151',
    color: '#000000',
    probability: 30,
    weight: 3
  }
])

// Image wheel data
const imagePrizes = ref<PrizeConfig[]>([
  {
    id: 1,
    value: 'Grand Prize',
    weight: 1
  },
  {
    id: 2,
    value: 'Runner Up',
    weight: 2
  },
  {
    id: 3,
    value: 'Consolation',
    weight: 7
  }
])

// Canvas configuration
const canvasConfig = ref<CanvasConfig>({
  radius: 250,
  btnWidth: 140,
  fontSize: 34,
  lineHeight: 30,
  borderColor: '#584b43',
  borderWidth: 6
})

// Results tracking
const canvasResults = ref<Array<{ id: number; prize: PrizeConfig; timestamp: string }>>([])
const imageResults = ref<Array<{ id: number; prize: PrizeConfig; timestamp: string }>>([])
const sessionStartTime = ref(Date.now())

// Computed properties
const totalSpins = computed(() => canvasResults.value.length + imageResults.value.length)

const uniquePrizes = computed(() => {
  const allPrizes = [...canvasResults.value, ...imageResults.value]
  const uniqueIds = new Set(allPrizes.map(result => result.prize.id))
  return uniqueIds.size
})

const sessionTime = computed(() => {
  const elapsed = Date.now() - sessionStartTime.value
  const minutes = Math.floor(elapsed / 60000)
  const seconds = Math.floor((elapsed % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// Methods
function onCanvasRotateStart(callback?: () => void) {
  if (enableVerification.value) {
    // Simulate verification
    setTimeout(() => {
      if (callback) callback()
    }, 2000)
  }
}

function onCanvasRotateEnd(prize: PrizeConfig) {
  canvasResults.value.unshift({
    id: Date.now(),
    prize,
    timestamp: new Date().toISOString()
  })
}

function onImageRotateStart(callback?: () => void) {
  if (enableVerification.value) {
    // Simulate verification
    setTimeout(() => {
      if (callback) callback()
    }, 2000)
  }
}

function onImageRotateEnd(prize: PrizeConfig) {
  imageResults.value.unshift({
    id: Date.now(),
    prize,
    timestamp: new Date().toISOString()
  })
}

function selectPrize(prizeId: number) {
  selectedPrizeId.value = prizeId
}

function selectImagePrize(prizeId: number) {
  selectedPrizeId.value = prizeId
}

function resetAll() {
  canvasResults.value = []
  imageResults.value = []
  sessionStartTime.value = Date.now()
}

function exportResults() {
  const data = {
    canvasResults: canvasResults.value,
    imageResults: imageResults.value,
    statistics: {
      totalSpins: totalSpins.value,
      uniquePrizes: uniquePrizes.value,
      sessionTime: sessionTime.value
    },
    timestamp: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `wheel-results-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString()
}
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
}

.stat-card {
  @apply bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm text-center;
  
  .stat-icon {
    @apply w-12 h-12 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center mx-auto mb-4;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .stat-card {
    transition: none;
  }
}
</style>