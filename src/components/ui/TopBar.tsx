"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/auth";
import { useRouter } from "next/navigation";
import { LogOut, User, Layers, Settings } from "lucide-react";
import { teleportPlayer } from "@/components/3d/LocalAvatar";
import CustomizationModal from "./CustomizationModal";

export default function TopBar() {
  const user = useAppSelector((s) => s.auth.user);
  const currentFloor = useAppSelector((s) => s.game.currentFloor);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isCustomizing, setIsCustomizing] = React.useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/login");
  };

  const handleFloorChange = (floor: number) => {
    if (floor !== currentFloor) {
      teleportPlayer(floor);
    }
  };

  if (!user) return null;

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '12px 24px', 
        background: 'rgba(15, 10, 30, 0.65)', 
        backdropFilter: 'blur(24px)', 
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        pointerEvents: 'auto',
        fontFamily: "'Outfit', sans-serif"
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
          {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2 }}>{user.name}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>{user.post || 'Employee'}</span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#475569' }} />
            <span>ID: {user.employeeId || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '6px', display: 'flex', gap: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
          {[1, 2].map(floor => (
            <button
              key={floor}
              onClick={() => handleFloorChange(floor)}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                background: currentFloor === floor ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: currentFloor === floor ? '#818cf8' : '#94a3b8',
                fontWeight: currentFloor === floor ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Layers size={14} /> F{floor}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setIsCustomizing(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)' }}
        >
          <Settings size={16} /> Customize
        </button>

        <button 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <CustomizationModal 
        isOpen={isCustomizing} 
        onClose={() => setIsCustomizing(false)} 
      />
    </div>
  );
}
