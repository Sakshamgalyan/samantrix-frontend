"use client";

import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateLocalPosition } from "@/store/slices/game";
import { sendMovement } from "@/socket/socketManager";
import { RigidBody, CapsuleCollider, RapierRigidBody, quat } from "@react-three/rapier";

import AvatarVisuals from "./AvatarVisuals";

/* ── Constants ─────────────────────────────────────────── */
const MOVE_SPEED = 7;
const ROTATION_SPEED = 10;
const FLOOR_HEIGHT = 4.15;
const FLOOR_1_Y = 0.1;
const FLOOR_2_Y = 4.25;

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
  const rbRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const currentFloor = useRef(1);
  const targetRotation = useRef(0);
  const bobPhase = useRef(0);
  const lastSend = useRef({ x: 0, y: 0, z: 0, r: 0, f: 1, m: false });

  // Camera offset
  const cameraOffset = useRef(new THREE.Vector3(0, 4.5, 7));
  const cameraLookOffset = useRef(new THREE.Vector3(0, 1.2, 0));

  useFrame((_, delta) => {
    if (!rbRef.current || !groupRef.current || !localPlayer) return;
    const clamped = Math.min(delta, 0.05);

    /* ── Movement Input ── */
    let moveX = 0;
    let moveZ = 0;

    if (keys["KeyW"] || keys["ArrowUp"]) moveZ = -1;
    if (keys["KeyS"] || keys["ArrowDown"]) moveZ = 1;
    if (keys["KeyA"] || keys["ArrowLeft"]) moveX = -1;
    if (keys["KeyD"] || keys["ArrowRight"]) moveX = 1;

    const isMoving = moveX !== 0 || moveZ !== 0;

    if (isMoving && moveX !== 0 && moveZ !== 0) {
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= len;
      moveZ /= len;
    }

    /* ── Physics Application ── */
    const vel = rbRef.current.linvel();
    rbRef.current.setLinvel({
      x: moveX * MOVE_SPEED,
      y: vel.y,
      z: moveZ * MOVE_SPEED,
    }, true);

    const pos = rbRef.current.translation();

    if (isMoving) {
      // Rotation
      targetRotation.current = Math.atan2(moveX, moveZ);
      const curQuat = quat(rbRef.current.rotation());
      const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, targetRotation.current, 0));
      curQuat.slerp(targetQuat, ROTATION_SPEED * clamped);
      rbRef.current.setRotation(curQuat, true);

      bobPhase.current += clamped * 12;
    } else {
      bobPhase.current += clamped * 2;
    }

    const bobAmount = isMoving ? 0.08 : 0.03;
    groupRef.current.position.y = Math.sin(bobPhase.current) * bobAmount;

    /* ── Stairs Logic ── */
    const stairX = 17;
    const stairZEnd = -18;
    const stairZStart = -10;

    if (currentFloor.current === 1 && pos.x > stairX - 2 && pos.z < stairZEnd) {
      currentFloor.current = 2;
      rbRef.current.setTranslation({ x: pos.x, y: FLOOR_2_Y, z: -10 }, true);
    } else if (currentFloor.current === 2 && pos.x > stairX - 2 && pos.z > stairZStart) {
      currentFloor.current = 1;
      rbRef.current.setTranslation({ x: pos.x, y: FLOOR_1_Y, z: -8 }, true);
    }

    /* ── Camera follow ── */
    const idealCamPos = new THREE.Vector3(
      pos.x + cameraOffset.current.x,
      pos.y + cameraOffset.current.y,
      pos.z + cameraOffset.current.z,
    );
    camera.position.lerp(idealCamPos, clamped * 6);

    const lookTarget = new THREE.Vector3(
      pos.x + cameraLookOffset.current.x,
      pos.y + cameraLookOffset.current.y,
      pos.z + cameraLookOffset.current.z,
    );
    camera.lookAt(lookTarget);

    /* ── State & Network Sync ── */
    dispatch(
      updateLocalPosition({
        position: { x: pos.x, y: pos.y, z: pos.z },
        rotation: { y: targetRotation.current },
        floor: currentFloor.current,
        isMoving,
      }),
    );

    const ls = lastSend.current;
    if (Math.abs(ls.x - pos.x) > 0.01 || Math.abs(ls.z - pos.z) > 0.01 || ls.m !== isMoving) {
      sendMovement({ x: pos.x, y: pos.y, z: pos.z }, { y: targetRotation.current }, currentFloor.current, isMoving);
      ls.x = pos.x; ls.y = pos.y; ls.z = pos.z; ls.m = isMoving;
    }
  });

  const teleportToFloor = useCallback((floor: number) => {
    if (!rbRef.current) return;
    currentFloor.current = floor;
    const floorY = floor === 1 ? FLOOR_1_Y : FLOOR_2_Y;
    rbRef.current.setTranslation({ x: -17, y: floorY, z: -12 }, true);
  }, []);

  // Expose teleport via window
  useEffect(() => {
    (window as any).__teleportToFloor = teleportToFloor;
    return () => {
      delete (window as any).__teleportToFloor;
    };
  }, [teleportToFloor]);

  if (!localPlayer) return null;

  const color = localPlayer.color || "#6366f1";

  return (
    <RigidBody
      ref={rbRef}
      colliders={false}
      enabledRotations={[false, true, false]}
      type="dynamic"
      position={[0, 0.5, 5]}
      friction={0}
    >
      <CapsuleCollider args={[0.7, 0.3]} />
      <group ref={groupRef}>
        <AvatarVisuals color={color} customization={localPlayer.customization} />
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
    </RigidBody>
  );
}

/* ── Export teleport for elevator ── */
export function teleportPlayer(floor: number) {
  const fn = (window as unknown as Record<string, (floor: number) => void>)
    .__teleportToFloor;
  if (fn) fn(floor);
}
