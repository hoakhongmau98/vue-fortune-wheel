import { defineStore } from 'pinia'
import type { PrizeConfig, CanvasConfig, WheelState } from '@/types/wheel'

export const useWheelStore = defineStore('wheel', () => {
  // State
  const state = reactive<WheelState>({
    isRotating: false,
    currentPrizeId: 0,
    selectedPrizeId: 0,
    prizes: [],
    canvasConfig: {
      radius: 250,
      textRadius: 190,
      textLength: 6,
      textDirection: 'horizontal',
      lineHeight: 20,
      borderWidth: 0,
      borderColor: 'transparent',
      btnText: 'SPIN',
      btnWidth: 140,
      fontSize: 34
    },
    wheelConfig: {
      type: 'canvas',
      useWeight: false,
      disabled: false,
      verify: false,
      duration: 6000,
      timingFun: 'cubic-bezier(0.36, 0.95, 0.64, 1)',
      angleBase: 10
    },
    history: [],
    statistics: {
      totalSpins: 0,
      prizesWon: {} as Record<number, number>
    }
  })

  // Getters
  const currentPrize = computed(() => {
    return state.prizes.find(prize => prize.id === state.currentPrizeId) || null
  })

  const selectedPrize = computed(() => {
    return state.prizes.find(prize => prize.id === state.selectedPrizeId) || null
  })

  const canSpin = computed(() => {
    return !state.wheelConfig.disabled && 
           !state.isRotating && 
           state.prizes.length > 0 &&
           getProbabilityTotal() === 100
  })

  const probabilityTotal = computed(() => getProbabilityTotal())

  // Actions
  function initializePrizes(prizes: PrizeConfig[]) {
    state.prizes = prizes
    // Initialize statistics
    prizes.forEach(prize => {
      if (!state.statistics.prizesWon[prize.id]) {
        state.statistics.prizesWon[prize.id] = 0
      }
    })
  }

  function setCanvasConfig(config: Partial<CanvasConfig>) {
    state.canvasConfig = { ...state.canvasConfig, ...config }
  }

  function setWheelConfig(config: Partial<typeof state.wheelConfig>) {
    state.wheelConfig = { ...state.wheelConfig, ...config }
  }

  function startRotation() {
    if (!canSpin.value) return false
    
    state.isRotating = true
    state.currentPrizeId = state.selectedPrizeId || getRandomPrize()
    
    // Add to history
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      prizeId: state.currentPrizeId,
      prize: currentPrize.value
    }
    state.history.unshift(historyEntry)
    
    // Update statistics
    state.statistics.totalSpins++
    if (state.currentPrizeId) {
      state.statistics.prizesWon[state.currentPrizeId]++
    }
    
    return true
  }

  function endRotation() {
    state.isRotating = false
    return currentPrize.value
  }

  function setSelectedPrize(prizeId: number) {
    if (state.isRotating) {
      // Allow changing prize during rotation for demo purposes
      state.selectedPrizeId = prizeId
      state.currentPrizeId = prizeId
    } else {
      state.selectedPrizeId = prizeId
    }
  }

  function reset() {
    state.isRotating = false
    state.currentPrizeId = 0
    state.selectedPrizeId = 0
    state.history = []
    state.statistics = {
      totalSpins: 0,
      prizesWon: {} as Record<number, number>
    }
  }

  function clearHistory() {
    state.history = []
  }

  // Helper functions
  function getProbabilityTotal(): number {
    if (state.wheelConfig.useWeight) return 100
    
    return state.prizes.reduce((total, prize) => {
      return total + (prize.probability || 0)
    }, 0)
  }

  function getRandomPrize(): number {
    if (state.prizes.length === 0) return 0
    
    if (state.wheelConfig.useWeight) {
      // Weight-based selection
      const totalWeight = state.prizes.reduce((sum, prize) => sum + (prize.weight || 0), 0)
      let random = Math.random() * totalWeight
      
      for (const prize of state.prizes) {
        random -= (prize.weight || 0)
        if (random <= 0) {
          return prize.id
        }
      }
      return state.prizes[0].id
    } else {
      // Probability-based selection
      const prizesIdArr: number[] = []
      const decimalSpaces = getDecimalSpaces()
      
      state.prizes.forEach((prize) => {
        const count = (prize.probability || 0) * decimalSpaces
        const arr = new Array(count).fill(prize.id)
        prizesIdArr.push(...arr)
      })
      
      if (prizesIdArr.length === 0) return state.prizes[0]?.id || 0
      
      const randomIndex = Math.floor(Math.random() * prizesIdArr.length)
      return prizesIdArr[randomIndex]
    }
  }

  function getDecimalSpaces(): number {
    if (state.wheelConfig.useWeight) return 0
    
    const sortArr = [...state.prizes].sort((a, b) => {
      const aRes = String(a.probability).split('.')[1]
      const bRes = String(b.probability).split('.')[1]
      const aLen = aRes ? aRes.length : 0
      const bLen = bRes ? bRes.length : 0
      return bLen - aLen
    })
    
    const maxRes = String(sortArr[0]?.probability).split('.')[1]
    const idx = maxRes ? maxRes.length : 0
    return [1, 10, 100, 1000, 10000][idx > 4 ? 4 : idx]
  }

  // SSR/SSG compatibility
  function $reset() {
    reset()
  }

  return {
    // State
    ...toRefs(state),
    
    // Getters
    currentPrize,
    selectedPrize,
    canSpin,
    probabilityTotal,
    
    // Actions
    initializePrizes,
    setCanvasConfig,
    setWheelConfig,
    startRotation,
    endRotation,
    setSelectedPrize,
    reset,
    clearHistory,
    
    // SSR/SSG
    $reset
  }
}, {
  // Persist state for SSR/SSG
  persist: {
    storage: persistedState.localStorage,
    paths: ['prizes', 'canvasConfig', 'wheelConfig', 'history', 'statistics']
  }
})