"use client";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUsername, setLoading, setLocalPlayer } from "@/store/slices/game";
import { setCredentials, logout } from "@/store/slices/auth";
import { connectSocket, disconnectSocket } from "@/socket/socketManager";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { profileApi } from "@/utils/Apis/auth";
import Cookies from "js-cookie";

// Dynamic import for R3F (no SSR)
const OfficeScene = dynamic(() => import("@/components/3d/OfficeScene"), {
  ssr: false,
});
import HUD from "@/components/ui/HUD";

/* ── Username Entry Modal ──────────────────────────────── */
/* ── Main Page ─────────────────────────────────────────── */
export default function OfficeApp() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.game.isLoading);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);
  
  const [authChecking, setAuthChecking] = useState(true);
  const [joined, setJoined] = useState(false);
  const [showScene, setShowScene] = useState(false);

  const handleJoin = useCallback(
    (name: string, userId: string) => {
      dispatch(setUsername(name));

      // Create a default local player immediately
      const AVATAR_COLORS = [
        "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
        "#f97316", "#eab308", "#22c55e", "#14b8a6",
      ];
      const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      
      dispatch(
        setLocalPlayer({
          id: userId,
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          router.replace("/login");
          return;
        }

        const profileData = await profileApi();
        dispatch(setCredentials({ user: profileData, token }));
        handleJoin(profileData.name || "User", profileData.id);
      } catch (error) {
        console.error("Auth check failed:", error);
        dispatch(logout());
        router.replace("/login");
      } finally {
        setAuthChecking(false);
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    } else if (user && !joined) {
      handleJoin(user.name || "User", user.id);
      setAuthChecking(false);
    }
  }, [isAuthenticated, user, router, dispatch, handleJoin, joined]);

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

  // Stage 1: Auth checking / Loading
  if (authChecking || !joined) {
    return (
      <div className="office-app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0a1a' }}>
        <div style={{ color: '#6366f1', fontFamily: "'Outfit', sans-serif" }}>Verifying Identity...</div>
      </div>
    );
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
