import { ref, computed, watch } from 'vue'
import sumBy from 'lodash/sumBy'
import random from 'lodash/random'
import type { PrizeConfig, FortuneWheelProps, FortuneWheelEvents } from '@/types/wheel'

export function useWheelRotation(props: FortuneWheelProps, emit: Function) {
  const isRotating = ref(false)
  const rotateEndDeg = ref(0)
  const currentPrize = ref<PrizeConfig | null>(null)
  const rotationId = ref<number | null>(null)

  // Computed properties
  const probabilityTotal = computed(() => {
    if (props.useWeight) return 100
    return sumBy(props.prizes, (row: PrizeConfig) => row.probability || 0)
  })

  const decimalSpaces = computed(() => {
    if (props.useWeight) return 0
    const sortArr = [...props.prizes].sort((a, b) => {
      const aRes = String(a.probability).split('.')[1]
      const bRes = String(b.probability).split('.')[1]
      const aLen = aRes ? aRes.length : 0
      const bLen = bRes ? bRes.length : 0
      return bLen - aLen
    })
    const maxRes = String(sortArr[0]?.probability).split('.')[1]
    const idx = maxRes ? maxRes.length : 0
    return [1, 10, 100, 1000, 10000][idx > 4 ? 4 : idx]
  })

  const prizesIdArr = computed(() => {
    const idArr: number[] = []
    props.prizes.forEach((row) => {
      const count: number = props.useWeight 
        ? (row.weight || 0) 
        : ((row.probability || 0) * decimalSpaces.value)
      const arr = new Array(count).fill(row.id)
      idArr.push(...arr)
    })
    return idArr
  })

  const rotateDuration = computed(() => {
    return isRotating.value ? props.duration / 1000 : 0
  })

  const rotateStyle = computed(() => {
    return {
      '--rotation-duration': `${rotateDuration.value}s`,
      '--rotation-timing': props.timingFun,
      transform: `rotateZ(${rotateEndDeg.value}deg)`,
      transition: isRotating.value 
        ? `transform ${rotateDuration.value}s ${props.timingFun}`
        : 'none'
    }
  })

  const rotateBase = computed(() => {
    let angle = props.angleBase * 360
    if (props.angleBase < 0) angle -= 360
    return angle
  })

  // Methods
  function startRotation(): void {
    if (isRotating.value) return

    isRotating.value = true
    const prizeId = props.prizeId || getRandomPrize()
    const targetAngle = getTargetAngle(prizeId)
    
    // Set current prize
    currentPrize.value = props.prizes.find(prize => prize.id === prizeId) || null
    
    // Calculate final rotation
    const finalRotation = rotateBase.value + targetAngle
    rotateEndDeg.value = finalRotation

    // Store rotation ID for potential cancellation
    rotationId.value = Date.now()
  }

  function endRotation(): PrizeConfig | null {
    isRotating.value = false
    rotationId.value = null
    
    // Normalize rotation to 0-360 degrees
    rotateEndDeg.value = rotateEndDeg.value % 360
    
    return currentPrize.value
  }

  function cancelRotation(): void {
    if (!isRotating.value) return
    
    isRotating.value = false
    rotationId.value = null
    currentPrize.value = null
  }

  function getRandomPrize(): number {
    if (props.prizes.length === 0) return 0
    
    if (props.useWeight) {
      // Weight-based selection
      const totalWeight = props.prizes.reduce((sum, prize) => sum + (prize.weight || 0), 0)
      let randomValue = Math.random() * totalWeight
      
      for (const prize of props.prizes) {
        randomValue -= (prize.weight || 0)
        if (randomValue <= 0) {
          return prize.id
        }
      }
      return props.prizes[0].id
    } else {
      // Probability-based selection
      if (prizesIdArr.value.length === 0) return props.prizes[0]?.id || 0
      
      const randomIndex = random(0, prizesIdArr.value.length - 1)
      return prizesIdArr.value[randomIndex]
    }
  }

  function getTargetAngle(prizeId: number): number {
    if (props.prizes.length === 0) return 0
    
    const angle = 360 / props.prizes.length
    const prizeIndex = props.prizes.findIndex(row => row.id === prizeId)
    
    if (prizeIndex === -1) return 0
    
    // Calculate target angle for the prize
    const targetAngle = 360 - (angle * prizeIndex + angle / 2)
    
    return targetAngle
  }

  function forcePrize(prizeId: number): void {
    if (!isRotating.value) return
    
    const targetAngle = getTargetAngle(prizeId)
    const newFinalRotation = rotateBase.value + targetAngle
    
    // Smoothly adjust rotation
    rotateEndDeg.value = newFinalRotation
    currentPrize.value = props.prizes.find(prize => prize.id === prizeId) || null
  }

  // Validation
  function validateProbability(): boolean {
    if (probabilityTotal.value !== 100) {
      console.error('Wheel of Fortune Error: Sum of probabilities is not 100!')
      return false
    }
    return true
  }

  // Performance optimization: Debounced rotation updates
  let rotationUpdateTimeout: NodeJS.Timeout | null = null
  
  function debouncedRotationUpdate(prizeId: number): void {
    if (rotationUpdateTimeout) {
      clearTimeout(rotationUpdateTimeout)
    }
    
    rotationUpdateTimeout = setTimeout(() => {
      forcePrize(prizeId)
    }, 100)
  }

  // Watchers
  watch(() => props.prizeId, (newVal) => {
    if (!isRotating.value) return
    
    if (newVal > 0) {
      debouncedRotationUpdate(newVal)
    }
  })

  watch(() => props.prizes, () => {
    // Recalculate when prizes change
    if (isRotating.value) {
      // Optionally cancel current rotation if prizes change
      // cancelRotation()
    }
  }, { deep: true })

  // Cleanup on unmount
  function cleanup(): void {
    if (rotationUpdateTimeout) {
      clearTimeout(rotationUpdateTimeout)
    }
    cancelRotation()
  }

  return {
    // State
    isRotating,
    rotateEndDeg,
    currentPrize,
    rotationId,
    
    // Computed
    probabilityTotal,
    rotateStyle,
    rotateBase,
    
    // Methods
    startRotation,
    endRotation,
    cancelRotation,
    getRandomPrize,
    getTargetAngle,
    forcePrize,
    validateProbability,
    cleanup
  }
}