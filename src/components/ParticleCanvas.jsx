import { useEffect, useRef } from 'react'

export function ParticleCanvas({ season = 'spring', enabled = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle settings depending on active season
    const count = season === 'winter' ? 65 : season === 'spring' ? 45 : season === 'autumn' ? 35 : 25
    const particles = []

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 2,
        speedX: Math.random() * 1.5 - 0.5 + (season === 'spring' ? 0.8 : season === 'autumn' ? 0.5 : 0),
        speedY: Math.random() * 1.5 + 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.6 + 0.2,
        size: Math.random() * 8 + 6,
        swing: Math.random() * 2,
        swingSpeed: Math.random() * 0.02 + 0.01,
        swingStep: Math.random() * Math.PI * 2,
      })
    }

    const drawSakuraPetal = (x, y, size, rotation, opacity) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(-size / 2, -size / 2, -size / 2, -size, 0, -size * 1.3)
      ctx.bezierCurveTo(size / 2, -size, size / 2, -size / 2, 0, 0)
      ctx.fillStyle = `rgba(253, 164, 175, ${opacity * 0.75})`
      ctx.fill()
      ctx.restore()
    }

    const drawMomijiLeaf = (x, y, size, rotation, opacity) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(234, 88, 12, ${opacity * 0.7})`
      ctx.fill()
      ctx.restore()
    }

    const drawFirefly = (x, y, size, opacity) => {
      ctx.save()
      const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5)
      glow.addColorStop(0, `rgba(254, 240, 138, ${opacity})`)
      glow.addColorStop(0.5, `rgba(245, 158, 11, ${opacity * 0.4})`)
      glow.addColorStop(1, 'rgba(245, 158, 11, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(x, y, size * 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawSnowflake = (x, y, radius, opacity) => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(224, 242, 254, ${opacity * 0.85})`
      ctx.shadowBlur = 4
      ctx.shadowColor = 'rgba(186, 230, 253, 0.8)'
      ctx.fill()
      ctx.restore()
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        p.swingStep += p.swingSpeed
        const currentX = p.x + Math.sin(p.swingStep) * (p.swing * 12)
        p.y += p.speedY
        p.x += p.speedX
        p.rotation += p.rotationSpeed

        if (p.y > height + 20) {
          p.y = -20
          p.x = Math.random() * width
        }
        if (p.x > width + 20) {
          p.x = -20
        } else if (p.x < -20) {
          p.x = width + 20
        }

        if (season === 'spring') {
          drawSakuraPetal(currentX, p.y, p.size, p.rotation, p.opacity)
        } else if (season === 'autumn') {
          drawMomijiLeaf(currentX, p.y, p.size, p.rotation, p.opacity)
        } else if (season === 'summer') {
          drawFirefly(currentX, p.y, p.radius, p.opacity)
        } else {
          drawSnowflake(currentX, p.y, p.radius, p.opacity)
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [season, enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas fixed inset-0 pointer-events-none z-0 opacity-70"
      aria-hidden="true"
    />
  )
}
