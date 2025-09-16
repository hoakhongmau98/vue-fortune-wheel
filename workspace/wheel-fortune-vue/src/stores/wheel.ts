import { defineStore } from 'pinia'

export type WheelSlice = {
  id: string
  label: string
  weight?: number
  color?: string
}

export type SpinResult = {
  slice: WheelSlice
  index: number
  rotationDeg: number
}

function getWeightedIndex(weights: number[], random: number): number {
  const total = weights.reduce((sum, w) => sum + w, 0)
  let threshold = random * total
  for (let i = 0; i < weights.length; i++) {
    threshold -= weights[i]
    if (threshold <= 0) return i
  }
  return weights.length - 1
}

export const useWheelStore = defineStore('wheel', {
  state: () => ({
    isSpinning: false as boolean,
    rotationDeg: 0 as number,
    spinDurationMs: 3000 as number,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)' as string,
    slices: [] as WheelSlice[],
    lastResult: null as SpinResult | null
  }),
  actions: {
    setSlices(slices: WheelSlice[]) {
      this.slices = slices
    },
    setSpinDuration(ms: number) {
      this.spinDurationMs = ms
    },
    async spin(random = Math.random()): Promise<SpinResult> {
      if (this.isSpinning || this.slices.length === 0) {
        throw new Error('Cannot spin right now')
      }
      this.isSpinning = true

      const weights = this.slices.map(s => (s.weight ?? 1))
      const index = getWeightedIndex(weights, random)

      const segmentSize = 360 / this.slices.length
      const targetCenter = index * segmentSize + segmentSize / 2
      const turns = 5
      const targetRotation = turns * 360 + (360 - targetCenter)
      const startRotation = this.rotationDeg % 360
      const delta = targetRotation + (360 - startRotation)

      this.rotationDeg += delta

      await new Promise(resolve => setTimeout(resolve, this.spinDurationMs))

      const result: SpinResult = {
        slice: this.slices[index],
        index,
        rotationDeg: this.rotationDeg
      }
      this.lastResult = result
      this.isSpinning = false
      return result
    }
  }
})

