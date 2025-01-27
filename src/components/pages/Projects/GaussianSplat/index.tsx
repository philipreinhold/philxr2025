import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { SplatViewer } from './SplatViewer'

export default function GaussianSplat() {
 return (
   <div className="h-screen flex flex-col">
     <div className="flex-1">
       <Canvas>
         <Suspense fallback={null}>
           <SplatViewer url="/path/to/your/splat.ply" />
         </Suspense>
       </Canvas>
     </div>
     <div className="p-4 bg-white/80 backdrop-blur-sm">
       <h1 className="text-xl mb-2">Gaussian Splat</h1>
       <p>3D Point Cloud Visualization</p>
     </div>
   </div>
 )
}