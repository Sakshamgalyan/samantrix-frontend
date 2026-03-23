"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useAppSelector } from "@/store/hooks";

/* ── Constants ─────────────────────────────────────────── */
const FLOOR_WIDTH = 40;
const FLOOR_DEPTH = 30;
const WALL_HEIGHT = 4;
const WALL_THICKNESS = 0.3;
const FLOOR_Y_OFFSET = 0; // Floor 1 at y=0, Floor 2 at y=WALL_HEIGHT + stairHeight

/* ── Material Palette ──────────────────────────────────── */
/* ── Shared Materials (Centralized) ─────────────────────── */
const SHARED_MATERIALS = {
  floor: new THREE.MeshStandardMaterial({
    color: "#e8e0d4",
    roughness: 0.7,
    metalness: 0.05,
  }),
  floor2: new THREE.MeshStandardMaterial({
    color: "#d4cfc7",
    roughness: 0.65,
    metalness: 0.05,
  }),
  wall: new THREE.MeshStandardMaterial({
    color: "#f5f0eb",
    roughness: 0.85,
    metalness: 0.0,
  }),
  wallAccent: new THREE.MeshStandardMaterial({
    color: "#4f46e5",
    roughness: 0.3,
    metalness: 0.4,
  }),
  glass: new THREE.MeshPhysicalMaterial({
    color: "#d1e9ff",
    transparent: true,
    opacity: 0.2,
    roughness: 0,
    metalness: 0.1,
    transmission: 0.95,
    thickness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
  }),
  desk: new THREE.MeshStandardMaterial({
    color: "#8B7355",
    roughness: 0.6,
    metalness: 0.1,
  }),
  deskWhite: new THREE.MeshStandardMaterial({
    color: "#f0ece6",
    roughness: 0.5,
    metalness: 0.05,
  }),
  chair: new THREE.MeshStandardMaterial({
    color: "#2d2d2d",
    roughness: 0.8,
    metalness: 0.2,
  }),
  monitor: new THREE.MeshStandardMaterial({
    color: "#1a1a2e",
    roughness: 0.3,
    metalness: 0.6,
  }),
  screen: new THREE.MeshStandardMaterial({
    color: "#4cc9f0",
    emissive: "#4cc9f0",
    emissiveIntensity: 0.3,
    roughness: 0.1,
    metalness: 0.0,
  }),
  plant: new THREE.MeshStandardMaterial({
    color: "#2d6a4f",
    roughness: 0.8,
    metalness: 0.0,
  }),
  pot: new THREE.MeshStandardMaterial({
    color: "#b07d62",
    roughness: 0.9,
    metalness: 0.0,
  }),
  whiteboard: new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.3,
    metalness: 0.05,
  }),
  carpet: new THREE.MeshStandardMaterial({
    color: "#6366f1",
    roughness: 0.95,
    metalness: 0.0,
  }),
  stairs: new THREE.MeshStandardMaterial({
    color: "#9ca3af",
    roughness: 0.6,
    metalness: 0.3,
  }),
  elevator: new THREE.MeshStandardMaterial({
    color: "#4f46e5",
    emissive: "#6366f1",
    emissiveIntensity: 0.5,
    roughness: 0.1,
    metalness: 0.8,
  }),
  ceiling: new THREE.MeshStandardMaterial({
    color: "#fafaf9",
    roughness: 0.9,
    metalness: 0.0,
  }),
  column: new THREE.MeshStandardMaterial({
    color: "#e2e8f0",
    roughness: 0.2,
    metalness: 0.8,
  }),
};

/* ── Sub-components ────────────────────────────────────── */

function Desk({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  const mats = SHARED_MATERIALS;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* desk surface */}
      <mesh
        position={[0, 0.75, 0]}
        castShadow
        receiveShadow
        material={mats.deskWhite}
      >
        <boxGeometry args={[1.6, 0.05, 0.8]} />
      </mesh>
      {/* legs */}
      {[
        [-0.7, 0.375, -0.35],
        [0.7, 0.375, -0.35],
        [-0.7, 0.375, 0.35],
        [0.7, 0.375, 0.35],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          castShadow
          material={mats.desk}
        >
          <boxGeometry args={[0.05, 0.75, 0.05]} />
        </mesh>
      ))}
      {/* monitor */}
      <mesh position={[0, 1.15, -0.2]} castShadow material={mats.monitor}>
        <boxGeometry args={[0.6, 0.4, 0.03]} />
      </mesh>
      {/* screen glow */}
      <mesh position={[0, 1.15, -0.18]} material={mats.screen}>
        <boxGeometry args={[0.55, 0.35, 0.01]} />
      </mesh>
      {/* monitor stand */}
      <mesh position={[0, 0.95, -0.2]} material={mats.monitor}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
      </mesh>
    </group>
  );
}

