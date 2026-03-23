"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { PlayerState } from "@/store/slices/game";
import AvatarVisuals from "./AvatarVisuals";

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

    // Smoothly interpolate position (X and Z only)
    const dx = targetPos.current.x - groupRef.current.position.x;
    const dz = targetPos.current.z - groupRef.current.position.z;
    groupRef.current.position.x += dx * clamped * 8;
    groupRef.current.position.z += dz * clamped * 8;

    // Smoothly interpolate rotation
    let rotDiff = targetRot.current - groupRef.current.rotation.y;
    while (rotDiff > Math.PI) rotDiff -= 2 * Math.PI;
    while (rotDiff < -Math.PI) rotDiff += 2 * Math.PI;
    groupRef.current.rotation.y += rotDiff * clamped * 8;

    // Determine base Y from floor
    const floorY = player.floor === 1 ? 0 : 4.15;

    // Walking / idle bob on Y axis separately
    if (player.isMoving) {
      bobPhase.current += clamped * 12;
      groupRef.current.position.y = floorY + Math.sin(bobPhase.current) * 0.06;
    } else {
      bobPhase.current += clamped * 2;
      groupRef.current.position.y = floorY + Math.sin(bobPhase.current) * 0.02;
    }
  });

  const color = player.color || "#6366f1";

  return (
    <group
      ref={groupRef}
      position={[player.position.x, player.position.y, player.position.z]}
    >
      <AvatarVisuals color={color} customization={player.customization} />
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
