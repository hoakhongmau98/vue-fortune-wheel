# Wheel Fortune Vue (Vue 3 + Vite + TS + Tailwind)

Reusable Wheel of Fortune component extracted into a clean, minimal Vue 3 project.

## Tech
- Vue 3 (Composition API, `<script setup>`)
- Vite + TypeScript
- Tailwind CSS v4
- Pinia (state for spin/rotation and results)
- Vitest (unit tests)

## Project structure
```
src/
  components/
    WheelFortune.vue     # Reusable component
  stores/
    wheel.ts            # Core spin logic + state
  App.vue               # Demo integration
  main.ts               # App bootstrap (Pinia)
  style.css             # Tailwind import
```

## Usage
Minimal example using the component:

```vue
<script setup lang="ts">
import WheelFortune from '@/components/WheelFortune.vue'

const slices = [
  { id: '1', label: '100', color: '#F87171' },
  { id: '2', label: '200', color: '#FBBF24' },
  { id: '3', label: '300', color: '#34D399' }
]
</script>

<template>
  <WheelFortune :slices="slices" :size="360" @result="r => console.log(r)" />
  <!-- Emits:
       - update:slices (WheelSlice[])
       - spinning (boolean)
       - result ({ slice, index })
  -->
  
</template>
```

### Props
- `slices: WheelSlice[]` (required)
- `size?: number` (default 360)
- `strokeWidth?: number` (default 0)

### WheelSlice
```ts
type WheelSlice = {
  id: string
  label: string
  weight?: number // default 1
  color?: string  // optional color; cycles through defaults otherwise
}
```

## Development
```bash
npm install
npm run dev
```

## Testing
```bash
npm run test
```

## Notes
- The weighted selection uses cumulative thresholds mapping a random in [0,1) to an index.
- Rotation is computed so the pointer at the top lands on the chosen slice center after several full turns.
- Tailwind v4 is used via `@import "tailwindcss"` in `src/style.css`.
