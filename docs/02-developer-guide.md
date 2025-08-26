# New Developer Guide — Vue Fortune Wheel

## Prerequisites
- Node.js 16+ and npm 8+ (or yarn/pnpm)
- Git
- Familiarity with Vue 3 + TypeScript

## Install and Run
```bash
npm install
npm run dev
```
Open http://localhost:5173 (or the port shown by Vite).

## Build Library
```bash
npm run build
```
Artifacts are output to `dist/` with ESM and UMD bundles and `style.css`.

## Project Structure
- `src/App.vue`: Demo usage (both canvas and image modes)
- `src/components/fortuneWheel/`: Component implementation
  - `index.vue`: Public component
  - `hooks/useRotate.ts`: Spin logic and events
  - `hooks/useCanvas.ts`: Canvas draw logic
  - `types.ts`: Type definitions
  - `utils.ts`: Utilities

## Using the Component in Apps
Install from npm in your app:
```bash
npm i vue-fortune-wheel
```
Basic usage (image mode with verify):
```vue
<template>
  <FortuneWheel
    ref="wheel"
    type="image"
    :useWeight="true"
    :verify="true"
    :prizeId="prizeId"
    :prizes="prizes"
    @rotateStart="onStart"
    @rotateEnd="onEnd"
  >
    <template #wheel>
      <img :src="wheelImg" style="width: 100%" />
    </template>
    <template #button>
      <img :src="btnImg" style="width: 180px" />
    </template>
  </FortuneWheel>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import FortuneWheel from 'vue-fortune-wheel'
import 'vue-fortune-wheel/style.css'
const wheel = ref()
const prizeId = ref(0)
const prizes = [
  { id: 1, value: 'A', weight: 1 },
  { id: 2, value: 'B', weight: 0 },
]
function onStart(start: () => void) {
  // Call backend to verify eligibility, then:
  start()
}
function onEnd(prize: any) {
  console.log('result:', prize)
}
</script>
```

Canvas mode example:
```vue
<FortuneWheel :prizes="canvasPrizes" :canvas="{ borderWidth: 6 }" />
```

## Key Concepts
- Probability vs weight:
  - Probability mode: `sum(probability) === 100` required.
  - Weight mode: integer `weight` determines chance; set `useWeight=true`.
- Deterministic outcomes: set `prizeId` before/during spin to force the result.
- Verify mode: set `verify=true` to gate spin by backend; call provided callback to begin spinning.
- Direction and speed: control via `angleBase` (sign = direction) and `duration` (ms).

## Testing Changes Locally
- Demo: modify `src/App.vue` and run `npm run dev`.
- Type-check: `npx vue-tsc --noEmit` or `npm run build`.

## Publishing (maintainers)
- Bump version in `package.json`.
- Build: `npm run build`.
- Test the built package via `npm pack` or local `npm link`.
- Publish: `npm publish` (ensure you have permissions).

## Troubleshooting
- Spin does not start: check `disabled`, `verify`, and probability sum (probability mode must equal 100).
- Wrong prize angles: ensure `prizes.length >= 2` and IDs exist; angle math uses index order.
- Mid-spin change ignored: only takes effect when `isRotating` is true; otherwise set `prizeId` before starting.
- Canvas text overflow: tune `canvas.textLength`, `lineHeight`, and `fontSize`.