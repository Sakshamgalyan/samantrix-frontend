"use client";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUsername, setLoading, setLocalPlayer } from "@/store/slices/game";
import { connectSocket, disconnectSocket } from "@/socket/socketManager";
import LoadingScreen from "@/components/ui/LoadingScreen";
import HUD from "@/components/ui/HUD";

// Dynamic import for R3F (no SSR)
const OfficeScene = dynamic(() => import("@/components/3d/OfficeScene"), {
  ssr: false,
});

/* ── Username Entry Modal ──────────────────────────────── */
function UsernameModal({ onJoin }: { onJoin: (name: string) => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (trimmed.length > 16) {
      setError("Name must be 16 characters or less");
      return;
    }
    onJoin(trimmed);
  };

  return (
    <div className="modal-overlay">
      {/* Animated background */}
      <div className="modal-bg-animation">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-orb"
            style={
              {
                "--i": i,
                "--color": [
                  "#6366f1",
                  "#8b5cf6",
                  "#ec4899",
                  "#06b6d4",
                  "#22c55e",
                  "#f97316",
                  "#a855f7",
                  "#14b8a6",
                ][i],
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="modal-card">
        {/* Logo */}
        <div className="modal-logo">
          <div className="logo-icon">🏢</div>
          <h1 className="modal-title">Smart Office</h1>
          <p className="modal-subtitle">Enter the virtual workspace</p>
        </div>

        {/* Input */}
        <div className="modal-input-group">
          <label className="modal-label">Your display name</label>
          <input
            type="text"
            className="modal-input"
            placeholder="e.g. Alex, Designer, DevLead..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            autoFocus
            maxLength={16}
          />
          {error && <span className="modal-error">{error}</span>}
        </div>

        {/* Submit */}
        <button type="submit" className="modal-btn" disabled={!name.trim()}>
          Join Office
          <span className="btn-arrow">→</span>
        </button>

        {/* Hint */}
        <p className="modal-hint">
          Use <strong>WASD</strong> to move &middot; <strong>Enter</strong> to
          chat
        </p>
      </form>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function OfficeApp() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.game.isLoading);
  const username = useAppSelector((s) => s.game.username);
  const [joined, setJoined] = useState(false);
  const [showScene, setShowScene] = useState(false);

  const handleJoin = useCallback(
    (name: string) => {
      dispatch(setUsername(name));

      // Create a default local player immediately so the avatar
      // is visible even before the socket connects
      const AVATAR_COLORS = [
        "#6366f1",
        "#8b5cf6",
        "#ec4899",
        "#f43f5e",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#14b8a6",
      ];
      const color =
        AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      dispatch(
        setLocalPlayer({
          id: "local-" + Date.now(),
          username: name,
          color,
          position: { x: 0, y: 0, z: 5 },
          rotation: { y: 0 },
          floor: 1,
          isMoving: false,
        }),
      );

      setJoined(true);
      connectSocket(name);
    },
    [dispatch],
  );

  const handleLoadingComplete = useCallback(() => {
    dispatch(setLoading(false));
    setShowScene(true);
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  // Stage 1: Username modal
  if (!joined) {
    return <UsernameModal onJoin={handleJoin} />;
  }

  // Stage 2: Loading screen
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // Stage 3: 3D Office + HUD
  return (
    <div className="office-app">
      <OfficeScene />
      <HUD />
    </div>
  );
}
