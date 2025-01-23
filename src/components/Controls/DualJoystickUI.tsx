// src/components/Controls/DualJoystickUI.tsx
import { useRef, useCallback, useEffect } from 'react';

interface DualJoystickUIProps {
  onMove: (movement: { x: number; y: number }) => void;
  onLook: (rotation: { x: number; y: number }) => void;
}

export function DualJoystickUI({ onMove, onLook }: DualJoystickUIProps) {
  const leftJoystickRef = useRef<HTMLDivElement>(null);
  const rightJoystickRef = useRef<HTMLDivElement>(null);
  const leftKnobRef = useRef<HTMLDivElement>(null);
  const rightKnobRef = useRef<HTMLDivElement>(null);
  const leftStartRef = useRef<{ x: number; y: number } | null>(null);
  const rightStartRef = useRef<{ x: number; y: number } | null>(null);
  const leftActiveRef = useRef(false);
  const rightActiveRef = useRef(false);
  
  // Konstanten
  const DAMPING = 0.15;
  const MAX_OFFSET = 20;

  const updateStickPosition = useCallback((currentPos: { x: number; y: number }, 
                                        startPos: { x: number; y: number }, 
                                        isLeft: boolean) => {
    const knobRef = isLeft ? leftKnobRef.current : rightKnobRef.current;
    if (!knobRef) return { x: 0, y: 0 };

    // Berechne den Versatz
    let deltaX = currentPos.x - startPos.x;
    let deltaY = currentPos.y - startPos.y;
    
    // Begrenze den maximalen Versatz
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (length > MAX_OFFSET) {
      const scale = MAX_OFFSET / length;
      deltaX *= scale;
      deltaY *= scale;
    }

    // Aktualisiere die Position direkt über style.transform
    knobRef.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;

    // Gib gedämpfte Werte für die Steuerung zurück
    return {
      x: (deltaX / MAX_OFFSET) * DAMPING,
      y: (deltaY / MAX_OFFSET) * DAMPING
    };
  }, []);

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

    const movement = updateStickPosition({ x: pos.clientX, y: pos.clientY }, startPos, isLeft);

    if (isLeft) {
      onMove(movement);
    } else {
      onLook(movement);
    }
  }, [onMove, onLook, updateStickPosition]);

  const resetStick = useCallback((isLeft: boolean) => {
    const knobRef = isLeft ? leftKnobRef.current : rightKnobRef.current;
    if (knobRef) {
      knobRef.style.transform = 'translate(-50%, -50%)';
    }
  }, []);

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
    resetStick(isLeft);
  }, [onMove, onLook, resetStick]);

  const handleMouseUp = useCallback(() => {
    if (leftActiveRef.current) handleTouchEnd(true);
    if (rightActiveRef.current) handleTouchEnd(false);
  }, [handleTouchEnd]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (leftActiveRef.current) handleTouchMove(e as any, true);
      if (rightActiveRef.current) handleTouchMove(e as any, false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleTouchMove, handleMouseUp]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto px-4">
      {/* Move Joystick - Lila */}
      <div 
        ref={leftJoystickRef}
        className="w-24 h-24 rounded-full relative cursor-pointer touch-none select-none"
        style={{ backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
        onMouseDown={(e) => handleTouchStart(e, true)}
        onTouchStart={(e) => handleTouchStart(e, true)}
        onTouchMove={(e) => handleTouchMove(e, true)}
        onTouchEnd={() => handleTouchEnd(true)}
      >
        <div 
          ref={leftKnobRef}
          className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full transition-transform duration-75"
          style={{ 
            backgroundColor: 'rgba(147, 51, 234, 0.4)',
            transform: 'translate(-50%, -50%)'
          }}
        />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                       text-xs text-black/60">Move</span>
      </div>

      {/* Look Joystick - Orange */}
      <div 
        ref={rightJoystickRef}
        className="w-24 h-24 rounded-full relative cursor-pointer touch-none select-none"
        style={{ backgroundColor: 'rgba(251, 146, 60, 0.2)' }}
        onMouseDown={(e) => handleTouchStart(e, false)}
        onTouchStart={(e) => handleTouchStart(e, false)}
        onTouchMove={(e) => handleTouchMove(e, false)}
        onTouchEnd={() => handleTouchEnd(false)}
      >
        <div 
          ref={rightKnobRef}
          className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full transition-transform duration-75"
          style={{ 
            backgroundColor: 'rgba(251, 146, 60, 0.4)',
            transform: 'translate(-50%, -50%)'
          }}
        />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                       text-xs text-black/60">Look</span>
      </div>
    </div>
  );
}