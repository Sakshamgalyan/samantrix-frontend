"use client";

import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateLocalPosition } from "@/store/slices/game";
import { sendMovement } from "@/socket/socketManager";

/* ── Constants ─────────────────────────────────────────── */
const MOVE_SPEED = 6;
const ROTATION_SPEED = 3;
const FLOOR_HEIGHT = 4.15; // wall_height + ceiling thickness
const FLOOR_1_Y = 0;
const FLOOR_2_Y = FLOOR_HEIGHT;

/* ── Collision boxes (AABB) ────────────────────────────── */
interface AABB {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  minY: number;
  maxY: number;
}

function getWallColliders(floorY: number): AABB[] {
  const HW = 20; // half floor width
  const HD = 15; // half floor depth
  const WT = 0.3;
  return [
    // back wall
    {
      minX: -HW,
      maxX: HW,
      minZ: -HD - WT,
      maxZ: -HD + WT,
      minY: floorY,
      maxY: floorY + 4,
    },
    // front wall — left segment
    {
      minX: -HW,
      maxX: -4,
      minZ: HD - WT,
      maxZ: HD + WT,
      minY: floorY,
      maxY: floorY + 4,
    },
    // front wall — right segment
    {
      minX: 4,
      maxX: HW,
      minZ: HD - WT,
      maxZ: HD + WT,
      minY: floorY,
      maxY: floorY + 4,
    },
    // left wall
    {
      minX: -HW - WT,
      maxX: -HW + WT,
      minZ: -HD,
      maxZ: HD,
      minY: floorY,
      maxY: floorY + 4,
    },
    // right wall
    {
      minX: HW - WT,
      maxX: HW + WT,
      minZ: -HD,
      maxZ: HD,
      minY: floorY,
      maxY: floorY + 4,
    },
  ];
}

const PLAYER_RADIUS = 0.4;

function checkCollision(x: number, z: number, colliders: AABB[]): boolean {
  for (const box of colliders) {
    const closestX = Math.max(box.minX, Math.min(x, box.maxX));
    const closestZ = Math.max(box.minZ, Math.min(z, box.maxZ));
    const dx = x - closestX;
    const dz = z - closestZ;
    if (dx * dx + dz * dz < PLAYER_RADIUS * PLAYER_RADIUS) {
      return true;
    }
  }
  return false;
}

/* ── Keyboard state ────────────────────────────────────── */
const keys: Record<string, boolean> = {};

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
  });
  window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });
}

