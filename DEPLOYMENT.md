# Deployment Guide - Wheel of Fortune SSR/SSG System

This guide provides comprehensive instructions for deploying the Wheel of Fortune SSR/SSG system to various hosting platforms with optimal performance and scalability.

## 🚀 Quick Deployment Options

### 1. Vercel (Recommended)

**Best for**: SSR/SSG with automatic deployments and edge functions

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts and deploy
```

**Configuration**:
- Framework Preset: Nuxt.js
- Build Command: `npm run build`
- Output Directory: `.output`
- Install Command: `npm install`

**Environment Variables**:
```env
NODE_ENV=production
API_SECRET=your-production-secret
NITRO_PRESET=vercel
```

### 2. Netlify

**Best for**: Static site generation with form handling

```bash
# Build for static generation
npm run generate

# Deploy to Netlify
netlify deploy --prod --dir=.output/public
```

**Configuration**:
- Build Command: `npm run generate`
- Publish Directory: `.output/public`
- Functions Directory: `.output/server`

### 3. Railway

**Best for**: Full-stack applications with database integration

```bash
# Connect your GitHub repository
# Railway will auto-detect Nuxt.js and deploy
```

**Environment Variables**:
```env
NODE_ENV=production
PORT=3000
API_SECRET=your-production-secret
```

## 📊 Performance Optimization

### 1. Build Optimization

```bash
# Analyze bundle size
npm run analyze

# Build with production optimizations
NODE_ENV=production npm run build
```

### 2. Caching Strategy

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      // Cache static assets
      '/static/**': { 
        headers: { 
          'cache-control': 'public, max-age=31536000, immutable' 
        } 
      },
      // Cache API responses
      '/api/prizes': { 
        headers: { 
          'cache-control': 'public, max-age=300' 
        } 
      },
      // No cache for dynamic content
      '/api/spin': { 
        headers: { 
          'cache-control': 'no-cache, no-store, must-revalidate' 
        } 
      }
    }
  }
})
```

### 3. Image Optimization

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp', 'avif', 'jpeg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  }
})
```

## 🔧 Environment Configuration

### Development Environment

```env
# .env.development
NODE_ENV=development
API_BASE=http://localhost:3000/api
API_SECRET=dev-secret-key
NITRO_PRESET=node-server
```

### Production Environment

```env
# .env.production
NODE_ENV=production
API_BASE=https://your-domain.com/api
API_SECRET=your-production-secret
NITRO_PRESET=vercel
REDIS_URL=redis://your-redis-url:6379
```

### Staging Environment

```env
# .env.staging
NODE_ENV=staging
API_BASE=https://staging.your-domain.com/api
API_SECRET=staging-secret-key
NITRO_PRESET=node-server
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build for optimal image size
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.output ./.output

USER nuxtjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", ".output/server/index.mjs"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  wheel-of-fortune:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_SECRET=${API_SECRET}
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

### Deployment Commands

```bash
# Build and run with Docker Compose
docker-compose up -d

# Build and run with Docker
docker build -t wheel-of-fortune .
docker run -p 3000:3000 --env-file .env.production wheel-of-fortune
```

## 🔒 Security Configuration

### 1. Environment Variables

```bash
# Generate secure secrets
openssl rand -base64 32

# Use environment-specific secrets
API_SECRET_DEV=dev-secret
API_SECRET_STAGING=staging-secret
API_SECRET_PRODUCTION=production-secret
```

### 2. CORS Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/api/**': { 
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  }
})
```

### 3. Rate Limiting

```typescript
// server/middleware/rate-limit.ts
export default defineEventHandler(async (event) => {
  const clientIP = getClientIP(event)
  const rateLimit = await useRateLimit(clientIP)
  
  if (!rateLimit.allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests'
    })
  }
})
```

## 📈 Monitoring and Analytics

### 1. Performance Monitoring

```typescript
// plugins/performance.client.ts
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

### 2. Error Tracking

```typescript
// plugins/error-tracking.client.ts
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Initialize error tracking service
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
      // Send to error tracking service
    })
  }
})
```

### 3. Health Checks

```typescript
// server/api/health.get.ts
export default defineEventHandler(() => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV
  }
})
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm run test
    - npm run test:e2e

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .output/

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_WEBHOOK
  only:
    - main
```

## 📊 Performance Benchmarks

### Target Metrics

- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 2s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Testing Performance

```bash
# Run Lighthouse CI
npm run lighthouse

# Run WebPageTest
npm run webpagetest

# Run performance tests
npm run test:performance
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Runtime Errors**
   ```bash
   # Check logs
   npm run dev -- --debug
   
   # Check environment variables
   echo $NODE_ENV
   echo $API_SECRET
   ```

3. **Performance Issues**
   ```bash
   # Analyze bundle
   npm run analyze
   
   # Check memory usage
   node --max-old-space-size=4096 .output/server/index.mjs
   ```

### Support

For deployment issues:
- Check the [Nuxt.js deployment documentation](https://nuxt.com/docs/getting-started/deployment)
- Review the [Vercel documentation](https://vercel.com/docs)
- Open an issue on GitHub with deployment logs

---

**Happy Deploying! 🚀**