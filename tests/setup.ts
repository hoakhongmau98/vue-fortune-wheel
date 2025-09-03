import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock Nuxt composables
vi.mock('#app', () => ({
  useHead: vi.fn(),
  useRoute: vi.fn(() => ({ path: '/' })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn()
  })),
  navigateTo: vi.fn(),
  abortNavigation: vi.fn(),
  addRouteMiddleware: vi.fn(),
  defineNuxtRouteMiddleware: vi.fn(),
  useError: vi.fn(() => ({
    error: ref(null),
    clearError: vi.fn()
  })),
  throwError: vi.fn(),
  clearError: vi.fn(),
  showError: vi.fn(),
  clearNuxtData: vi.fn(),
  refreshNuxtData: vi.fn(),
  preloadRouteComponents: vi.fn(),
  prefetchComponents: vi.fn(),
  loadPayload: vi.fn(),
  preloadPayload: vi.fn(),
  isPrerendered: false,
  isHydrating: false,
  isClient: true,
  isServer: false,
  useSSR: vi.fn(() => ({
    isClient: true,
    isServer: false
  })),
  onBeforeRouteLeave: vi.fn(),
  onBeforeRouteUpdate: vi.fn(),
  setPageLayout: vi.fn(),
  useLazyFetch: vi.fn(),
  useLazyAsyncData: vi.fn(),
  useAsyncData: vi.fn(),
  useFetch: vi.fn(),
  $fetch: vi.fn(),
  $fetchRaw: vi.fn(),
  clearNuxtData: vi.fn(),
  refreshNuxtData: vi.fn(),
  preloadRouteComponents: vi.fn(),
  prefetchComponents: vi.fn(),
  loadPayload: vi.fn(),
  preloadPayload: vi.fn(),
  isPrerendered: false,
  isHydrating: false,
  isClient: true,
  isServer: false,
  useSSR: vi.fn(() => ({
    isClient: true,
    isServer: false
  })),
  onBeforeRouteLeave: vi.fn(),
  onBeforeRouteUpdate: vi.fn(),
  setPageLayout: vi.fn(),
  useLazyFetch: vi.fn(),
  useLazyAsyncData: vi.fn(),
  useAsyncData: vi.fn(),
  useFetch: vi.fn(),
  $fetch: vi.fn(),
  $fetchRaw: vi.fn()
}))

// Mock Nuxt modules
vi.mock('@nuxtjs/color-mode', () => ({
  useColorMode: vi.fn(() => ({
    value: ref('light'),
    preference: ref('system'),
    force: vi.fn()
  }))
}))

vi.mock('@pinia/nuxt', () => ({
  defineNuxtPlugin: vi.fn()
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 0))
global.cancelAnimationFrame = vi.fn()

// Mock canvas context
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Array(4) })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
}))

// Mock canvas toDataURL
HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock')

// Configure Vue Test Utils
config.global.stubs = {
  NuxtLink: {
    template: '<a :href="to"><slot /></a>',
    props: ['to']
  },
  NuxtPage: {
    template: '<div><slot /></div>'
  },
  NuxtLayout: {
    template: '<div><slot /></div>'
  },
  Icon: {
    template: '<span class="icon"><slot /></span>',
    props: ['name']
  }
}

// Global test utilities
global.testUtils = {
  // Helper to create mock prizes
  createMockPrizes: (count = 3) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Prize ${i + 1}`,
      value: `Prize ${i + 1} Value`,
      bgColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      color: '#ffffff',
      probability: Math.round(100 / count),
      weight: Math.round(10 / count)
    }))
  },

  // Helper to wait for animations
  waitForAnimation: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),

  // Helper to mock wheel rotation
  mockWheelRotation: () => {
    return {
      isRotating: ref(false),
      rotateEndDeg: ref(0),
      currentPrize: ref(null),
      startRotation: vi.fn(),
      endRotation: vi.fn(),
      getTargetAngle: vi.fn(() => 0)
    }
  }
}

// Test environment setup
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
  
  // Reset DOM
  document.body.innerHTML = ''
  
  // Reset canvas mocks
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Array(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Array(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  }))
})

afterEach(() => {
  // Clean up after each test
  vi.clearAllTimers()
})