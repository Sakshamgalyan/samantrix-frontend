"use client";

import React from "react";
import { useAppSelector } from "@/store/hooks";

export default function FloorIndicator() {
  const currentFloor = useAppSelector((s) => s.game.currentFloor);

  return (
    <div className="hud-panel floor-indicator-panel">
      <div className="floor-badge">
        <span className="floor-icon">🏢</span>
        <span className="floor-text">Floor {currentFloor}</span>
      </div>
      <div className="floor-dots">
        {[1, 2].map((f) => (
          <div
            key={f}
            className={`floor-dot ${f === currentFloor ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
