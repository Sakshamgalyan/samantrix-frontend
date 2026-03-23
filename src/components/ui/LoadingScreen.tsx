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
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f0a1a 0%, #1a1145 40%, #0d1b2a 100%)",
        transition: "opacity 0.6s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      {/* Animated orbs background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          opacity: 0.3,
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${120 + i * 40}px`,
              height: `${120 + i * 40}px`,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${
                [
                  "#6366f1",
                  "#8b5cf6",
                  "#ec4899",
                  "#06b6d4",
                  "#22c55e",
                  "#f97316",
                ][i]
              }40, transparent)`,
              left: `${15 + i * 14}%`,
              top: `${20 + ((i * 23) % 50)}%`,
              animation: `float ${6 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Logo / Title */}
      <div
        style={{
          fontSize: "42px",
          fontWeight: 800,
          background: "linear-gradient(135deg, #818cf8, #c084fc, #f472b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "8px",
          letterSpacing: "-1px",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        Smart Office
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "#94a3b8",
          marginBottom: "48px",
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}
      >
        Virtual Workspace
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "280px",
          height: "4px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${clampedProgress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #6366f1, #a78bfa, #c084fc)",
            borderRadius: "2px",
            transition: "width 0.3s ease",
            boxShadow: "0 0 12px rgba(99,102,241,0.4)",
          }}
        />
      </div>

      {/* Progress text */}
      <div
        style={{
          marginTop: "16px",
          fontSize: "12px",
          color: "#64748b",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 500,
        }}
      >
        {clampedProgress < 30
          ? "Initializing 3D engine..."
          : clampedProgress < 60
            ? "Building office environment..."
            : clampedProgress < 90
              ? "Loading avatars..."
              : "Almost ready..."}
      </div>
      <div
        style={{
          marginTop: "4px",
          fontSize: "20px",
          color: "#a78bfa",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
        }}
      >
        {Math.round(clampedProgress)}%
      </div>
    </div>
  );
}
