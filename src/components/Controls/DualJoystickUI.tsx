// DualJoystickUI.tsx
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
 const keysPressed = useRef<Set<string>>(new Set());
 const arrowKeysPressed = useRef<Set<string>>(new Set());
 const lookVelocity = useRef({ x: 0, y: 0 });
 
 const DAMPING = 0.15;
 const MAX_OFFSET = 20;
 const LOOK_ACCELERATION = 0.008;
 const LOOK_DECELERATION = 0.92;
 const MAX_LOOK_VELOCITY = 0.15;

 const updateStickPosition = useCallback((currentPos: { x: number; y: number }, 
   startPos: { x: number; y: number }, 
   isLeft: boolean) => {
     const knobRef = isLeft ? leftKnobRef.current : rightKnobRef.current;
     if (!knobRef) return { x: 0, y: 0 };

     let deltaX = currentPos.x - startPos.x;
     let deltaY = currentPos.y - startPos.y;
     
     const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
     if (length > MAX_OFFSET) {
       const scale = MAX_OFFSET / length;
       deltaX *= scale;
       deltaY *= scale;
     }

     knobRef.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;

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
     lookVelocity.current = { x: 0, y: 0 };
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
     lookVelocity.current = movement;
   }
 }, [onMove, onLook, updateStickPosition]);

 const resetStick = useCallback((isLeft: boolean) => {
   const knobRef = isLeft ? leftKnobRef.current : rightKnobRef.current;
   if (knobRef) {
     knobRef.style.transform = 'translate(-50%, -50%)';
   }
   if (!isLeft) {
     lookVelocity.current = { x: 0, y: 0 };
   }
 }, []);

 const handleTouchEnd = useCallback((isLeft: boolean) => {
   if (isLeft) {
     leftStartRef.current = null;
     leftActiveRef.current = false;
     if (keysPressed.current.size === 0) {
       onMove({ x: 0, y: 0 });
     }
   } else {
     rightStartRef.current = null;
     rightActiveRef.current = false;
     if (arrowKeysPressed.current.size === 0) {
       lookVelocity.current = { x: 0, y: 0 };
       onLook({ x: 0, y: 0 });
     }
   }
   resetStick(isLeft);
 }, [onMove, onLook, resetStick]);

 useEffect(() => {
   const handleKeyDown = (e: KeyboardEvent) => {
     const key = e.key.toLowerCase();
     if (['w', 'a', 's', 'd'].includes(key)) {
       keysPressed.current.add(key);
       updateMovementFromKeys();
     } else if (['arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
       arrowKeysPressed.current.add(key);
       if (!rightActiveRef.current) {
         updateLookFromKeys();
       }
     }
   };

   const handleKeyUp = (e: KeyboardEvent) => {
     const key = e.key.toLowerCase();
     if (['w', 'a', 's', 'd'].includes(key)) {
       keysPressed.current.delete(key);
       if (keysPressed.current.size === 0 && !leftActiveRef.current) {
         onMove({ x: 0, y: 0 });
         resetStick(true);
       } else {
         updateMovementFromKeys();
       }
     } else if (['arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
       arrowKeysPressed.current.delete(key);
       if (arrowKeysPressed.current.size === 0) {
         lookVelocity.current = { x: 0, y: 0 };
         onLook({ x: 0, y: 0 });
         resetStick(false);
       }
     }
   };

   const updateMovementFromKeys = () => {
     if (leftActiveRef.current) return;
     
     let x = 0;
     let y = 0;
     
     if (keysPressed.current.has('w')) y -= 1;
     if (keysPressed.current.has('s')) y += 1;
     if (keysPressed.current.has('a')) x -= 1;
     if (keysPressed.current.has('d')) x += 1;

     if (x !== 0 && y !== 0) {
       const length = Math.sqrt(x * x + y * y);
       x /= length;
       y /= length;
     }

     x *= DAMPING;
     y *= DAMPING;

     onMove({ x, y });

     if (leftKnobRef.current) {
       leftKnobRef.current.style.transform = 
         `translate(calc(-50% + ${x * (MAX_OFFSET / DAMPING)}px), calc(-50% + ${y * (MAX_OFFSET / DAMPING)}px))`;
     }
   };

   const updateLookFromKeys = () => {
     if (rightActiveRef.current) return;
     
     let targetX = 0;
     let targetY = 0;
     
     if (arrowKeysPressed.current.has('arrowup')) targetY -= 1;
     if (arrowKeysPressed.current.has('arrowdown')) targetY += 1;
     if (arrowKeysPressed.current.has('arrowleft')) targetX -= 1;
     if (arrowKeysPressed.current.has('arrowright')) targetX += 1;

     lookVelocity.current.x += (targetX * LOOK_ACCELERATION);
     lookVelocity.current.y += (targetY * LOOK_ACCELERATION);

     lookVelocity.current.x *= LOOK_DECELERATION;
     lookVelocity.current.y *= LOOK_DECELERATION;

     lookVelocity.current.x = Math.max(-MAX_LOOK_VELOCITY, Math.min(MAX_LOOK_VELOCITY, lookVelocity.current.x));
     lookVelocity.current.y = Math.max(-MAX_LOOK_VELOCITY, Math.min(MAX_LOOK_VELOCITY, lookVelocity.current.y));

     if (Math.abs(lookVelocity.current.x) < 0.001) lookVelocity.current.x = 0;
     if (Math.abs(lookVelocity.current.y) < 0.001) lookVelocity.current.y = 0;

     onLook(lookVelocity.current);

     if (rightKnobRef.current) {
       rightKnobRef.current.style.transform = 
         `translate(calc(-50% + ${lookVelocity.current.x * (MAX_OFFSET / DAMPING)}px), 
                   calc(-50% + ${lookVelocity.current.y * (MAX_OFFSET / DAMPING)}px))`;
     }
   };

   window.addEventListener('keydown', handleKeyDown);
   window.addEventListener('keyup', handleKeyUp);

   const animate = () => {
     if (!rightActiveRef.current) {
       updateLookFromKeys();
     }
     requestAnimationFrame(animate);
   };
   const animationId = requestAnimationFrame(animate);

   return () => {
     window.removeEventListener('keydown', handleKeyDown);
     window.removeEventListener('keyup', handleKeyUp);
     cancelAnimationFrame(animationId);
   };
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
     <div 
       ref={leftJoystickRef}
       className="w-24 h-24 rounded-full relative cursor-pointer touch-none select-none"
       style={{ backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
       onMouseDown={(e) => handleTouchStart(e, true)}
       onTouchStart={(e) => handleTouchStart(e, true)}
       onTouchMove={(e) => handleTouchMove(e, true)}
       onTouchEnd={() => handleTouchEnd(true)}
     >
       <div className="absolute w-full h-full pointer-events-none">
         <span className="absolute top-2 left-1/2 -translate-x-1/2 text-white text-xs font-light opacity-70">W</span>
         <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-xs font-light opacity-70">A</span>
         <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xs font-light opacity-70">S</span>
         <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-light opacity-70">D</span>
       </div>
       
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

     <div 
       ref={rightJoystickRef}
       className="w-24 h-24 rounded-full relative cursor-pointer touch-none select-none"
       style={{ backgroundColor: 'rgba(251, 146, 60, 0.2)' }}
       onMouseDown={(e) => handleTouchStart(e, false)}
       onTouchStart={(e) => handleTouchStart(e, false)}
       onTouchMove={(e) => handleTouchMove(e, false)}
       onTouchEnd={() => handleTouchEnd(false)}
     >
       <div className="absolute w-full h-full pointer-events-none">
         <span className="absolute top-2 left-1/2 -translate-x-1/2 text-white text-xs opacity-70">↑</span>
         <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-xs opacity-70">←</span>
         <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xs opacity-70">↓</span>
         <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs opacity-70">→</span>
       </div>

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