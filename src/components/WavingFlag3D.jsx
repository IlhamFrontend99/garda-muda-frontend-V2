import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FlagCloth() {
  const meshRef = useRef();
  const materialRef = useRef();

  const shaderData = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          float flowFactor = max(0.2, (pos.x + 2.25) / 4.5);
          float wave = sin(pos.x * 2.5 + uTime * 2.4) * 0.18 * flowFactor +
                       sin(pos.y * 3.0 + uTime * 1.6) * 0.06 * flowFactor;
          
          pos.z += wave;
          vWave = wave;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vWave;

        void main() {
          vec3 redColor = vec3(0.88, 0.11, 0.28);
          vec3 whiteColor = vec3(0.98, 0.98, 1.0);

          float edge = step(0.5, vUv.y);
          vec3 finalColor = mix(whiteColor, redColor, edge);

          float lighting = 0.88 + vWave * 0.42;
          finalColor *= lighting;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    };
  }, []);

  useFrame((_, delta) => {
    if (materialRef.current && materialRef.current.uniforms.uTime) {
      materialRef.current.uniforms.uTime.value += delta;
      const t = materialRef.current.uniforms.uTime.value;
      if (meshRef.current) {
        meshRef.current.rotation.y = Math.sin(t * 0.2) * 0.04;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[4.5, 2.7, 40, 24]} />
      <shaderMaterial
        ref={materialRef}
        args={[shaderData]}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

const WavingFlag3D = React.memo(function WavingFlag3D({ className = '' }) {
  return (
    <div className={`pointer-events-none relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.3], fov: 40 }}
        gl={{ 
          alpha: true, 
          antialias: true, 
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false 
        }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <FlagCloth />
      </Canvas>
    </div>
  );
});

export default WavingFlag3D;