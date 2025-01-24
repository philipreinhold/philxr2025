// src/shaders/DrawnShader.ts
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import glsl from 'babel-plugin-glsl/macro'

// Definiere das ShaderMaterial
const DrawnShaderMaterial = shaderMaterial(
  {
    color: '#FFFFFF',
    opacity: 0.7,
  },
  // Vertex Shader
  glsl`
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
    uniform vec3 color;
    uniform float opacity;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Einfache Konturlinie basierend auf der Normalen
      float edge = dot(vNormal, vec3(0.0, 0.0, 1.0));
      float line = smoothstep(0.5, 0.6, edge) * 0.8;

      // Gezeichnete Farbe
      vec3 drawnColor = color * (1.0 - line);

      gl_FragColor = vec4(drawnColor, opacity);
    }
  `
)

// Füge das Material als JSX-Element hinzu
extend({ DrawnShaderMaterial })

export default DrawnShaderMaterial
