# Wheel of Fortune (Vue 3 + TS) — Core Architecture and Logic

## Overview
The repository provides a reusable Fortune Wheel component for Vue 3, implemented in TypeScript and built as a Vite library. It supports two rendering modes:
- Canvas mode: Wheel segments are drawn via `<canvas>`.
- Image mode: The wheel and button are provided by slots using custom images.

Core files:
- `src/components/fortuneWheel/index.vue`: Public component interface, props, events, and template.
- `src/components/fortuneWheel/hooks/useRotate.ts`: Rotation state machine, probability/weight selection, angle math, and transitions.
- `src/components/fortuneWheel/hooks/useCanvas.ts`: Canvas drawing of segments and labels.
- `src/components/fortuneWheel/types.ts`: Strongly-typed props and configuration.
- `src/components/fortuneWheel/utils.ts`: Text splitting utility for canvas labels.

Build and entry:
- `vite.config.ts`: Library build with `src/components/install.ts` as entry.
- `package.json`: Scripts (`dev`, `build`, `preview`) and library export fields.

## Public Component API
Component: `FortuneWheel` (default export of `src/components/fortuneWheel/index.vue`).

### Props
- `type: 'canvas' | 'image'` (default: `canvas`)
- `useWeight: boolean` (default: `false`)
- `disabled: boolean` (default: `false`)
- `verify: boolean` (default: `false`)
- `canvas: CanvasConfig` (default: `{}`)
- `duration: number` (ms, default: `6000`)
- `timingFun: string` (CSS timing function, default: `cubic-bezier(0.36, 0.95, 0.64, 1)`)
- `angleBase: number` (base rotations, `angleBase * 360`, negative reverses direction; default: `10`)
- `prizeId: number` (default: `0`; if non-zero, forces target; can be changed mid-spin)
- `prizes: PrizeConfig[]` (required)

PrizeConfig supports both probability-based and weight-based configurations and, in canvas mode, includes colors and display name.

### Events
- `rotateStart`:
  - Without verification: emitted immediately when the button is clicked.
  - With `verify=true`: emitted with a callback parameter; call the callback to start rotation after external checks.
- `rotateEnd`: emitted when rotation animation completes; payload is the resolved prize object.

### Methods (via `ref`/`expose`)
- `startRotate()`: Programmatically trigger rotation. In verify mode, rotation actually starts only after the provided callback is invoked from the `rotateStart` handler.

### Slots (image mode)
- `wheel`: Custom wheel image/content.
- `button`: Custom button image/content.

## Runtime State and Data Flow
- Inputs: `props` (`prizes`, probability/weight flags, timing, base angle, `prizeId`).
- Internal state: `isRotating`, `rotateEndDeg`, `prizeRes`.
- Derived/computed:
  - `probabilityTotal`: Must equal 100 for probability mode; hard-coded 100 for weight mode.
  - `decimalSpaces`: Multiplier to preserve up to 4 decimal places for probabilities.
  - `prizesIdArr`: Linearized ID array based on probability or weight, used to draw a random ID uniformly from this array.
  - `rotateDuration`: Seconds value for CSS transition.
  - `rotateStyle`: Transform and transition styles applied to the wheel container.
  - `rotateBase`: `angleBase * 360` with reverse handling if negative.
  - `canRotate`: `!disabled && !isRotating && probabilityTotal === 100`.

Flow (happy path):
1. User clicks button ➜ `handleClick()`.
2. If `verify=true` ➜ emit `rotateStart` with `onRotateStart` callback (host decides when to start). Else emit `rotateStart` and continue.
3. `onRotateStart()` sets `isRotating=true`, resolves a `prizeId` (forced or random), computes target angle, and sets `rotateEndDeg` to `rotateBase + targetDeg`.
4. CSS transition animates rotation; upon `transitionend`, `onRotateEnd()` fires, normalizes `rotateEndDeg %= 360`, `isRotating=false`, and emits `rotateEnd(prizeRes)`.

Verify flow (with backend):
- Host sets `verify=true`. On button press, component emits `rotateStart(cb)`. Host calls backend to verify quota/eligibility, then calls `cb()` to start spin (or does nothing to cancel).

Mid-rotation override (`prizeId` changes while spinning):
- A watcher adjusts `rotateEndDeg` to smoothly redirect to the new prize without snapping. If `angleBase >= 0`, it adds enough full turns to keep spinning forward; for negative, it subtracts to keep spinning backward.

## Selection Algorithms

### Probability mode
- `probabilityTotal = sum(prize.probability)`; validated to equal 100 on init.
- `decimalSpaces` is chosen based on the maximum number of decimal places (up to 4), mapping to `[1, 10, 100, 1000, 10000]`.
- `prizesIdArr` repeats each `id` by `probability * decimalSpaces` times.
- `getRandomPrize()` picks a uniform random index from `prizesIdArr` (lodash `random`) and returns an `id`.

### Weight mode
- `useWeight=true`; consumers provide integer `weight`s per prize.
- `probabilityTotal` is treated as 100 for gating; no explicit sum validation here.
- `prizesIdArr` repeats each `id` by `weight` times (0 weight excludes the prize).

### Angle math
- Segment angle: `segment = 360 / prizes.length`.
- Segment index for `prizeId`: `num = prizes.findIndex(p => p.id === prizeId)`.
- Target angle: `360 - (segment * num + segment / 2)` (so the top indicator points to the center of the segment).

## Canvas Rendering (canvas mode)
- `useCanvas` computes `canvasConfig = { ...defaults, ...props.canvas }`.
- On mount, if `type==='canvas'`, `drawCanvas()` paints the wheel:
  - Clears canvas and sets stroke/font.
  - For each prize: computes arc, fills colored wedge, strokes border, and draws label text.
  - Text rendering uses `getStrArray(name, textLength)` to wrap into up to two lines and supports `horizontal` or `vertical` orientation with configurable `lineHeight` and `fontSize`.

## Styling and Animation
- Rotation is achieved via inline `transform: rotateZ(rotateEndDeg)` and CSS transition with `duration` and `timingFun` applied.
- Button rendering:
  - Canvas mode: a styled div of size `btnWidth` with label `btnText`.
  - Image mode: `button` slot content.

## Error Handling and Edge Cases
- Probability mode enforces `sum(probability) === 100` at runtime via `checkProbability()` and throws if invalid.
- `disabled` or `isRotating` or invalid probability prevents spin.
- Changing `prizeId` when not spinning has no effect; when spinning, it redirects the target gracefully.

## Extension Points
- Image mode allows any arbitrary wheel graphics and pointers via slots.
- Canvas mode exposes `canvas` configuration for typography, borders, and sizing.
- Consumers can drive outcomes deterministically by setting `prizeId` before or during a spin (e.g., after server response).

## File Structure (relevant)
- `src/components/fortuneWheel/index.vue`
- `src/components/fortuneWheel/hooks/useRotate.ts`
- `src/components/fortuneWheel/hooks/useCanvas.ts`
- `src/components/fortuneWheel/types.ts`
- `src/components/fortuneWheel/utils.ts`

## Known Constraints
- Weight mode does not hard-validate weight totals; consumers must ensure intended distribution.
- Probability mode requires integers after scaling by `decimalSpaces`; extremely small probabilities beyond 4 decimals are truncated.
- Rotation relies on CSS transitionend events; ensure the element is present and not display:none.