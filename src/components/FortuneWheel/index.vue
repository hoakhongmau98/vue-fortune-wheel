<template>
  <div 
    class="fortune-wheel-container"
    :class="{ 'is-rotating': isRotating, 'is-disabled': disabled }"
    role="region"
    :aria-label="`Wheel of Fortune with ${prizes.length} prizes`"
    :aria-live="isRotating ? 'polite' : 'off'"
  >
    <!-- Wheel -->
    <div
      ref="wheelRef"
      class="fortune-wheel"
      :style="rotateStyle"
      @transitionend="onRotateEnd"
      @webkitTransitionend="onRotateEnd"
      role="img"
      :aria-label="`Wheel showing ${prizes.length} prizes`"
    >
      <!-- Canvas-based wheel -->
      <canvas
        v-if="type === 'canvas'"
        ref="canvasRef"
        :width="canvasConfig.radius * 2"
        :height="canvasConfig.radius * 2"
        :aria-label="`Canvas wheel with ${prizes.length} prizes`"
        class="wheel-canvas"
      />
      
      <!-- Image-based wheel -->
      <div v-else class="wheel-image">
        <slot name="wheel" />
      </div>
    </div>

    <!-- Spin button -->
    <div class="fortune-wheel-button">
      <!-- Canvas button -->
      <button
        v-if="type === 'canvas'"
        ref="buttonRef"
        class="wheel-button canvas-button"
        :class="{ 'is-spinning': isRotating }"
        :style="{ 
          width: canvasConfig.btnWidth + 'px', 
          height: canvasConfig.btnWidth + 'px'
        }"
        :disabled="disabled || isRotating"
        @click="handleClick"
        @keydown.enter="handleClick"
        @keydown.space.prevent="handleClick"
        :aria-label="buttonAriaLabel"
        :aria-describedby="buttonDescriptionId"
      >
        <span class="button-text">{{ canvasConfig.btnText }}</span>
        <span class="sr-only">{{ buttonDescription }}</span>
      </button>
      
      <!-- Image button -->
      <button
        v-else
        ref="buttonRef"
        class="wheel-button image-button"
        :class="{ 'is-spinning': isRotating }"
        :disabled="disabled || isRotating"
        @click="handleClick"
        @keydown.enter="handleClick"
        @keydown.space.prevent="handleClick"
        :aria-label="buttonAriaLabel"
        :aria-describedby="buttonDescriptionId"
      >
        <slot name="button" />
        <span class="sr-only">{{ buttonDescription }}</span>
      </button>
    </div>

    <!-- Loading indicator -->
    <div 
      v-if="isRotating" 
      class="wheel-loading"
      role="status"
      aria-live="polite"
    >
      <div class="loading-spinner" aria-hidden="true"></div>
      <span class="sr-only">Wheel is spinning...</span>
    </div>

    <!-- Prize indicator -->
    <div 
      v-if="currentPrize && !isRotating"
      class="wheel-result"
      role="status"
      aria-live="polite"
    >
      <span class="sr-only">You won: {{ currentPrize.name || currentPrize.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useWheelCanvas } from './composables/useWheelCanvas'
import { useWheelRotation } from './composables/useWheelRotation'
import { useWheelAccessibility } from './composables/useWheelAccessibility'
import type { FortuneWheelProps, FortuneWheelEvents } from '@/types/wheel'

// Props with defaults
const props = withDefaults(defineProps<FortuneWheelProps>(), {
  type: 'canvas',
  useWeight: false,
  disabled: false,
  verify: false,
  canvas: () => ({}),
  duration: 6000,
  timingFun: 'cubic-bezier(0.36, 0.95, 0.64, 1)',
  angleBase: 10,
  prizeId: 0,
  prizes: () => []
})

// Emits
const emit = defineEmits<FortuneWheelEvents>()

// Template refs
const wheelRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const buttonRef = ref<HTMLButtonElement>()

// Composables
const { canvasConfig, drawCanvas, redrawCanvas } = useWheelCanvas(props, canvasRef)
const { 
  isRotating, 
  rotateStyle, 
  currentPrize, 
  startRotation, 
  endRotation,
  getTargetAngle 
} = useWheelRotation(props, emit)
const { 
  buttonAriaLabel, 
  buttonDescription, 
  buttonDescriptionId 
} = useWheelAccessibility(props, isRotating, currentPrize)

// Computed properties
const canSpin = computed(() => {
  return !props.disabled && 
         !isRotating.value && 
         props.prizes.length > 0 &&
         getProbabilityTotal() === 100
})

// Methods
function handleClick(): void {
  if (!canSpin.value) return
  
  if (props.verify) {
    emit('rotateStart', onRotateStart)
    return
  }
  
  emit('rotateStart')
  onRotateStart()
}

function onRotateStart(): void {
  startRotation()
}

function onRotateEnd(): void {
  const prize = endRotation()
  if (prize) {
    emit('rotateEnd', prize)
  }
}

function getProbabilityTotal(): number {
  if (props.useWeight) return 100
  
  return props.prizes.reduce((total, prize) => {
    return total + (prize.probability || 0)
  }, 0)
}

// Lifecycle
onMounted(async () => {
  if (props.type === 'canvas') {
    await nextTick()
    drawCanvas()
  }
})

// Watchers
watch(() => props.prizes, () => {
  if (props.type === 'canvas') {
    nextTick(() => {
      redrawCanvas()
    })
  }
}, { deep: true })

watch(() => props.canvas, () => {
  if (props.type === 'canvas') {
    nextTick(() => {
      redrawCanvas()
    })
  }
}, { deep: true })

// Expose methods for external control
defineExpose({
  startRotate: (): void => {
    handleClick()
  },
  getCurrentPrize: (): any => currentPrize.value,
  getTargetAngle: (prizeId: number): number => getTargetAngle(prizeId),
  isSpinning: (): boolean => isRotating.value
})
</script>

<style lang="scss" scoped>
.fortune-wheel-container {
  position: relative;
  display: inline-block;
  user-select: none;
  
  &.is-rotating {
    pointer-events: none;
    
    .wheel-button {
      cursor: not-allowed;
    }
  }
  
  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.fortune-wheel {
  position: relative;
  transition: transform var(--rotation-duration, 6s) var(--rotation-timing, cubic-bezier(0.36, 0.95, 0.64, 1));
  will-change: transform;
  
  &.is-rotating {
    animation: wheel-glow 2s ease-in-out infinite alternate;
  }
}

.wheel-canvas {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
}

.wheel-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.fortune-wheel-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.wheel-button {
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  
  &:focus {
    outline: 2px solid theme('colors.primary.500');
    outline-offset: 2px;
  }
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &.is-spinning {
    animation: button-pulse 1s ease-in-out infinite;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.canvas-button {
  background: linear-gradient(135deg, theme('colors.primary.500'), theme('colors.primary.600'));
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, theme('colors.primary.600'), theme('colors.primary.700'));
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
}

.image-button {
  background: transparent;
  padding: 0;
  
  img {
    max-width: 100%;
    height: auto;
    transition: transform 0.3s ease;
  }
  
  &:hover:not(:disabled) img {
    transform: scale(1.05);
  }
}

.button-text {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.wheel-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid theme('colors.primary.500');
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.wheel-result {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;
  color: theme('colors.gray.600');
  text-align: center;
}

// Animations
@keyframes wheel-glow {
  0% {
    filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.3));
  }
  100% {
    filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6));
  }
}

@keyframes button-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .fortune-wheel {
    transition: none;
  }
  
  .wheel-button {
    transition: none;
    
    &:hover:not(:disabled) {
      transform: none;
    }
  }
  
  .loading-spinner {
    animation: none;
  }
  
  .canvas-button.is-spinning,
  .image-button.is-spinning {
    animation: none;
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .wheel-canvas {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    
    &:hover {
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    }
  }
  
  .wheel-result {
    color: theme('colors.gray.400');
  }
}

// High contrast mode support
@media (prefers-contrast: high) {
  .wheel-button {
    border: 2px solid currentColor;
  }
  
  .canvas-button {
    background: theme('colors.gray.900');
    color: theme('colors.white');
  }
}

// Print styles
@media print {
  .fortune-wheel-container {
    break-inside: avoid;
  }
  
  .wheel-button {
    display: none;
  }
}
</style>