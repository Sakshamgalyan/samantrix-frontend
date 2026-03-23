"use client";

import React from "react";
import { useAppSelector } from "@/store/hooks";

export default function OnlineUsers() {
  const localPlayer = useAppSelector((s) => s.game.localPlayer);
  const remotePlayers = useAppSelector((s) => s.game.remotePlayers);
  const isConnected = useAppSelector((s) => s.game.isConnected);

  const allPlayers = [
    ...(localPlayer ? [{ ...localPlayer, isLocal: true }] : []),
    ...Object.values(remotePlayers).map((p) => ({ ...p, isLocal: false })),
  ];

  return (
    <div className="hud-panel online-users-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span
            className="status-dot"
            style={{ background: isConnected ? "#22c55e" : "#ef4444" }}
          />
          Online — {allPlayers.length}
        </div>
      </div>
      <div className="users-list">
        {allPlayers.map((p) => (
          <div key={p.id} className="user-item">
            <div className="user-avatar-dot" style={{ background: p.color }} />
            <span className="user-name">
              {p.username}
              {p.isLocal && <span className="you-badge">you</span>}
            </span>
            <span className="user-floor">F{p.floor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
