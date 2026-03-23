"use client";

import React from "react";
import OnlineUsers from "./OnlineUsers";
import MiniMap from "./MiniMap";
import FloorIndicator from "./FloorIndicator";
import ChatPanel from "./ChatPanel";

export default function HUD() {
  return (
    <div className="hud-container">
      {/* Top-left: Floor indicator */}
      <div className="hud-top-left">
        <FloorIndicator />
      </div>

      {/* Top-right: Mini map */}
      <div className="hud-top-right">
        <MiniMap />
      </div>

      {/* Right sidebar: Online users */}
      <div className="hud-right">
        <OnlineUsers />
      </div>

      {/* Bottom center: Chat */}
      <div className="hud-bottom-center">
        <ChatPanel />
      </div>

      {/* Controls hint */}
      <div className="hud-bottom-left">
        <div className="controls-hint">
          <div className="controls-keys">
            <span className="key">W</span>
            <span className="key">A</span>
            <span className="key">S</span>
            <span className="key">D</span>
          </div>
          <span className="controls-label">Move</span>
        </div>
      </div>
    </div>
  );
}
