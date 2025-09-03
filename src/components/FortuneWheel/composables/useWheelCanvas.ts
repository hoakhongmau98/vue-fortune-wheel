import { ref, computed, onMounted, nextTick } from 'vue'
import { getStrArray } from '../utils'
import type { CanvasConfig, PrizeConfig, FortuneWheelProps } from '@/types/wheel'

const canvasDefaultConfig: CanvasConfig = {
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
}

export function useWheelCanvas(props: FortuneWheelProps, canvasRef: Ref<HTMLCanvasElement | undefined>) {
  const isClient = ref(false)

  const canvasConfig = computed(() => {
    return Object.assign({}, canvasDefaultConfig, props.canvas) as CanvasConfig
  })

  // Check if we're on the client side for SSR/SSG compatibility
  onMounted(() => {
    isClient.value = true
  })

  // Draw canvas with SSR/SSG safety
  function drawCanvas(): void {
    if (!isClient.value || !canvasRef.value) return

    const canvasEl = canvasRef.value as HTMLCanvasElement
    if (!canvasEl.getContext) return

    const { radius, textRadius, borderWidth, borderColor, fontSize } = canvasConfig.value
    
    // Calculate arc based on number of prizes
    const arc = Math.PI / (props.prizes.length / 2)
    const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D
    
    // Clear canvas
    ctx.clearRect(0, 0, radius * 2, radius * 2)
    
    // Set stroke style
    ctx.strokeStyle = borderColor || 'transparent'
    ctx.lineWidth = (borderWidth || 0) * 2
    
    // Set font
    ctx.font = `${fontSize}px 'Inter', Arial, sans-serif`
    
    // Draw each prize segment
    props.prizes.forEach((prize, index) => {
      const angle = index * arc - Math.PI / 2
      
      // Draw segment
      ctx.fillStyle = prize.bgColor || '#cccccc'
      ctx.beginPath()
      ctx.arc(radius, radius, radius - (borderWidth || 0), angle, angle + arc, false)
      ctx.stroke()
      ctx.arc(radius, radius, 0, angle + arc, angle, true)
      ctx.fill()
      
      // Save context for text drawing
      ctx.save()
      
      // Draw prize text
      if (prize.name) {
        ctx.fillStyle = prize.color || '#000000'
        ctx.translate(
          radius + Math.cos(angle + arc / 2) * textRadius,
          radius + Math.sin(angle + arc / 2) * textRadius
        )
        drawPrizeText(ctx, angle, arc, prize.name)
      }
      
      // Restore context
      ctx.restore()
    })
  }

  // Draw prize text with improved readability
  function drawPrizeText(ctx: CanvasRenderingContext2D, angle: number, arc: number, name: string): void {
    const { lineHeight, textLength, textDirection } = canvasConfig.value
    
    const content = getStrArray(name, textLength)
    if (!content) return
    
    // Set text alignment
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Rotate context for text direction
    if (textDirection === 'vertical') {
      ctx.rotate(angle + arc / 2 + Math.PI)
    } else {
      ctx.rotate(angle + arc / 2 + Math.PI / 2)
    }
    
    // Draw each line of text
    content.forEach((text, index) => {
      let textX = 0
      let textY = 0
      
      if (textDirection === 'vertical') {
        textX = 0
        textY = (index + 1) * lineHeight - content.length * lineHeight / 2
      } else {
        textX = 0
        textY = (index + 1) * lineHeight - content.length * lineHeight / 2
      }
      
      // Add text shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      
      ctx.fillText(text, textX, textY)
      
      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    })
  }

  // Redraw canvas when props change
  function redrawCanvas(): void {
    if (props.type === 'canvas') {
      nextTick(() => {
        drawCanvas()
      })
    }
  }

  // Optimized canvas rendering with requestAnimationFrame
  function optimizedDrawCanvas(): void {
    if (!isClient.value) return
    
    requestAnimationFrame(() => {
      drawCanvas()
    })
  }

  // Handle canvas resize
  function resizeCanvas(): void {
    if (!isClient.value || !canvasRef.value) return
    
    const canvasEl = canvasRef.value as HTMLCanvasElement
    const { radius } = canvasConfig.value
    
    // Set canvas size
    canvasEl.width = radius * 2
    canvasEl.height = radius * 2
    
    // Redraw after resize
    drawCanvas()
  }

  // Export canvas as image
  function exportCanvas(): string | null {
    if (!isClient.value || !canvasRef.value) return null
    
    const canvasEl = canvasRef.value as HTMLCanvasElement
    return canvasEl.toDataURL('image/png')
  }

  // Get canvas context for external manipulation
  function getCanvasContext(): CanvasRenderingContext2D | null {
    if (!isClient.value || !canvasRef.value) return null
    
    const canvasEl = canvasRef.value as HTMLCanvasElement
    return canvasEl.getContext('2d')
  }

  return {
    canvasConfig,
    drawCanvas,
    redrawCanvas,
    optimizedDrawCanvas,
    resizeCanvas,
    exportCanvas,
    getCanvasContext,
    isClient
  }
}