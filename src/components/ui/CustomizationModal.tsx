"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLocalPlayer } from "@/store/slices/game";
import ApiClient from "@/lib/apiClient";
import { toast } from "sonner";

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6", "#a855f7", "#e11d48",
];

const HAIR_STYLES = ["none", "short", "long", "spiky", "mohawk"];
const ACCESSORIES = ["none", "glasses", "hat", "headphones"];

export default function CustomizationModal({ isOpen, onClose }: CustomizationModalProps) {
  const dispatch = useAppDispatch();
  const localPlayer = useAppSelector((state) => state.game.localPlayer);
  const [loading, setLoading] = useState(false);

  const [currentCustom, setCurrentCustom] = useState({
    color: localPlayer?.color || "#6366f1",
    hairStyle: localPlayer?.customization?.hairStyle || "none",
    accessory: localPlayer?.customization?.accessory || "none",
  });

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await ApiClient.patch("/auth/profile", {
        customization: currentCustom,
      });
      
      if (localPlayer) {
        dispatch(setLocalPlayer({
          ...localPlayer,
          color: currentCustom.color,
          customization: {
            hairStyle: currentCustom.hairStyle,
            accessory: currentCustom.accessory,
          }
        }));
      }
      
      toast.success("Avatar updated!");
      onClose();
    } catch (error) {
      toast.error("Failed to save customization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div className="modal-logo">
          <div className="logo-icon">👕</div>
          <h2 className="modal-title">Customize Avatar</h2>
          <div className="modal-subtitle">Personalize your digital presence</div>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px', 
          marginTop: '20px', 
          maxHeight: '60vh', 
          overflowY: 'auto',
          paddingRight: '8px',
          paddingBottom: '8px'
        }}>
          {/* Color Selection */}
          <div className="customization-section">
            <label className="modal-label" style={{ opacity: 0.8, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avatar Color</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginTop: '8px' }}>
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentCustom({ ...currentCustom, color })}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: '10px',
                    background: color,
                    border: currentCustom.color === color ? '3px solid rgba(255,255,255,0.9)' : '2px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    boxShadow: currentCustom.color === color ? `0 0 12px ${color}80` : 'none',
                    transform: currentCustom.color === color ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div className="customization-section">
            <label className="modal-label" style={{ opacity: 0.8, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hair Style</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {HAIR_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => setCurrentCustom({ ...currentCustom, hairStyle: style })}
                  className={`modal-btn ${currentCustom.hairStyle === style ? '' : 'btn-secondary'}`}
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '13px',
                    borderRadius: '10px',
                    background: currentCustom.hairStyle === style ? undefined : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.2s'
                  }}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className="customization-section">
            <label className="modal-label" style={{ opacity: 0.8, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accessory</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {ACCESSORIES.map((acc) => (
                <button
                  key={acc}
                  onClick={() => setCurrentCustom({ ...currentCustom, accessory: acc })}
                  className={`modal-btn ${currentCustom.accessory === acc ? '' : 'btn-secondary'}`}
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '13px',
                    borderRadius: '10px',
                    background: currentCustom.accessory === acc ? undefined : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.2s'
                  }}
                >
                  {acc.charAt(0).toUpperCase() + acc.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button 
            onClick={onClose} 
            className="modal-btn btn-secondary" 
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="modal-btn" 
            style={{ flex: 2, borderRadius: '12px' }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
