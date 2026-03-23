"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getSocket } from "@/socket/socketManager";

export default function ConnectionStatus() {
  const isConnected = useAppSelector((s) => s.game.isConnected);
  const [ping, setPing] = useState(0);

  useEffect(() => {
    if (!isConnected) {
      setPing(0);
      return;
    }

    let isMounted = true;
    const interval = setInterval(() => {
      const socket = getSocket();
      if (socket && socket.connected) {
        const start = Date.now();
        socket.volatile.emit("ping", () => {
          if (isMounted) setPing(Date.now() - start);
        });
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isConnected]);

  let statusColor = "#ef4444"; // disconnected
  if (isConnected) {
    statusColor = ping > 150 ? "#eab308" : "#22c55e"; // warn vs good
  }

  return (
    <div 
      className="hud-panel connection-panel" 
      style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: statusColor,
          boxShadow: `0 0 8px ${statusColor}`,
          transition: 'all 0.3s ease'
        }}
      />
      <span style={{ fontSize: "12px", fontWeight: 700, color: "#e2e8f0", fontFamily: "'Outfit', sans-serif" }}>
        {isConnected ? `${ping} ms` : "Reconnecting..."}
      </span>
    </div>
  );
}
