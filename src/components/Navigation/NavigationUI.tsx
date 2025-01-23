// src/components/Navigation/NavigationUI.tsx
import { useRef, useCallback } from 'react'

interface NavigationUIProps {
  onMove: (movement: { x: number; y: number }) => void
}

export function NavigationUI({ onMove }: NavigationUIProps) {
  const joystickRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const currentPositionRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    isDraggingRef.current = true
    dragStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current || !dragStartRef.current) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStartRef.current.x
    const deltaY = touch.clientY - dragStartRef.current.y
    
    const radius = 50
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const scale = distance > radius ? radius / distance : 1
    
    currentPositionRef.current = {
      x: deltaX * scale,
      y: deltaY * scale
    }

    onMove({
      x: (deltaX * scale) / radius,
      y: (deltaY * scale) / radius
    })

    if (joystickRef.current) {
      joystickRef.current.style.transform = `translate(${currentPositionRef.current.x}px, ${currentPositionRef.current.y}px)`
    }
  }, [onMove])

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false
    currentPositionRef.current = { x: 0, y: 0 }
    onMove({ x: 0, y: 0 })
    
    if (joystickRef.current) {
      joystickRef.current.style.transform = 'translate(0px, 0px)'
    }
  }, [onMove])

  return (
    <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full touch-none">
      <div 
        ref={joystickRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/40 backdrop-blur-md rounded-full cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  )
}