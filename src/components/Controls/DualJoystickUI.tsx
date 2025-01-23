// src/components/Controls/DualJoystickUI.tsx
import { useRef, useCallback, useEffect } from 'react';

interface DualJoystickUIProps {
  onMove: (movement: { x: number; y: number }) => void;
  onLook: (rotation: { x: number; y: number }) => void;
}

export function DualJoystickUI({ onMove, onLook }: DualJoystickUIProps) {
  const leftJoystickRef = useRef<HTMLDivElement>(null);
  const rightJoystickRef = useRef<HTMLDivElement>(null);
  const leftStartRef = useRef<{ x: number; y: number } | null>(null);
  const rightStartRef = useRef<{ x: number; y: number } | null>(null);
  const leftActiveRef = useRef(false);
  const rightActiveRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent, isLeft: boolean) => {
    e.preventDefault();
    const pos = 'touches' in e ? e.touches[0] : e;
    const position = { x: pos.clientX, y: pos.clientY };
    
    if (isLeft) {
      leftStartRef.current = position;
      leftActiveRef.current = true;
    } else {
      rightStartRef.current = position;
      rightActiveRef.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent, isLeft: boolean) => {
    e.preventDefault();
    if (!((isLeft && leftActiveRef.current) || (!isLeft && rightActiveRef.current))) return;

    const pos = 'touches' in e ? e.touches[0] : e;
    const startPos = isLeft ? leftStartRef.current : rightStartRef.current;
    
    if (!startPos) return;

    const deltaX = (pos.clientX - startPos.x) / 50; // Sensitivität
    const deltaY = (pos.clientY - startPos.y) / 50;

    if (isLeft) {
      onMove({ x: deltaX, y: deltaY });
    } else {
      onLook({ x: deltaX, y: deltaY });
    }
  }, [onMove, onLook]);

  const handleTouchEnd = useCallback((isLeft: boolean) => {
    if (isLeft) {
      leftStartRef.current = null;
      leftActiveRef.current = false;
      onMove({ x: 0, y: 0 });
    } else {
      rightStartRef.current = null;
      rightActiveRef.current = false;
      onLook({ x: 0, y: 0 });
    }
  }, [onMove, onLook]);

  const handleMouseUp = useCallback(() => {
    if (leftActiveRef.current) handleTouchEnd(true);
    if (rightActiveRef.current) handleTouchEnd(false);
  }, [handleTouchEnd]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (leftActiveRef.current) handleTouchMove(e as any, true);
      if (rightActiveRef.current) handleTouchMove(e as any, false);
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleTouchMove, handleMouseUp]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto px-4">
      {/* Linker Joystick - Bewegung */}
      <div 
        ref={leftJoystickRef}
        className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full relative 
                 cursor-pointer touch-none select-none"
        onMouseDown={(e) => handleTouchStart(e, true)}
        onTouchStart={(e) => handleTouchStart(e, true)}
        onTouchMove={(e) => handleTouchMove(e, true)}
        onTouchEnd={() => handleTouchEnd(true)}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-12 h-12 bg-white/40 backdrop-blur-md rounded-full" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                       text-xs text-black/60">Move</span>
      </div>

      {/* Rechter Joystick - Umsehen */}
      <div 
        ref={rightJoystickRef}
        className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full relative 
                 cursor-pointer touch-none select-none"
        onMouseDown={(e) => handleTouchStart(e, false)}
        onTouchStart={(e) => handleTouchStart(e, false)}
        onTouchMove={(e) => handleTouchMove(e, false)}
        onTouchEnd={() => handleTouchEnd(false)}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-12 h-12 bg-white/40 backdrop-blur-md rounded-full" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                       text-xs text-black/60">Look</span>
      </div>
    </div>
  );
}