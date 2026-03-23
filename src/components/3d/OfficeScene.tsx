"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Stats } from "@react-three/drei";
import OfficeBuilding from "./OfficeBuilding";
import LocalAvatar, { teleportPlayer } from "./LocalAvatar";
import RemoteAvatar from "./RemoteAvatar";
import Lights from "./Lights";
import { useAppSelector } from "@/store/hooks";
import { PlayerState } from "@/store/slices/game";
import { Physics } from "@react-three/rapier";
import { Provider } from "react-redux";
import { store } from "@/store";

function RemoteAvatars() {
  const remotePlayers = useAppSelector((s) => s.game.remotePlayers);
  const playerList = Object.values(remotePlayers);

  return (
    <>
      {playerList.map((player) => (
        <RemoteAvatar key={player.id} player={player} />
      ))}
    </>
  );
}

export default function OfficeScene() {
  const handleElevator = (targetFloor: number) => {
    teleportPlayer(targetFloor);
  };

  return (
    <Canvas
      shadows
      camera={{
        fov: 55,
        near: 0.1,
        far: 200,
        position: [0, 8, 15],
      }}
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = 3; // ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1;
      }}
    >
      <color attach="background" args={["#c7d2cc"]} />
      {/* Fog for depth */}
      <fog attach="fog" args={["#c7d2cc", 40, 120]} />

      <Suspense fallback={null}>
        <Provider store={store}>
          <Physics gravity={[0, -9.81, 0]}>
            <Lights />
            <ContactShadows opacity={0.4} scale={50} blur={2} far={10} resolution={512} color="#000000" />
            <OfficeBuilding onElevator={handleElevator} />
            <LocalAvatar />
            <RemoteAvatars />
          </Physics>
        </Provider>
      </Suspense>


      {/* Performance stats in dev */}
      {process.env.NODE_ENV === "development" && <Stats />}
    </Canvas>
  );
}
