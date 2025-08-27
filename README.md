
# Wheel of Fortune - SSR/SSG System

A robust, scalable wheel of fortune system built with Vue 3, TypeScript, and Nuxt.js, featuring full Server-Side Rendering (SSR) and Static Site Generation (SSG) support.

## 🚀 Features

- **Full SSR/SSG Support**: Optimized for both server-side rendering and static site generation
- **Vue 3 + TypeScript**: Modern development with type safety
- **Pinia State Management**: Reactive state management with SSR compatibility
- **Accessibility First**: WCAG compliant with screen reader support and keyboard navigation
- **Performance Optimized**: Code splitting, lazy loading, and optimized animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic theme switching with system preference detection
- **Comprehensive Testing**: Unit, integration, and end-to-end tests
- **API Integration**: Backend API endpoints for dynamic data handling

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/wheel-of-fortune-ssr.git
cd wheel-of-fortune-ssr

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# API Configuration
API_BASE=/api
API_SECRET=your-secret-key

# Build Configuration
NODE_ENV=development
NITRO_PRESET=node-server

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
```

## 🚀 Quick Start

### Development Mode

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Static Site Generation

```bash
# Generate static site
npm run generate

# Preview static site
npm run preview
```

## 📖 Usage

### Basic Implementation

```vue
<template>
  <div>
    <FortuneWheel
      :prizes="prizes"
      :canvas="canvasConfig"
      @rotateEnd="onRotateEnd"
    />
  </div>
</template>

<script setup lang="ts">
import type { PrizeConfig, CanvasConfig } from '@/types/wheel'

const prizes: PrizeConfig[] = [
  {
    id: 1,
    name: 'Grand Prize',
    value: 'Grand Prize Value',
    bgColor: '#FFD700',
    color: '#000000',
    probability: 10
  },
  {
    id: 2,
    name: 'Second Prize',
    value: 'Second Prize Value',
    bgColor: '#C0C0C0',
    color: '#000000',
    probability: 20
  },
  {
    id: 3,
    name: 'Consolation',
    value: 'Consolation Prize',
    bgColor: '#45ace9',
    color: '#FFFFFF',
    probability: 70
  }
]

const canvasConfig: CanvasConfig = {
  radius: 250,
  btnWidth: 140,
  fontSize: 34,
  borderColor: '#584b43',
  borderWidth: 6
}

function onRotateEnd(prize: PrizeConfig) {
  console.log('You won:', prize.name)
}
</script>
```

### Advanced Configuration

```vue
<template>
  <FortuneWheel
    type="image"
    :prizes="imagePrizes"
    :useWeight="true"
    :verify="true"
    :duration="8000"
    :angleBase="-3"
    @rotateStart="onRotateStart"
    @rotateEnd="onRotateEnd"
  >
    <template #wheel>
      <img src="/wheel-image.png" alt="Wheel" />
    </template>
    <template #button>
      <img src="/spin-button.png" alt="Spin" />
    </template>
  </FortuneWheel>
</template>

<script setup lang="ts">
const imagePrizes = [
  { id: 1, value: 'Grand Prize', weight: 1 },
  { id: 2, value: 'Runner Up', weight: 3 },
  { id: 3, value: 'Consolation', weight: 6 }
]

function onRotateStart(callback?: () => void) {
  // Simulate API verification
  setTimeout(() => {
    if (callback) callback()
  }, 2000)
}

