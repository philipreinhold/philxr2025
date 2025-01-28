// src/config/viewer.config.ts
export const VIEWER_CONFIG = {
    camera: {
      position: [0, 1.7, 10] as [number, number, number],
      fov: 75,
      near: 0.1,
      far: 100,
    },
    controls: {
      movement: {
        speed: 0.15,
        dampening: 0.1,
      },
      rotation: {
        speed: 0.05,
        maxPitch: Math.PI / 2.5, // Maximum up/down angle
      },
      touch: {
        joystickSize: 24,
        maxOffset: 20,
        damping: 0.15,
      },
    },
    deviceOrientation: {
      heightOffset: 1.7, // Eye level
    },
    messages: {
      httpsRequired: 'Device orientation requires HTTPS',
      orientationEnabled: 'Device orientation enabled! Move your device to look around.',
      orientationError: 'Could not enable device orientation. Please check your device settings.',
    },
  } as const;
  
  export const CONTROL_KEYS = {
    movement: ['w', 'a', 's', 'd'],
    rotation: ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'],
    exit: ['Escape'],
  } as const;