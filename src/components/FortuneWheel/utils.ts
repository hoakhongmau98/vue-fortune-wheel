/**
 * Utility functions for the FortuneWheel component
 * Optimized for SSR/SSG compatibility and performance
 */

/**
 * Split string into array based on length limit
 * @param str - Input string
 * @param length - Maximum length per line
 * @returns Array of strings or null if invalid input
 */
export function getStrArray(str: string, length: number): string[] | null {
  if (!str || typeof str !== 'string' || length <= 0) {
    return null
  }

  const result: string[] = []
  let currentLine = ''

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    
    if (currentLine.length >= length) {
      result.push(currentLine)
      currentLine = char
    } else {
      currentLine += char
    }
  }

  if (currentLine) {
    result.push(currentLine)
  }

  return result.length > 0 ? result : null
}

/**
 * Validate prize configuration
 * @param prizes - Array of prize configurations
 * @param useWeight - Whether to use weight-based selection
 * @returns Validation result
 */
export function validatePrizes(prizes: any[], useWeight: boolean = false): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  if (!Array.isArray(prizes) || prizes.length === 0) {
    errors.push('Prizes array must be a non-empty array')
    return { isValid: false, errors, warnings }
  }

  if (prizes.length < 2) {
    warnings.push('Wheel should have at least 2 prizes for better user experience')
  }

  if (prizes.length > 12) {
    warnings.push('Wheel with more than 12 prizes may affect performance and readability')
  }

  const total = useWeight 
    ? prizes.reduce((sum, prize) => sum + (prize.weight || 0), 0)
    : prizes.reduce((sum, prize) => sum + (prize.probability || 0), 0)

  if (useWeight) {
    if (total === 0) {
      errors.push('Total weight must be greater than 0')
    }
  } else {
    if (Math.abs(total - 100) > 0.01) {
      errors.push(`Total probability must equal 100%. Current total: ${total}%`)
    }
  }

  // Validate individual prizes
  prizes.forEach((prize, index) => {
    if (!prize || typeof prize !== 'object') {
      errors.push(`Prize at index ${index} must be an object`)
      return
    }

    if (!prize.id || typeof prize.id !== 'number' || prize.id <= 0) {
      errors.push(`Prize at index ${index} must have a valid positive numeric ID`)
    }

    if (!prize.value) {
      errors.push(`Prize at index ${index} must have a value`)
    }

    if (useWeight) {
      if (typeof prize.weight !== 'number' || prize.weight < 0) {
        errors.push(`Prize at index ${index} must have a valid non-negative weight`)
      }
    } else {
      if (typeof prize.probability !== 'number' || prize.probability < 0 || prize.probability > 100) {
        errors.push(`Prize at index ${index} must have a valid probability between 0 and 100`)
      }
    }

    // Canvas-specific validation
    if (prize.name && typeof prize.name !== 'string') {
      errors.push(`Prize at index ${index} name must be a string`)
    }

    if (prize.bgColor && !isValidColor(prize.bgColor)) {
      errors.push(`Prize at index ${index} bgColor must be a valid color`)
    }

    if (prize.color && !isValidColor(prize.color)) {
      errors.push(`Prize at index ${index} color must be a valid color`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Check if a string is a valid CSS color
 * @param color - Color string to validate
 * @returns True if valid color
 */
export function isValidColor(color: string): boolean {
  if (!color || typeof color !== 'string') {
    return false
  }

  // Create a temporary element to test the color
  const temp = document.createElement('div')
  temp.style.color = color
  return temp.style.color !== ''
}

/**
 * Generate random number between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 */
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Calculate angle for a prize based on its position
 * @param index - Prize index
 * @param totalPrizes - Total number of prizes
 * @returns Angle in degrees
 */
export function calculatePrizeAngle(index: number, totalPrizes: number): number {
  if (totalPrizes <= 0) return 0
  
  const segmentAngle = 360 / totalPrizes
  return (index * segmentAngle) + (segmentAngle / 2)
}

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Throttle function for performance optimization
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Check if running on client side
 * @returns True if on client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * Check if running on server side
 * @returns True if on server side
 */
export function isServer(): boolean {
  return !isClient()
}

/**
 * Safe DOM manipulation with SSR/SSG compatibility
 * @param callback - Function to execute on client side
 * @param fallback - Fallback value for server side
 * @returns Result of callback or fallback
 */
export function safeClientSide<T>(
  callback: () => T,
  fallback: T
): T {
  if (isClient()) {
    try {
      return callback()
    } catch (error) {
      console.warn('Client-side operation failed:', error)
      return fallback
    }
  }
  return fallback
}

/**
 * Format number with proper decimal places
 * @param num - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return Number(num).toFixed(decimals)
}

/**
 * Calculate percentage with proper rounding
 * @param value - Current value
 * @param total - Total value
 * @returns Percentage as number
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100 * 100) / 100
}

/**
 * Generate unique ID
 * @returns Unique ID string
 */
export function generateId(): string {
  return `wheel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Deep clone object (simple implementation)
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T
  }
  
  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  
  return cloned
}

/**
 * Check if two objects are deeply equal
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns True if objects are equal
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true
  
  if (obj1 === null || obj2 === null) return false
  if (typeof obj1 !== typeof obj2) return false
  if (typeof obj1 !== 'object') return false
  
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false
  
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  
  if (keys1.length !== keys2.length) return false
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false
    if (!deepEqual(obj1[key], obj2[key])) return false
  }
  
  return true
}