function onRotateEnd(prize: PrizeConfig) {
  // Handle prize result
}
</script>
```

### Using Pinia Store

```vue
<template>
  <div>
    <FortuneWheel
      :prizes="wheelStore.prizes"
      :canvas="wheelStore.canvasConfig"
      @rotateEnd="wheelStore.endRotation"
    />
    
    <div class="statistics">
      <p>Total Spins: {{ wheelStore.statistics.totalSpins }}</p>
      <p>Current Prize: {{ wheelStore.currentPrize?.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWheelStore } from '@/stores/wheel'

const wheelStore = useWheelStore()

// Initialize prizes
wheelStore.initializePrizes([
  // ... prize configuration
])
</script>
```

## 🔌 API Documentation

### Prize Endpoints

#### GET /api/prizes

Fetch available prizes with pagination.

**Query Parameters:**
- `limit` (number): Number of prizes to return (default: 10)
- `offset` (number): Number of prizes to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "prizes": [
      {
        "id": 1,
        "name": "Grand Prize",
        "value": "Grand Prize Value",
        "bgColor": "#FFD700",
        "color": "#000000",
        "probability": 10,
        "weight": 1
      }
    ],
    "total": 4,
    "limit": 10,
    "offset": 0
  }
}
```

#### POST /api/spin

Process a wheel spin and return the winning prize.

**Request Body:**
```json
{
  "prizes": [
    {
      "id": 1,
      "probability": 30
    }
  ],
  "useWeight": false,
  "prizeId": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prize": {
      "id": 1,
      "name": "Grand Prize",
      "value": "Grand Prize Value"
    },
    "spinId": "spin-abc123",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "metadata": {
      "totalPrizes": 3,
      "useWeight": false,
      "totalProbability": 100
    }
  }
}
```

## ⚙️ Configuration

### Nuxt Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // Enable SSR
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      apiBase: process.env.API_BASE || '/api'
    }
  }
})
```

### Wheel Configuration

```typescript
interface CanvasConfig {
  radius?: number;           // Wheel radius (default: 250)
  textRadius?: number;       // Text distance from center (default: 190)
  textLength?: number;       // Characters per line (default: 6)
  textDirection?: 'horizontal' | 'vertical'; // Text direction
  lineHeight?: number;       // Line height (default: 20)
  borderWidth?: number;      // Border width (default: 0)
  borderColor?: string;      // Border color (default: transparent)
  btnText?: string;          // Button text (default: 'SPIN')
  btnWidth?: number;         // Button width (default: 140)
  fontSize?: number;         // Font size (default: 34)
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test -- --coverage

# Run end-to-end tests
npm run test:e2e

# Run end-to-end tests in development mode
npm run test:e2e:dev
```

### Test Structure

```
tests/
├── unit/           # Unit tests for components and utilities
├── integration/    # Integration tests for API and store
└── e2e/           # End-to-end tests with Cypress
```

### Example Test

```typescript
// tests/unit/FortuneWheel.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FortuneWheel from '@/components/FortuneWheel/index.vue'

describe('FortuneWheel', () => {
  it('renders correctly with prizes', () => {
    const prizes = testUtils.createMockPrizes(3)
    const wrapper = mount(FortuneWheel, {
      props: { prizes }
    })
    
    expect(wrapper.find('.fortune-wheel-container').exists()).toBe(true)
    expect(wrapper.find('.wheel-button').exists()).toBe(true)
  })

  it('emits rotateEnd event when spinning completes', async () => {
    const prizes = testUtils.createMockPrizes(3)
    const wrapper = mount(FortuneWheel, {
      props: { prizes }
    })
    
    await wrapper.find('.wheel-button').trigger('click')
    await testUtils.waitForAnimation(6500) // Wait for animation
    
    expect(wrapper.emitted('rotateEnd')).toBeTruthy()
  })
})
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

2. **Environment Variables:**
   ```env
   NODE_ENV=production
   API_SECRET=your-production-secret
   ```

### Netlify Deployment

1. **Build Command:**
   ```bash
   npm run generate
   ```

2. **Publish Directory:**
   ```
   .output/public
   ```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t wheel-of-fortune .
docker run -p 3000:3000 wheel-of-fortune
```

## 📊 Performance

### Performance Metrics

- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 2s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Features

- **Code Splitting**: Automatic chunk splitting for optimal loading
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Automatic image optimization and WebP conversion
- **Caching**: Aggressive caching strategies for static assets
- **Compression**: Gzip/Brotli compression for all assets

### Performance Monitoring

```typescript
// Performance monitoring setup
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Monitor Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  }
})
```

## ♿ Accessibility

### WCAG 2.1 AA Compliance

- **Screen Reader Support**: Full ARIA labels and descriptions
- **Keyboard Navigation**: Complete keyboard accessibility
- **High Contrast Mode**: Support for high contrast preferences
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **Focus Management**: Proper focus indicators and management

### Accessibility Features

```vue
<template>
  <FortuneWheel
    role="region"
    :aria-label="`Wheel of Fortune with ${prizes.length} prizes`"
    :aria-live="isRotating ? 'polite' : 'off'"
  >
    <!-- Wheel content -->
  </FortuneWheel>
</template>
```

### Testing Accessibility

```bash
# Run accessibility tests
npm run test:a11y

# Run Lighthouse CI
npm run lighthouse
```

## 🤝 Contributing

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/wheel-of-fortune-ssr.git
cd wheel-of-fortune-ssr

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test
```

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: build process or auxiliary tool changes
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [https://wheel-of-fortune-ssr.vercel.app/docs](https://wheel-of-fortune-ssr.vercel.app/docs)
- **Issues**: [GitHub Issues](https://github.com/your-username/wheel-of-fortune-ssr/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/wheel-of-fortune-ssr/discussions)
- **Email**: support@wheel-of-fortune-ssr.com

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Nuxt.js team for the SSR/SSG capabilities
- Tailwind CSS for the utility-first styling
- The open-source community for inspiration and contributions

---

**Built with ❤️ using Vue 3, TypeScript, and Nuxt.js**

