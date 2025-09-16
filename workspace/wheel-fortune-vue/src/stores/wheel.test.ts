import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWheelStore, type WheelSlice } from './wheel'

describe('useWheelStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('spins and selects weighted slice deterministically', async () => {
    const store = useWheelStore()
    const slices: WheelSlice[] = [
      { id: 'a', label: 'A', weight: 1 },
      { id: 'b', label: 'B', weight: 3 },
      { id: 'c', label: 'C', weight: 1 }
    ]
    store.setSlices(slices)
    store.setSpinDuration(1)

    const result = await store.spin(0.6) // bias towards heavier slice index 1
    expect(result.index).toBe(1)
    expect(result.slice.label).toBe('B')
    expect(store.isSpinning).toBe(false)
    expect(store.lastResult?.index).toBe(1)
  })
})

