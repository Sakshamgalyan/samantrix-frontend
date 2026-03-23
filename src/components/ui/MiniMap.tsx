"use client";

import React, { useRef, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

const MAP_SIZE = 160;
const WORLD_W = 40;
const WORLD_D = 30;

function worldToMap(x: number, z: number): [number, number] {
  const mx = ((x + WORLD_W / 2) / WORLD_W) * MAP_SIZE;
  const my = ((z + WORLD_D / 2) / WORLD_D) * MAP_SIZE;
  return [mx, my];
}

export default function MiniMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const localPlayer = useAppSelector((s) => s.game.localPlayer);
  const remotePlayers = useAppSelector((s) => s.game.remotePlayers);
  const currentFloor = useAppSelector((s) => s.game.currentFloor);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);

      // Background
      ctx.fillStyle = "rgba(15, 10, 30, 0.85)";
      ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

      // Floor outline
      ctx.strokeStyle = "rgba(99, 102, 241, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(4, 4, MAP_SIZE - 8, MAP_SIZE - 8);

      // Walls
      ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(8, 8, MAP_SIZE - 16, MAP_SIZE - 16);

      // Room dividers
      ctx.strokeStyle = "rgba(99, 102, 241, 0.25)";
      ctx.lineWidth = 1;
      // Meeting room (right side)
      ctx.strokeRect(MAP_SIZE * 0.6, 8, MAP_SIZE * 0.35, MAP_SIZE * 0.5);
      // Office partition
      ctx.beginPath();
      ctx.moveTo(MAP_SIZE * 0.5, 8);
      ctx.lineTo(MAP_SIZE * 0.5, MAP_SIZE * 0.4);
      ctx.stroke();

      // Desk dots
      ctx.fillStyle = "rgba(148, 163, 184, 0.3)";
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          const [dx, dy] = worldToMap(
            -10 + col * 2.2 - 3.3,
            2 + row * 2.5 - 2.5,
          );
          ctx.fillRect(dx - 2, dy - 1, 4, 2);
        }
      }

      // Elevator marker
      const [ex, ey] = worldToMap(-17, -12);
      ctx.fillStyle = "rgba(99, 102, 241, 0.6)";
      ctx.beginPath();
      ctx.arc(ex, ey, 4, 0, Math.PI * 2);
      ctx.fill();

      // Stairs marker
      const [sx, sy] = worldToMap(17, -10);
      ctx.fillStyle = "rgba(156, 163, 175, 0.5)";
      ctx.fillRect(sx - 3, sy - 6, 6, 12);

      // Remote players
      Object.values(remotePlayers).forEach((p) => {
        if (p.floor !== currentFloor) return;
        const [px, py] = worldToMap(p.position.x, p.position.z);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Local player (larger + glow)
      if (localPlayer) {
        const [px, py] = worldToMap(
          localPlayer.position.x,
          localPlayer.position.z,
        );
        ctx.shadowColor = localPlayer.color;
        ctx.shadowBlur = 6;
        ctx.fillStyle = localPlayer.color;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Direction indicator
        const angle = localPlayer.rotation.y;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.sin(angle) * 8, py + Math.cos(angle) * 8);
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    };

    const raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [localPlayer, remotePlayers, currentFloor]);

  return (
    <div className="hud-panel minimap-panel">
      <div className="panel-header">
        <div className="panel-title">Map — Floor {currentFloor}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={MAP_SIZE}
        height={MAP_SIZE}
        style={{
          width: "100%",
          borderRadius: "8px",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
