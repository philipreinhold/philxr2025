// src/App.tsx
import { Canvas } from '@react-three/fiber'
import { Suspense, useRef, useState, useCallback, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { 
 World, 
 Interface,
 About,
 Contact,
 Projects,
 Services
} from './components'
import { DualJoystickUI } from './components/Controls/DualJoystickUI'
import { MobileCameraControls } from './components/Controls/MobileCameraControls'
import { DeviceOrientationControls } from './components/Controls/DeviceOrientationControls'

declare global {
 interface DeviceOrientationEvent {
   requestPermission?: () => Promise<'granted' | 'denied'>
 }
 interface Window {
   isSecureContext: boolean
 }
}

function App() {
 const location = useLocation()
 const movementRef = useRef({ x: 0, y: 0 })
 const lookRef = useRef({ x: 0, y: 0 })
 const [isLocked, setIsLocked] = useState(false)
 const [isMobile, setIsMobile] = useState(false)
 const [useDeviceOrientation, setUseDeviceOrientation] = useState(false)
 const [showControls, setShowControls] = useState(false)

 useEffect(() => {
   const checkMobile = () => {
     const isTouchDevice = 
       'ontouchstart' in window || 
       navigator.maxTouchPoints > 0
     setIsMobile(isTouchDevice)
   }

   checkMobile()
   window.addEventListener('resize', checkMobile)
   return () => window.removeEventListener('resize', checkMobile)
 }, [])

 const requestOrientationPermission = async () => {
   if (!window.isSecureContext) {
     alert('Device orientation requires HTTPS')
     return
   }

   const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

   try {
     if (isIOS && typeof DeviceOrientationEvent.requestPermission === 'function') {
       const permission = await DeviceOrientationEvent.requestPermission()
       setUseDeviceOrientation(permission === 'granted')
       if (permission === 'granted') {
         alert('Device orientation enabled! Move your device to look around.')
       }
     } else {
       setUseDeviceOrientation(true)
       alert('Device orientation enabled! Move your device to look around.')
     }
   } catch (error) {
     console.error('Error requesting orientation permission:', error)
     alert('Could not enable device orientation. Please check your device settings.')
   }
 }

 const handleStartExploring = useCallback(async () => {
   setIsLocked(true)
   setShowControls(true)
   if (isMobile) await requestOrientationPermission()
 }, [isMobile])

 const handleStopExploring = useCallback(() => {
   setIsLocked(false)
   setShowControls(false)
   setUseDeviceOrientation(false)
   movementRef.current = { x: 0, y: 0 }
   lookRef.current = { x: 0, y: 0 }
 }, [])

 useEffect(() => {
   const handleKeyDown = (e: KeyboardEvent) => {
     if (e.key === 'Escape' && isLocked) {
       handleStopExploring()
     }
   }

   window.addEventListener('keydown', handleKeyDown)
   return () => window.removeEventListener('keydown', handleKeyDown)
 }, [isLocked, handleStopExploring])

 useEffect(() => {
   if (useDeviceOrientation) {
     const handleOrientation = (event: DeviceOrientationEvent) => {
       console.log('Orientation:', {
         alpha: event.alpha,
         beta: event.beta,
         gamma: event.gamma
       })
     }

     window.addEventListener('deviceorientation', handleOrientation)
     return () => window.removeEventListener('deviceorientation', handleOrientation)
   }
 }, [useDeviceOrientation])
 
 return (
   <div className="relative w-screen h-screen bg-white">
     <div className="absolute inset-0">
       <Canvas
         camera={{
           position: [0, 1.7, 10],
           fov: 75,
           near: 0.1,
           far: 100
         }}
         dpr={[1, 2]}
       >
         <Suspense fallback={null}>
           <World />
           <MobileCameraControls 
             movementRef={movementRef}
             lookRef={lookRef}
             useDeviceOrientation={useDeviceOrientation}
           />
           {useDeviceOrientation && (
             <DeviceOrientationControls enabled={isLocked} />
           )}
         </Suspense>
       </Canvas>
     </div>
     
     <div className="absolute inset-0 pointer-events-none">
       <div className="relative w-full h-full">
         <div className="pointer-events-auto">
           <Interface />
         </div>
         <AnimatePresence mode="wait">
           <Routes location={location} key={location.pathname}>
             <Route path="/" element={null} />
             <Route path="/about" element={<About />} />
             <Route path="/projects/*" element={<Projects />} />
             <Route path="/services" element={<Services />} />
             <Route path="/contact" element={<Contact />} />
           </Routes>
         </AnimatePresence>
         
         {showControls && (
           <div className="fixed bottom-0 left-0 right-0 pb-4 pointer-events-none">
             <DualJoystickUI
               onMove={(movement) => {
                 movementRef.current = movement
               }}
               onLook={(rotation) => {
                 if (!useDeviceOrientation) {
                   lookRef.current = rotation
                 }
               }}
             />
           </div>
         )}
       </div>
     </div>

     {!isLocked && (
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="space-y-4 text-center">
           <button 
             className="px-6 py-3 text-sm bg-white/80 backdrop-blur-sm rounded-lg 
                      pointer-events-auto hover:bg-white/90 transition-colors"
             onClick={handleStartExploring}
           >
             {isMobile ? 'Tap to explore' : 'Click to explore'}
           </button>
           {isMobile && (
             <p className="text-xs text-black/60">
               Enable device orientation for immersive viewing
             </p>
           )}
         </div>
       </div>
     )}

     {isLocked && (
       <div className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm">
         <button
           className="px-3 py-1 text-xs bg-white/80 backdrop-blur-sm rounded-lg 
                    pointer-events-auto hover:bg-white/90 transition-colors"
           onClick={handleStopExploring}
         >
           Exit View
         </button>
         {isMobile && (
           <button
             className={`px-3 py-1 text-xs backdrop-blur-sm rounded-lg pointer-events-auto 
                      transition-colors ${
                        useDeviceOrientation 
                          ? 'bg-bauhaus-blue/20 text-bauhaus-blue' 
                          : 'bg-white/80 hover:bg-white/90'
                      }`}
             onClick={requestOrientationPermission}
           >
             {useDeviceOrientation ? 'Motion Control Active' : 'Enable Motion Control'}
           </button>
         )}
       </div>
     )}

     {useDeviceOrientation && (
       <div className="fixed bottom-4 left-4 text-xs text-black/60 bg-white/80 p-2 rounded">
         Debug: Motion Control Active
       </div>
     )}
   </div>
 )
}

export default function AppWrapper() {
 return (
   <Router>
     <App />
   </Router>
 )
}