function Chair({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  const mats = SHARED_MATERIALS;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* seat */}
      <mesh position={[0, 0.45, 0]} castShadow material={mats.chair}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
      </mesh>
      {/* backrest */}
      <mesh position={[0, 0.75, -0.22]} castShadow material={mats.chair}>
        <boxGeometry args={[0.5, 0.55, 0.05]} />
      </mesh>
      {/* base pole */}
      <mesh position={[0, 0.25, 0]} material={mats.monitor}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
      </mesh>
      {/* base */}
      <mesh position={[0, 0.02, 0]} material={mats.monitor}>
        <cylinderGeometry args={[0.25, 0.25, 0.04, 8]} />
      </mesh>
    </group>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  const mats = SHARED_MATERIALS;
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow material={mats.pot}>
        <cylinderGeometry args={[0.15, 0.12, 0.4, 8]} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow material={mats.plant}>
        <sphereGeometry args={[0.3, 8, 8]} />
      </mesh>
    </group>
  );
}

function Whiteboard({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  const mats = SHARED_MATERIALS;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.5, 0]} castShadow material={mats.whiteboard}>
        <boxGeometry args={[2, 1.2, 0.05]} />
      </mesh>
      {/* frame */}
      <mesh position={[0, 1.5, -0.03]} material={mats.monitor}>
        <boxGeometry args={[2.1, 1.3, 0.02]} />
      </mesh>
    </group>
  );
}

/* ── MeetingRoom ───────────────────────────────────────── */
function MeetingRoom({ position }: { position: [number, number, number] }) {
  const mats = SHARED_MATERIALS;
  return (
    <group position={position}>
      {/* glass walls */}
      <mesh position={[0, 2, -3.5]} material={mats.glass}>
        <boxGeometry args={[7, 4, 0.1]} />
      </mesh>
      <mesh position={[3.5, 2, 0]} material={mats.glass}>
        <boxGeometry args={[0.1, 4, 7]} />
      </mesh>
      {/* conference table */}
      <mesh position={[0, 0.75, 0]} castShadow material={mats.desk}>
        <boxGeometry args={[4, 0.08, 1.5]} />
      </mesh>
      {/* table legs */}
      {[
        [-1.5, 0.375, 0],
        [1.5, 0.375, 0],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          castShadow
          material={mats.desk}
        >
          <boxGeometry args={[0.1, 0.75, 1.2]} />
        </mesh>
      ))}
      {/* chairs around table */}
      {[
        [-1.2, 0, 1.2],
        [-0.4, 0, 1.2],
        [0.4, 0, 1.2],
        [1.2, 0, 1.2],
        [-1.2, 0, -1.2],
        [-0.4, 0, -1.2],
        [0.4, 0, -1.2],
        [1.2, 0, -1.2],
      ].map((pos, i) => (
        <Chair
          key={i}
          position={pos as [number, number, number]}
          rotation={i < 4 ? 0 : Math.PI}
        />
      ))}
      {/* whiteboard */}
      <Whiteboard position={[-3.4, 0, 0]} rotation={Math.PI / 2} />
      {/* carpet */}
      <mesh position={[0, 0.01, 0]} receiveShadow material={mats.carpet}>
        <boxGeometry args={[6.5, 0.02, 6.5]} />
      </mesh>
    </group>
  );
}

/* ── Open Workspace (rows of desks) ────────────────────── */
function OpenWorkspace({ position }: { position: [number, number, number] }) {
  const desks: [number, number, number][] = [];
  const chairs: { pos: [number, number, number]; rot: number }[] = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * 2.2 - 3.3;
      const z = row * 2.5 - 2.5;
      desks.push([x, 0, z]);
      chairs.push({ pos: [x, 0, z + 0.7], rot: Math.PI });
    }
  }

  return (
    <group position={position}>
      {desks.map((pos, i) => (
        <Desk key={`d-${i}`} position={pos} />
      ))}
      {chairs.map((c, i) => (
        <Chair key={`c-${i}`} position={c.pos} rotation={c.rot} />
      ))}
      {/* plants at corners */}
      <Plant position={[-5, 0, -4]} />
      <Plant position={[5, 0, -4]} />
      <Plant position={[-5, 0, 4]} />
      <Plant position={[5, 0, 4]} />
    </group>
  );
}

