export interface MovementRef {
    x: number;
    y: number;
  }
  
  export interface ControlsProps {
    movementRef: React.MutableRefObject<MovementRef>;
    onLock?: () => void;
    onUnlock?: () => void;
  }