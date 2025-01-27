// src/components/pages/Projects/HumanWithin/index.tsx
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { VR360Viewer } from './VR360Viewer'

export default function HumanWithin() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <Canvas>
          <Suspense fallback={null}>
            <VR360Viewer 
              imageUrl="/Images/HW_360_VR_COLOR_CHECK_6.jpg"
              isOverUnder={true}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}