/* ── Stairs ─────────────────────────────────────────────── */
function Stairs({ position }: { position: [number, number, number] }) {
  const mats = SHARED_MATERIALS;
  const steps = 16;
  const stepH = WALL_HEIGHT / steps;
  const stepD = 0.5;

  const rampL = Math.sqrt(Math.pow(steps * stepD, 2) + Math.pow(WALL_HEIGHT, 2));
  const rampAngle = Math.atan2(WALL_HEIGHT, steps * stepD);

  return (
    <group position={position}>
      {Array.from({ length: steps }, (_, i) => (
        <mesh
          key={i}
          position={[0, stepH * i + stepH / 2, -i * stepD]}
          castShadow
          receiveShadow
          material={mats.stairs}
        >
          <boxGeometry args={[2, stepH, stepD]} />
        </mesh>
      ))}
      <mesh
        position={[0, WALL_HEIGHT / 2, -((steps - 1) * stepD) / 2]}
        rotation={[rampAngle, 0, 0]}
        visible={false}
      >
        <boxGeometry args={[2, 0.1, rampL]} />
      </mesh>
      {/* railings */}
      <mesh
        position={[-1.1, WALL_HEIGHT / 2, -(steps * stepD) / 2]}
        material={mats.column}
      >
        <boxGeometry args={[0.05, WALL_HEIGHT, steps * stepD]} />
      </mesh>
      <mesh
        position={[1.1, WALL_HEIGHT / 2, -(steps * stepD) / 2]}
        material={mats.column}
      >
        <boxGeometry args={[0.05, WALL_HEIGHT, steps * stepD]} />
      </mesh>
    </group>
  );
}

/* ── Elevator ──────────────────────────────────────────── */
function ElevatorPad({
  position,
  onClick,
}: {
  position: [number, number, number];
  onClick?: () => void;
}) {
  const mats = SHARED_MATERIALS;
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* base platform */}
      <mesh
        receiveShadow
        material={mats.elevator}
        onClick={onClick}
        onPointerOver={(e) => {
          (e.object as THREE.Mesh).material = mats.elevator.clone();
          (
            (e.object as THREE.Mesh).material as THREE.MeshStandardMaterial
          ).emissiveIntensity = 0.8;
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          (e.object as THREE.Mesh).material = mats.elevator;
          document.body.style.cursor = "default";
        }}
      >
        <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
      </mesh>
      {/* rotating ring */}
      <mesh ref={ref} position={[0, 0.15, 0]}>
        <torusGeometry args={[1, 0.03, 8, 32]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#818cf8"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* label */}
    </group>
  );
}

/* ── Columns ───────────────────────────────────────────── */
function Columns({ y = 0 }: { y?: number }) {
  const mats = SHARED_MATERIALS;
  const positions: [number, number, number][] = [
    [-12, y + 2, -8],
    [12, y + 2, -8],
    [-12, y + 2, 8],
    [12, y + 2, 8],
    [0, y + 2, -8],
    [0, y + 2, 8],
  ];
  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow material={mats.column}>
          <cylinderGeometry args={[0.3, 0.3, WALL_HEIGHT, 12]} />
        </mesh>
      ))}
    </>
  );
}

