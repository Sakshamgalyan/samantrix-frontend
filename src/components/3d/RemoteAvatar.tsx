"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { PlayerState } from "@/store/slices/game";

interface RemoteAvatarProps {
  player: PlayerState;
}

export default function RemoteAvatar({ player }: RemoteAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useRef(
    new THREE.Vector3(player.position.x, player.position.y, player.position.z),
  );
  const targetRot = useRef(player.rotation.y);
  const bobPhase = useRef(0);

  // Update targets every render (from Redux state)
  targetPos.current.set(
    player.position.x,
    player.position.y,
    player.position.z,
  );
  targetRot.current = player.rotation.y;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const clamped = Math.min(delta, 0.05);

    // Smoothly interpolate position
    groupRef.current.position.lerp(targetPos.current, clamped * 8);

    // Smoothly interpolate rotation
    let rotDiff = targetRot.current - groupRef.current.rotation.y;
    while (rotDiff > Math.PI) rotDiff -= 2 * Math.PI;
    while (rotDiff < -Math.PI) rotDiff += 2 * Math.PI;
    groupRef.current.rotation.y += rotDiff * clamped * 8;

    // Walking / idle bob
    if (player.isMoving) {
      bobPhase.current += clamped * 12;
      groupRef.current.position.y += Math.sin(bobPhase.current) * 0.06;
    } else {
      bobPhase.current += clamped * 2;
      groupRef.current.position.y += Math.sin(bobPhase.current) * 0.02;
    }
  });

  const color = player.color || "#6366f1";

  return (
    <group
      ref={groupRef}
      position={[player.position.x, player.position.y, player.position.z]}
    >
      {/* Body */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 1.38, 0.16]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.08, 1.38, 0.16]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.08, 1.38, 0.19]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0.08, 1.38, 0.19]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Username label */}
      <Html
        position={[0, 1.8, 0]}
        center
        distanceFactor={10}
        zIndexRange={[100, 0]}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "2px 10px",
            borderRadius: "12px",
            fontSize: "11px",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            whiteSpace: "nowrap",
            border: `2px solid ${color}`,
            backdropFilter: "blur(4px)",
            userSelect: "none",
          }}
        >
          {player.username}
        </div>
      </Html>
    </group>
  );
}
