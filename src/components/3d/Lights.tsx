import React from "react";
import { SoftShadows, Environment } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      <SoftShadows size={25} samples={10} focus={0} />
      <Environment preset="city" />

      {/* Ambient base light */}
      <ambientLight intensity={0.35} color="#e8e0ff" />

      {/* Main sun — directional with shadows */}
      <directionalLight
        position={[15, 25, 20]}
        intensity={1.6}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.001}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-10, 15, -10]}
        intensity={0.4}
        color="#c7d2fe"
      />

      {/* Hemisphere for natural color variation */}
      <hemisphereLight args={["#fef3c7", "#a7f3d0", 0.3]} />

      {/* Interior point lights — Floor 1 */}
      <pointLight
        position={[0, 3.5, 0]}
        intensity={15}
        color="#fef9c3"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[-10, 3.5, 2]}
        intensity={10}
        color="#fef9c3"
        distance={15}
        decay={2}
      />
      <pointLight
        position={[10, 3.5, 2]}
        intensity={10}
        color="#e0e7ff"
        distance={15}
        decay={2}
      />

      {/* Interior point lights — Floor 2 */}
      <pointLight
        position={[0, 7.5, 0]}
        intensity={15}
        color="#fef9c3"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[-10, 7.5, -5]}
        intensity={10}
        color="#fef9c3"
        distance={15}
        decay={2}
      />
      <pointLight
        position={[10, 7.5, 5]}
        intensity={10}
        color="#e0e7ff"
        distance={15}
        decay={2}
      />
    </>
  );
}