/* ── Main Building ─────────────────────────────────────── */
export default function OfficeBuilding({
  onElevator,
}: {
  onElevator?: (targetFloor: number) => void;
}) {
  const mats = SHARED_MATERIALS;
  const HW = FLOOR_WIDTH / 2;
  const HD = FLOOR_DEPTH / 2;
  const currentFloor = useAppSelector((s) => s.game.currentFloor);

  return (
    <group>
      {/* ═══ FLOOR 1 ═══ */}
      <group visible={currentFloor !== 2}>
        {/* Structure & Floor 1 Collision */}
        <RigidBody type="fixed" colliders="trimesh">
          {/* Ground surface */}
          <mesh position={[0, -0.05, 0]} receiveShadow material={mats.floor}>
            <boxGeometry args={[FLOOR_WIDTH, 0.1, FLOOR_DEPTH]} />
          </mesh>

          {/* Floor 1 Walls */}
          <mesh position={[0, WALL_HEIGHT / 2, -HD]} castShadow receiveShadow material={mats.wall}>
            <boxGeometry args={[FLOOR_WIDTH, WALL_HEIGHT, WALL_THICKNESS]} />
          </mesh>
          <mesh position={[-12, WALL_HEIGHT / 2, HD]} castShadow receiveShadow material={mats.wall}>
            <boxGeometry args={[16, WALL_HEIGHT, WALL_THICKNESS]} />
          </mesh>
          <mesh position={[12, WALL_HEIGHT / 2, HD]} castShadow receiveShadow material={mats.wall}>
            <boxGeometry args={[16, WALL_HEIGHT, WALL_THICKNESS]} />
          </mesh>
          <mesh position={[-HW, WALL_HEIGHT / 2, 0]} castShadow receiveShadow material={mats.wall}>
            <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, FLOOR_DEPTH]} />
          </mesh>
          <mesh position={[HW, WALL_HEIGHT / 2, 0]} castShadow receiveShadow material={mats.wall}>
            <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, FLOOR_DEPTH]} />
          </mesh>

          {/* Floor 1 Interior Colliders */}
          <OpenWorkspace position={[-10, 0, 2]} />
          <MeetingRoom position={[10, 0, 2]} />
          <Desk position={[0, 0, 10]} rotation={Math.PI} />
          <Chair position={[0, 0, 9]} rotation={0} />
          <Stairs position={[HW - 3, 0, -HD + 5]} />
          
          {/* Floor 2 underside / Floor 1 Ceiling */}
          <mesh position={[0, WALL_HEIGHT, 0]} receiveShadow material={mats.ceiling}>
            <boxGeometry args={[FLOOR_WIDTH, 0.15, FLOOR_DEPTH]} />
          </mesh>
        </RigidBody>

        {/* Floor 1 Visual Only */}
        <Plant position={[-3, 0, 12]} />
        <Plant position={[3, 0, 12]} />
        <Columns y={0} />

        <ElevatorPad
          position={[-HW + 3, 0.05, -HD + 3]}
          onClick={() => onElevator?.(2)}
        />
      </group>

      {/* ═══ FLOOR 2 ═══ */}
      <group
        position={[0, WALL_HEIGHT + 0.15, 0]}
        visible={currentFloor === 2}
      >
        {/* Floor 2 Structure & Collision */}
        <RigidBody type="fixed" colliders="trimesh">
          {/* Surface */}
          <mesh position={[0, -0.05, 0]} receiveShadow material={mats.floor2}>
            <boxGeometry args={[FLOOR_WIDTH, 0.1, FLOOR_DEPTH]} />
          </mesh>

          {/* Walls */}
          <mesh position={[0, WALL_HEIGHT / 2, -HD]} castShadow receiveShadow material={mats.wall}>
            <boxGeometry args={[FLOOR_WIDTH, WALL_HEIGHT, WALL_THICKNESS]} />
          </mesh>
          <mesh position={[0, WALL_HEIGHT / 2, HD]} castShadow receiveShadow material={mats.wall}>
            <boxGeometry args={[FLOOR_WIDTH, WALL_HEIGHT, WALL_THICKNESS]} />
          </mesh>
          <mesh position={[-HW, WALL_HEIGHT / 2, 0]} castShadow receiveShadow material={mats.wall}>
            <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, FLOOR_DEPTH]} />
          </mesh>
          <mesh position={[HW, WALL_HEIGHT / 2, 0]} castShadow receiveShadow material={mats.wall}>
            <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, FLOOR_DEPTH]} />
          </mesh>

          {/* Interior */}
          {[0, 1, 2].map((i) => (
            <group key={`office-${i}`} position={[-14 + i * 6, 0, -8]}>
              <mesh position={[0, 2, 3]} material={mats.glass}>
                <boxGeometry args={[5, 4, 0.1]} />
              </mesh>
              <mesh position={[2.5, 2, 0]} material={mats.glass}>
                <boxGeometry args={[0.1, 4, 6]} />
              </mesh>
              <Desk position={[0, 0, 0]} />
              <Chair position={[0, 0, 1]} rotation={Math.PI} />
            </group>
          ))}
          <Whiteboard position={[0, 0, -HD + 0.2]} />
          
          <group position={[10, 0, 5]}>
            <mesh position={[0, 0.35, 0]} castShadow material={mats.chair}>
              <boxGeometry args={[3, 0.5, 1]} />
            </mesh>
            <mesh position={[0, 0.7, -0.4]} castShadow material={mats.chair}>
              <boxGeometry args={[3, 0.4, 0.2]} />
            </mesh>
            {/* Restored coffee table */}
            <mesh position={[0, 0.4, 1.2]} castShadow material={mats.desk}>
              <boxGeometry args={[1.5, 0.05, 0.8]} />
            </mesh>
            <mesh position={[0, 0.2, 1.2]} material={mats.monitor}>
              <cylinderGeometry args={[0.3, 0.3, 0.4, 8]} />
            </mesh>
          </group>
        </RigidBody>

        {/* Visuals */}
        <Columns y={0} />

        <ElevatorPad
          position={[-HW + 3, 0.05, -HD + 3]}
          onClick={() => onElevator?.(1)}
        />
      </group>

      {/* ═══ GROUND PLANE collision (outdoor) ═══ */}
      <RigidBody type="fixed" colliders="cuboid">
        {/* Large box instead of plane for more stable collision */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[200, 0.1, 200]} />
          <meshStandardMaterial color="#c7d2cc" roughness={0.95} />
        </mesh>
      </RigidBody>
    </group>
  );
}
