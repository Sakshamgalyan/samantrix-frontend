"use client";

import React from "react";
import OnlineUsers from "./OnlineUsers";
import MiniMap from "./MiniMap";
import FloorIndicator from "./FloorIndicator";
import ChatPanel from "./ChatPanel";
import ConnectionStatus from "./ConnectionStatus";
import TopBar from "./TopBar";

export default function HUD() {
  return (
    <div className="hud-container">
      {/* Top Bar spanning across */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <TopBar />
      </div>

      {/* Top-left: Floor indicator */}
      <div className="hud-top-left" style={{ top: '90px' }}>
        <FloorIndicator />
      </div>

      {/* Top-right: Mini map & Status */}
      <div className="hud-top-right" style={{ top: '90px' }}>
        <ConnectionStatus />
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
