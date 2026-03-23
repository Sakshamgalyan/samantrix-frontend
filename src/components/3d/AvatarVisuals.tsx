"use client";

import React from "react";
import * as THREE from "three";

interface AvatarVisualsProps {
  color: string;
  customization?: {
    hairStyle: string;
    accessory: string;
  };
}

export default function AvatarVisuals({ color, customization }: AvatarVisualsProps) {
  const hairStyle = customization?.hairStyle || "none";
  const accessory = customization?.accessory || "none";

  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.7, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.1, 1.53, 0.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.1, 1.53, 0.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.1, 1.53, 0.24]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0.1, 1.53, 0.24]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* HAIR STYLES */}
      {hairStyle === "short" && (
        <mesh position={[0, 1.62, 0]} rotation={[-0.2, 0, 0]}>
          <sphereGeometry args={[0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#2d2a3e" />
        </mesh>
      )}

      {hairStyle === "spiky" && (
        <group position={[0, 1.6, 0]}>
          {[...Array(8)].map((_, i) => (
            <mesh 
              key={i} 
              position={[
                Math.sin((i / 8) * Math.PI * 2) * 0.15,
                0.1,
                Math.cos((i / 8) * Math.PI * 2) * 0.15
              ]} 
              rotation={[0.8, (i / 8) * Math.PI * 2, 0]}
            >
              <coneGeometry args={[0.06, 0.25, 8]} />
              <meshStandardMaterial color="#2d2a3e" />
            </mesh>
          ))}
          <mesh position={[0, 0.1, 0]}>
            <coneGeometry args={[0.08, 0.3, 8]} />
            <meshStandardMaterial color="#2d2a3e" />
          </mesh>
        </group>
      )}

      {hairStyle === "long" && (
        <group position={[0, 1.5, -0.05]}>
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.27, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
          <mesh position={[0, -0.2, -0.1]}>
            <boxGeometry args={[0.45, 0.5, 0.1]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
        </group>
      )}

      {hairStyle === "mohawk" && (
        <group position={[0, 1.6, 0]}>
          {[...Array(5)].map((_, i) => (
            <mesh key={i} position={[0, 0.1 + (i * 0.02), 0.15 - (i * 0.1)]} rotation={[0.5, 0, 0]}>
              <boxGeometry args={[0.05, 0.2, 0.15]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          ))}
        </group>
      )}

      {/* ACCESSORIES */}
      {accessory === "hat" && (
        <group position={[0, 1.73, 0]}>
          <mesh rotation={[Math.PI * 0.5, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.02, 32]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.25, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}

      {accessory === "glasses" && (
        <group position={[0, 1.55, 0.23]}>
          <mesh position={[-0.1, 0, 0]}>
            <ringGeometry args={[0.06, 0.08, 16]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          <mesh position={[0.1, 0, 0]}>
            <ringGeometry args={[0.06, 0.08, 16]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.02, 0.01]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        </group>
      )}

      {accessory === "headphones" && (
        <group position={[0, 1.5, 0]}>
          <mesh position={[0.26, 0, 0]} rotation={[0, 0, Math.PI * 0.5]}>
            <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
          <mesh position={[-0.26, 0, 0]} rotation={[0, 0, Math.PI * 0.5]}>
            <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <torusGeometry args={[0.26, 0.03, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
        </group>
      )}
    </group>
  );
}
