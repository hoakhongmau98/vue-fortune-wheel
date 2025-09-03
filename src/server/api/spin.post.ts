import type { SpinApiResponse } from '@/types/wheel'

export default defineEventHandler(async (event): Promise<SpinApiResponse> => {
  try {
    // Get request body
    const body = await readBody(event)
    const { prizes, useWeight, prizeId } = body

    // Validate request
    if (!prizes || !Array.isArray(prizes) || prizes.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid prizes data'
      })
    }

    // Validate probabilities/weights
    const total = useWeight 
      ? prizes.reduce((sum: number, prize: any) => sum + (prize.weight || 0), 0)
      : prizes.reduce((sum: number, prize: any) => sum + (prize.probability || 0), 0)

    if (useWeight && total === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Total weight must be greater than 0'
      })
    }

    if (!useWeight && Math.abs(total - 100) > 0.01) {
      throw createError({
        statusCode: 400,
        statusMessage: `Total probability must equal 100%. Current total: ${total}%`
      })
    }

    // Determine winning prize
    let winningPrize
    if (prizeId && prizeId > 0) {
      // Use specified prize ID
      winningPrize = prizes.find((prize: any) => prize.id === prizeId)
      if (!winningPrize) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Specified prize ID not found'
        })
      }
    } else {
      // Random selection based on probability/weight
      if (useWeight) {
        // Weight-based selection
        const totalWeight = prizes.reduce((sum: number, prize: any) => sum + (prize.weight || 0), 0)
        let random = Math.random() * totalWeight
        
        for (const prize of prizes) {
          random -= (prize.weight || 0)
          if (random <= 0) {
            winningPrize = prize
            break
          }
        }
        if (!winningPrize) {
          winningPrize = prizes[0]
        }
      } else {
        // Probability-based selection
        const prizesIdArr: number[] = []
        const decimalSpaces = getDecimalSpaces(prizes)
        
        prizes.forEach((prize: any) => {
          const count = (prize.probability || 0) * decimalSpaces
          const arr = new Array(count).fill(prize.id)
          prizesIdArr.push(...arr)
        })
        
        if (prizesIdArr.length === 0) {
          winningPrize = prizes[0]
        } else {
          const randomIndex = Math.floor(Math.random() * prizesIdArr.length)
          const selectedId = prizesIdArr[randomIndex]
          winningPrize = prizes.find((prize: any) => prize.id === selectedId)
        }
      }
    }

    // Generate unique spin ID
    const spinId = generateSpinId()

    // In a real application, you would store the spin result in a database
    // For now, we'll just return the result
    const result = {
      prize: winningPrize,
      spinId,
      timestamp: new Date().toISOString(),
      metadata: {
        totalPrizes: prizes.length,
        useWeight,
        totalProbability: total
      }
    }

    // Add cache headers
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
    setHeader(event, 'Pragma', 'no-cache')
    setHeader(event, 'Expires', '0')

    return {
      success: true,
      data: result
    }
  } catch (error: any) {
    console.error('Error processing spin:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    return {
      success: false,
      error: 'Failed to process spin',
      message: error.message || 'An error occurred while processing the spin'
    }
  }
})

// Helper function to calculate decimal spaces for probability precision
function getDecimalSpaces(prizes: any[]): number {
  const sortArr = [...prizes].sort((a, b) => {
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

// Helper function to generate unique spin ID
function generateSpinId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `spin-${timestamp}-${random}`
}