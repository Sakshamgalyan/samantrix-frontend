"use client";

import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(onComplete, 600);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  const clampedProgress = Math.min(progress, 100);

  return (
    <div className="modal-overlay" style={{ opacity: fadeOut ? 0 : 1, pointerEvents: fadeOut ? "none" : "auto", transition: "opacity 0.6s ease" }}>
      <div className="modal-bg-animation">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-orb"
            style={
              {
                "--i": i + 1,
                "--color": [
                  "#6366f1",
                  "#8b5cf6",
                  "#ec4899",
                  "#06b6d4",
                  "#22c55e",
                  "#f97316",
                ][i],
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="modal-card" style={{ padding: '60px 40px', alignItems: 'center', width: '360px' }}>
        {/* Logo / Title */}
        <div className="modal-logo" style={{ marginBottom: '40px' }}>
          <div className="logo-icon" style={{ width: '64px', height: '64px', fontSize: '32px' }}>🏢</div>
          <h1 className="modal-title" style={{ fontSize: '32px' }}>Smart Office</h1>
          <div className="modal-subtitle">Loading Virtual Workspace...</div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: "6px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "4px",
            overflow: "hidden",
            position: "relative",
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              width: `${clampedProgress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #6366f1, #a78bfa, #c084fc)",
              borderRadius: "4px",
              transition: "width 0.3s ease",
              boxShadow: "0 0 12px rgba(99,102,241,0.6)",
            }}
          />
        </div>

        {/* Progress text */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 500,
            }}
          >
            {clampedProgress < 30
              ? "Initializing 3D engine..."
              : clampedProgress < 60
                ? "Building environment..."
                : clampedProgress < 90
                  ? "Loading avatars..."
                  : "Almost ready..."}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#e2e8f0",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
            }}
          >
            {Math.round(clampedProgress)}%
          </div>
        </div>
      </div>
    </div>
  );
}
