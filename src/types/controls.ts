import { MutableRefObject } from 'react';

export interface MovementRef {
  x: number;
  y: number;
}

export interface ControlsProps {
  movementRef: MutableRefObject<MovementRef>;
  onLock?: () => void;
  onUnlock?: () => void;
}