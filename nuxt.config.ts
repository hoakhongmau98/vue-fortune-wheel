// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Enable SSR by default, can be overridden for SSG
  ssr: true,
  
  // Development tools
  devtools: { enabled: true },
  
  // CSS and styling
  css: [
    '~/assets/styles/main.scss',
    '~/assets/styles/bootstrap-grid.min.css'
  ],
  
  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/test-utils/module'
  ],
  
  // Pinia configuration
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate']
  },
  
  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: '~/assets/styles/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true
  },
  
  // Color mode configuration
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  
  // Runtime config for environment variables
  runtimeConfig: {
    // Server-side only
    apiSecret: process.env.API_SECRET,
    
    // Public keys that are exposed to the client
    public: {
      apiBase: process.env.API_BASE || '/api',
      appName: 'Wheel of Fortune',
      version: '3.0.0'
    }
  },
  
  // Nitro server configuration
  nitro: {
    // API routes
    routeRules: {
      '/api/**': { cors: true },
      '/static/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
    },
    
    // Storage configuration
    storage: {
      redis: {
        driver: 'redis',
        /* redis connection options */
      }
    }
  },
  
  // Vite configuration for build optimization
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'fortune-wheel': ['./components/FortuneWheel/index.vue'],
            'vendor': ['vue', 'pinia']
          }
        }
      }
    },
    
    // CSS optimization
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/variables.scss";'
        }
      }
    }
  },
  
  // App configuration
  app: {
    head: {
      title: 'Wheel of Fortune - Interactive Lottery System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Interactive wheel of fortune with SSR/SSG support, featuring smooth animations and customizable prizes.' 
        },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Experimental features
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true
  },
  
  // Source directory
  srcDir: 'src',
  
  // Auto-imports
  imports: {
    dirs: ['composables/**', 'utils/**']
  }
})