/* ── Component ─────────────────────────────────────────── */
export default function LocalAvatar() {
  const dispatch = useAppDispatch();
  const localPlayer = useAppSelector((s) => s.game.localPlayer);
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const currentFloor = useRef(1);
  const velocity = useRef(new THREE.Vector3());
  const targetRotation = useRef(0);
  const bobPhase = useRef(0);
  const isMovingRef = useRef(false);

  // Camera offset — close enough to see the avatar clearly
  const cameraOffset = useRef(new THREE.Vector3(0, 4, 6));
  const cameraLookOffset = useRef(new THREE.Vector3(0, 1.2, 0));

  useFrame((_, delta) => {
    if (!groupRef.current || !localPlayer) return;
    const clamped = Math.min(delta, 0.05);

    const pos = groupRef.current.position;

    /* ── Determine current floor ── */
    const floorY = currentFloor.current === 1 ? FLOOR_1_Y : FLOOR_2_Y;
    const colliders = getWallColliders(floorY);

    /* ── Movement ── */
    let moveX = 0;
    let moveZ = 0;

    if (keys["KeyW"] || keys["ArrowUp"]) moveZ = -1;
    if (keys["KeyS"] || keys["ArrowDown"]) moveZ = 1;
    if (keys["KeyA"] || keys["ArrowLeft"]) moveX = -1;
    if (keys["KeyD"] || keys["ArrowRight"]) moveX = 1;

    const isMoving = moveX !== 0 || moveZ !== 0;
    isMovingRef.current = isMoving;

    if (isMoving) {
      // Calculate rotation from input
      const angle = Math.atan2(moveX, moveZ);
      targetRotation.current = angle;

      // Smooth rotation
      const currentRot = groupRef.current.rotation.y;
      let rotDiff = targetRotation.current - currentRot;
      // Wrap to -PI..PI
      while (rotDiff > Math.PI) rotDiff -= 2 * Math.PI;
      while (rotDiff < -Math.PI) rotDiff += 2 * Math.PI;
      groupRef.current.rotation.y += rotDiff * ROTATION_SPEED * clamped * 5;

      const speed = MOVE_SPEED * clamped;
      const newX = pos.x + moveX * speed;
      const newZ = pos.z + moveZ * speed;

      // Collision check
      if (!checkCollision(newX, pos.z, colliders)) {
        pos.x = newX;
      }
      if (!checkCollision(pos.x, newZ, colliders)) {
        pos.z = newZ;
      }

      // Walking bob
      bobPhase.current += clamped * 12;
    } else {
      // Idle gentle bob
      bobPhase.current += clamped * 2;
    }

    // Apply bob to Y
    const bobAmount = isMoving ? 0.08 : 0.03;
    pos.y = floorY + Math.sin(bobPhase.current) * bobAmount;

    /* ── Floor transition detection ── */
    // Stairs zone: near right-back corner
    const stairX = 17; // HW - 3
    const stairZStart = -10;
    const stairZEnd = -10 - 8;

    if (currentFloor.current === 1) {
      // Walking up stairs
      if (pos.x > stairX - 2 && pos.x < stairX + 2 && pos.z < stairZEnd) {
        currentFloor.current = 2;
        pos.y = FLOOR_2_Y;
        pos.z = -10;
      }
    } else {
      // Walking down stairs
      if (pos.x > stairX - 2 && pos.x < stairX + 2 && pos.z > stairZStart) {
        currentFloor.current = 1;
        pos.y = FLOOR_1_Y;
        pos.z = -8;
      }
    }

    /* ── Camera follow ── */
    const idealCamPos = new THREE.Vector3(
      pos.x + cameraOffset.current.x,
      pos.y + cameraOffset.current.y,
      pos.z + cameraOffset.current.z,
    );
    camera.position.lerp(idealCamPos, clamped * 4);

    const lookTarget = new THREE.Vector3(
      pos.x + cameraLookOffset.current.x,
      pos.y + cameraLookOffset.current.y,
      pos.z + cameraLookOffset.current.z,
    );
    camera.lookAt(lookTarget);

    /* ── Dispatch to Redux & Socket ── */
    const position = { x: pos.x, y: pos.y, z: pos.z };
    const rotation = { y: groupRef.current.rotation.y };

    dispatch(
      updateLocalPosition({
        position,
        rotation,
        floor: currentFloor.current,
        isMoving,
      }),
    );

    sendMovement(position, rotation, currentFloor.current, isMoving);
  });

  // Teleport handler for elevator
  const teleportToFloor = useCallback((floor: number) => {
    if (!groupRef.current) return;
    currentFloor.current = floor;
    const floorY = floor === 1 ? FLOOR_1_Y : FLOOR_2_Y;
    groupRef.current.position.set(-17, floorY, -12);
  }, []);

  // Expose teleport via window for elevator click
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__teleportToFloor =
      teleportToFloor;
    return () => {
      delete (window as unknown as Record<string, unknown>).__teleportToFloor;
    };
  }, [teleportToFloor]);

  if (!localPlayer) return null;

  const color = localPlayer.color || "#6366f1";

  return (
    <group ref={groupRef} position={[0, 0, 5]}>
      {/* Body — capsule */}
      <mesh ref={bodyRef} position={[0, 0.75, 0]} castShadow>
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
      {/* Username label */}
      <Html
        position={[0, 2.0, 0]}
        center
        distanceFactor={8}
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
          {localPlayer.username}
        </div>
      </Html>
    </group>
  );
}

/* ── Export teleport for elevator ── */
export function teleportPlayer(floor: number) {
  const fn = (window as unknown as Record<string, (floor: number) => void>)
    .__teleportToFloor;
  if (fn) fn(floor);
}
