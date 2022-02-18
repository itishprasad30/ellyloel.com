import React from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { DDSLoader } from 'three-stdlib';

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

const LegoModel = () => {
  const materials = useLoader(MTLLoader, './lego model/me.mtl');
  const obj = useLoader(OBJLoader, './lego model/me.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  return <primitive object={obj} scale={3} />;
};

const ThreeLoader = () => {
  return (
    <>
      <LegoModel />
    </>
  );
};

export default ThreeLoader;
