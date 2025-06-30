import { useEffect, useRef } from 'react'

interface LogoProps {
  size?: number
  className?: string
}

export const Logo = ({ size = 40, className = '' }: LogoProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar canvas
    canvas.width = size
    canvas.height = size
    ctx.scale(size / 100, size / 100) // Escalar para 100x100 base

    // Limpar canvas
    ctx.clearRect(0, 0, 100, 100)

    // Gradiente de fundo
    const gradient = ctx.createLinearGradient(0, 0, 100, 100)
    gradient.addColorStop(0, '#8B5CF6') // Roxo
    gradient.addColorStop(1, '#EC4899') // Rosa

    // Círculo de fundo
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(50, 50, 45, 0, 2 * Math.PI)
    ctx.fill()

    // Círculo interno (relógio)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.arc(50, 50, 35, 0, 2 * Math.PI)
    ctx.fill()

    // Ponteiros do relógio
    ctx.strokeStyle = '#8B5CF6'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'

    // Ponteiro das horas (12h)
    ctx.beginPath()
    ctx.moveTo(50, 50)
    ctx.lineTo(50, 25)
    ctx.stroke()

    // Ponteiro dos minutos (3h)
    ctx.beginPath()
    ctx.moveTo(50, 50)
    ctx.lineTo(70, 50)
    ctx.stroke()

    // Centro do relógio
    ctx.fillStyle = '#8B5CF6'
    ctx.beginPath()
    ctx.arc(50, 50, 4, 0, 2 * Math.PI)
    ctx.fill()

    // Check mark pequeno (indicando ponto registrado)
    ctx.strokeStyle = '#10B981' // Verde
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(75, 25)
    ctx.lineTo(80, 30)
    ctx.lineTo(85, 20)
    ctx.stroke()

    // Pontos do relógio
    ctx.fillStyle = '#8B5CF6'
    ctx.beginPath()
    ctx.arc(50, 20, 1.5, 0, 2 * Math.PI) // 12h
    ctx.fill()
    ctx.beginPath()
    ctx.arc(80, 50, 1.5, 0, 2 * Math.PI) // 3h
    ctx.fill()
    ctx.beginPath()
    ctx.arc(50, 80, 1.5, 0, 2 * Math.PI) // 6h
    ctx.fill()
    ctx.beginPath()
    ctx.arc(20, 50, 1.5, 0, 2 * Math.PI) // 9h
    ctx.fill()

  }, [size])

  return (
    <canvas
      ref={canvasRef}
      className={`${className}`}
      style={{ display: 'block' }}
    />
  )
} 