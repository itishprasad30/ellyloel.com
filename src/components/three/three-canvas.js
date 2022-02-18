import React from 'react';

import { Canvas } from '@react-three/fiber';

import ThreeLoader from './three-loader';

const ThreeCanvas = () => {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{
        near: 1,
        far: 1000,
        fov: 55,
        position: [0, 200, 200],
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight castShadow position={[100, 0, 0]} color="#ffffff" />
      <directionalLight castShadow position={[0, 0, -100]} color="#663399" />
      <ThreeLoader />
    </Canvas>
  );
};

export default ThreeCanvas;
