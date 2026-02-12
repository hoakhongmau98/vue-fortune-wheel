<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useWheelStore, type WheelSlice } from '../stores/wheel'

type Props = {
  slices: WheelSlice[]
  size?: number
  strokeWidth?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:slices', value: WheelSlice[]): void
  (e: 'spinning', value: boolean): void
  (e: 'result', value: { slice: WheelSlice; index: number }): void
}>()

const store = useWheelStore()

watch(
  () => props.slices,
  (val) => {
    store.setSlices(val ?? [])
    emit('update:slices', val ?? [])
  },
  { immediate: true, deep: true }
)

const size = computed(() => props.size ?? 360)
const radius = computed(() => size.value / 2)
const strokeWidth = computed(() => props.strokeWidth ?? 0)

const segmentAngle = computed(() => (store.slices.length > 0 ? 360 / store.slices.length : 0))

const svgViewBox = computed(() => `0 0 ${size.value} ${size.value}`)

function polarToCartesian(centerX: number, centerY: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + r * Math.cos(angleInRadians),
    y: centerY + r * Math.sin(angleInRadians)
  }
}

function describeSlice(startAngle: number, endAngle: number) {
  const center = radius.value
  const start = polarToCartesian(center, center, center - strokeWidth.value, endAngle)
  const end = polarToCartesian(center, center, center - strokeWidth.value, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  const d = [
    'M', center, center,
    'L', start.x, start.y,
    'A', center - strokeWidth.value, center - strokeWidth.value, 0, largeArcFlag, 0, end.x, end.y,
    'Z'
  ].join(' ')
  return d
}

const spinning = computed(() => store.isSpinning)

async function spin() {
  emit('spinning', true)
  const result = await store.spin()
  emit('result', { slice: result.slice, index: result.index })
  emit('spinning', false)
}

const wrapperStyle = computed(() => ({
  width: `${size.value}px`,
  height: `${size.value}px`
}))

const wheelStyle = computed(() => ({
  transform: `rotate(${store.rotationDeg}deg)`,
  transition: store.isSpinning ? `transform ${store.spinDurationMs}ms ${store.easing}` : 'none'
}))

const defaultColors = [
  '#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6', '#F59E0B', '#10B981'
]

function getSliceColor(i: number) {
  return store.slices[i]?.color ?? defaultColors[i % defaultColors.length]
}
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <div class="relative" :style="wrapperStyle">
      <div class="absolute left-1/2 -translate-x-1/2 -top-3 z-10">
        <div class="w-0 h-0 border-l-8 border-r-8 border-b-[16px] border-l-transparent border-r-transparent border-b-rose-500"></div>
      </div>

      <svg :viewBox="svgViewBox" :style="wheelStyle" class="rounded-full shadow-lg">
        <g v-for="(slice, i) in store.slices" :key="slice.id">
          <path :d="describeSlice(i * segmentAngle, (i + 1) * segmentAngle)" :fill="getSliceColor(i)" />
          <text
            :x="radius"
            :y="radius"
            fill="#111827"
            font-size="14"
            font-weight="600"
            text-anchor="middle"
            :transform="`rotate(${i * segmentAngle + segmentAngle / 2} ${radius} ${radius}) translate(0 ${-radius + 36})`"
          >
            {{ slice.label }}
          </text>
        </g>
        <circle :cx="radius" :cy="radius" :r="radius - 2" stroke="#111827" fill="transparent" stroke-width="2" />
      </svg>
    </div>
    <button class="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50" :disabled="spinning" @click="spin">
      {{ spinning ? 'Spinning…' : 'Spin' }}
    </button>
  </div>
  
</template>

<style scoped>
</style>
