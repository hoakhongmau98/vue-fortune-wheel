import { computed } from 'vue'
import type { FortuneWheelProps, PrizeConfig } from '@/types/wheel'

export function useWheelAccessibility(
  props: FortuneWheelProps,
  isRotating: Ref<boolean>,
  currentPrize: Ref<PrizeConfig | null>
) {
  // Generate unique ID for button description
  const buttonDescriptionId = computed(() => `wheel-button-desc-${Date.now()}`)

  // Button ARIA label
  const buttonAriaLabel = computed(() => {
    if (isRotating.value) {
      return 'Wheel is spinning, please wait'
    }
    
    if (props.disabled) {
      return 'Wheel is disabled'
    }
    
    return `Spin the wheel to win a prize. ${props.prizes.length} prizes available.`
  })

  // Button description for screen readers
  const buttonDescription = computed(() => {
    if (isRotating.value) {
      return 'The wheel is currently spinning. Please wait for it to stop.'
    }
    
    if (props.disabled) {
      return 'The wheel is currently disabled and cannot be spun.'
    }
    
    const prizeList = props.prizes.map(prize => 
      `${prize.name || prize.value} (${props.useWeight ? prize.weight : prize.probability}%)`
    ).join(', ')
    
    return `Click to spin the wheel. Available prizes: ${prizeList}`
  })

  // Wheel status for screen readers
  const wheelStatus = computed(() => {
    if (isRotating.value) {
      return 'Wheel is spinning...'
    }
    
    if (currentPrize.value) {
      const prizeName = currentPrize.value.name || currentPrize.value.value
      return `You won: ${prizeName}`
    }
    
    return 'Wheel is ready to spin'
  })

  // Prize list for screen readers
  const prizeListAriaLabel = computed(() => {
    const prizeCount = props.prizes.length
    const prizeNames = props.prizes.map(prize => 
      prize.name || prize.value
    ).join(', ')
    
    return `Wheel of Fortune with ${prizeCount} prizes: ${prizeNames}`
  })

  // Probability information for screen readers
  const probabilityInfo = computed(() => {
    if (props.useWeight) {
      const totalWeight = props.prizes.reduce((sum, prize) => sum + (prize.weight || 0), 0)
      return `Total weight: ${totalWeight}. Prizes are selected based on weight values.`
    } else {
      const totalProbability = props.prizes.reduce((sum, prize) => sum + (prize.probability || 0), 0)
      return `Total probability: ${totalProbability}%. Each prize has a specific probability of being won.`
    }
  })

  // Keyboard navigation instructions
  const keyboardInstructions = computed(() => {
    return 'Use Enter or Space key to spin the wheel. Use Tab to navigate between interactive elements.'
  })

  // Live region announcements
  const liveAnnouncements = computed(() => ({
    spinning: 'Wheel is spinning...',
    stopped: currentPrize.value 
      ? `Wheel stopped. You won: ${currentPrize.value.name || currentPrize.value.value}`
      : 'Wheel stopped spinning.',
    disabled: 'Wheel is currently disabled.',
    ready: 'Wheel is ready to spin.'
  }))

  // Focus management
  const focusableElements = computed(() => ({
    wheel: 'wheel-region',
    button: 'spin-button',
    prizes: 'prize-list'
  }))

  // High contrast mode support
  const highContrastStyles = computed(() => ({
    wheel: {
      border: '2px solid currentColor',
      outline: '2px solid currentColor',
      outlineOffset: '2px'
    },
    button: {
      border: '3px solid currentColor',
      backgroundColor: 'currentColor',
      color: 'Canvas'
    }
  }))

  // Reduced motion support
  const reducedMotionStyles = computed(() => ({
    wheel: {
      transition: 'none',
      animation: 'none'
    },
    button: {
      transition: 'none',
      transform: 'none'
    }
  }))

  // Generate accessibility attributes
  const accessibilityAttributes = computed(() => ({
    wheel: {
      role: 'region',
      'aria-label': prizeListAriaLabel.value,
      'aria-live': isRotating.value ? 'polite' : 'off',
      'aria-describedby': buttonDescriptionId.value
    },
    button: {
      role: 'button',
      'aria-label': buttonAriaLabel.value,
      'aria-describedby': buttonDescriptionId.value,
      'aria-pressed': isRotating.value,
      'aria-disabled': props.disabled,
      tabindex: props.disabled ? -1 : 0
    },
    prizes: {
      role: 'list',
      'aria-label': 'Available prizes'
    }
  }))

  // Screen reader announcements
  function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    // Create or get existing live region
    let liveRegion = document.getElementById('sr-live-region')
    
    if (!liveRegion) {
      liveRegion = document.createElement('div')
      liveRegion.id = 'sr-live-region'
      liveRegion.setAttribute('aria-live', priority)
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.className = 'sr-only'
      document.body.appendChild(liveRegion)
    }
    
    // Update the live region
    liveRegion.textContent = message
  }

  // Announce wheel state changes
  function announceWheelState(): void {
    if (isRotating.value) {
      announceToScreenReader(liveAnnouncements.value.spinning)
    } else if (currentPrize.value) {
      announceToScreenReader(liveAnnouncements.value.stopped)
    } else if (props.disabled) {
      announceToScreenReader(liveAnnouncements.value.disabled)
    } else {
      announceToScreenReader(liveAnnouncements.value.ready)
    }
  }

  // Handle keyboard navigation
  function handleKeyboardNavigation(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        // Trigger spin action
        break
      case 'Escape':
        // Cancel current action if applicable
        break
      case 'Tab':
        // Allow default tab behavior
        break
      default:
        // Ignore other keys
        break
    }
  }

  // Focus management
  function focusWheel(): void {
    const wheelElement = document.getElementById(focusableElements.value.wheel)
    if (wheelElement) {
      wheelElement.focus()
    }
  }

  function focusButton(): void {
    const buttonElement = document.getElementById(focusableElements.value.button)
    if (buttonElement) {
      buttonElement.focus()
    }
  }

  return {
    // Computed properties
    buttonAriaLabel,
    buttonDescription,
    buttonDescriptionId,
    wheelStatus,
    prizeListAriaLabel,
    probabilityInfo,
    keyboardInstructions,
    liveAnnouncements,
    focusableElements,
    highContrastStyles,
    reducedMotionStyles,
    accessibilityAttributes,
    
    // Methods
    announceToScreenReader,
    announceWheelState,
    handleKeyboardNavigation,
    focusWheel,
    focusButton
  }
}