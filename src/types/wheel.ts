// Base prize configuration interface
export interface PrizeConfigBase {
  id: number
  value: any
  [propName: string]: any
}

// Canvas-specific prize configuration
export interface PrizeConfigBaseCanvas extends PrizeConfigBase {
  name: string
  bgColor: string
  color: string
}

// Probability-based prize configuration
export interface PrizeConfigProbability extends PrizeConfigBase {
  probability: number
}

// Probability-based canvas prize configuration
export interface PrizeConfigProbabilityCanvas extends PrizeConfigBaseCanvas {
  probability: number
}

// Weight-based prize configuration
export interface PrizeConfigWeight extends PrizeConfigBase {
  weight: number
}

// Weight-based canvas prize configuration
export interface PrizeConfigWeightCanvas extends PrizeConfigBaseCanvas {
  weight: number
}

// Union type for all prize configurations
export type PrizeConfig = 
  | PrizeConfigProbability 
  | PrizeConfigWeight 
  | PrizeConfigProbabilityCanvas 
  | PrizeConfigWeightCanvas

// Canvas configuration interface
export interface CanvasConfig {
  radius?: number
  textRadius?: number
  textLength?: number
  textDirection?: 'horizontal' | 'vertical'
  lineHeight?: number
  borderWidth?: number
  borderColor?: string
  btnText?: string
  btnWidth?: number
  fontSize?: number
}

// Wheel configuration interface
export interface WheelConfig {
  type: 'canvas' | 'image'
  useWeight: boolean
  disabled: boolean
  verify: boolean
  duration: number
  timingFun: string
  angleBase: number
}

// History entry interface
export interface HistoryEntry {
  id: number
  timestamp: string
  prizeId: number
  prize: PrizeConfig | null
}

// Statistics interface
export interface WheelStatistics {
  totalSpins: number
  prizesWon: Record<number, number>
}

// Main wheel state interface
export interface WheelState {
  isRotating: boolean
  currentPrizeId: number
  selectedPrizeId: number
  prizes: PrizeConfig[]
  canvasConfig: CanvasConfig
  wheelConfig: WheelConfig
  history: HistoryEntry[]
  statistics: WheelStatistics
}

// Props interface for the FortuneWheel component
export interface FortuneWheelProps {
  type?: 'canvas' | 'image'
  useWeight?: boolean
  disabled?: boolean
  verify?: boolean
  canvas?: Partial<CanvasConfig>
  duration?: number
  timingFun?: string
  angleBase?: number
  prizeId?: number
  prizes: PrizeConfig[]
}

// Events interface for the FortuneWheel component
export interface FortuneWheelEvents {
  rotateStart: (callback?: () => void) => void
  rotateEnd: (prize: PrizeConfig) => void
}

// API response interfaces
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PrizeApiResponse extends ApiResponse {
  data?: {
    prizes: PrizeConfig[]
    total: number
  }
}

export interface SpinApiResponse extends ApiResponse {
  data?: {
    prize: PrizeConfig
    spinId: string
    timestamp: string
  }
}

// Server-side rendering interfaces
export interface SSRContext {
  prizes?: PrizeConfig[]
  canvasConfig?: CanvasConfig
  wheelConfig?: WheelConfig
}

// Client-side hydration interfaces
export interface HydrationData {
  prizes: PrizeConfig[]
  canvasConfig: CanvasConfig
  wheelConfig: WheelConfig
  statistics: WheelStatistics
}

// Performance metrics interface
export interface PerformanceMetrics {
  timeToFirstByte: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

// Accessibility interface
export interface AccessibilityConfig {
  enableScreenReader: boolean
  enableKeyboardNavigation: boolean
  enableHighContrast: boolean
  enableReducedMotion: boolean
}

// Theme configuration interface
export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
}

// Animation configuration interface
export interface AnimationConfig {
  duration: number
  easing: string
  enableReducedMotion: boolean
  customEasing?: string
}

// Validation interfaces
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface PrizeValidationResult extends ValidationResult {
  prizeId?: number
}

// Error handling interfaces
export interface WheelError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// Configuration interfaces for different environments
export interface DevelopmentConfig {
  enableDebugMode: boolean
  enablePerformanceMonitoring: boolean
  enableErrorReporting: boolean
}

export interface ProductionConfig {
  enableAnalytics: boolean
  enableErrorTracking: boolean
  enablePerformanceMonitoring: boolean
  enableCaching: boolean
}

// Export all interfaces for easy importing
export type {
  PrizeConfig,
  CanvasConfig,
  WheelConfig,
  WheelState,
  FortuneWheelProps,
  FortuneWheelEvents,
  ApiResponse,
  PrizeApiResponse,
  SpinApiResponse,
  SSRContext,
  HydrationData,
  PerformanceMetrics,
  AccessibilityConfig,
  ThemeConfig,
  AnimationConfig,
  ValidationResult,
  PrizeValidationResult,
  WheelError,
  DevelopmentConfig,
  ProductionConfig
}