// src/components/pages/Projects/DemoPhil/index.tsx
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { World3DViewer } from './World3DViewer'

export default function DemoPhil() {
 return (
   <div className="h-screen flex flex-col">
     <div className="flex-1">
       <Canvas>
         <Suspense fallback={null}>
           <World3DViewer />
         </Suspense>
       </Canvas>
     </div>
     <div className="p-4 bg-white/80 backdrop-blur-sm">
       <h1 className="text-xl mb-2">DemoPhil</h1>
       <p>Interactive 3D World Demo</p>
     </div>
   </div>
 )
}
