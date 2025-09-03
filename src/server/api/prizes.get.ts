import type { PrizeApiResponse } from '@/types/wheel'

export default defineEventHandler(async (event): Promise<PrizeApiResponse> => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const limit = parseInt(query.limit as string) || 10
    const offset = parseInt(query.offset as string) || 0

    // Mock prize data - in a real application, this would come from a database
    const mockPrizes = [
      {
        id: 1,
        name: 'Grand Prize',
        value: 'Grand Prize Value',
        bgColor: '#FFD700',
        color: '#000000',
        probability: 5,
        weight: 1
      },
      {
        id: 2,
        name: 'Second Prize',
        value: 'Second Prize Value',
        bgColor: '#C0C0C0',
        color: '#000000',
        probability: 15,
        weight: 3
      },
      {
        id: 3,
        name: 'Third Prize',
        value: 'Third Prize Value',
        bgColor: '#CD7F32',
        color: '#FFFFFF',
        probability: 30,
        weight: 6
      },
      {
        id: 4,
        name: 'Consolation',
        value: 'Consolation Prize',
        bgColor: '#45ace9',
        color: '#FFFFFF',
        probability: 50,
        weight: 10
      }
    ]

    // Apply pagination
    const paginatedPrizes = mockPrizes.slice(offset, offset + limit)
    const total = mockPrizes.length

    // Add cache headers for better performance
    setHeader(event, 'Cache-Control', 'public, max-age=300') // Cache for 5 minutes
    setHeader(event, 'ETag', `prizes-${total}-${offset}-${limit}`)

    return {
      success: true,
      data: {
        prizes: paginatedPrizes,
        total,
        limit,
        offset
      }
    }
  } catch (error) {
    console.error('Error fetching prizes:', error)
    
    return {
      success: false,
      error: 'Failed to fetch prizes',
      message: 'An error occurred while fetching prize data'
    }
  }
})