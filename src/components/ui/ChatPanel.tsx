"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleChat } from "@/store/slices/game";
import { sendChatMessage } from "@/socket/socketManager";

export default function ChatPanel() {
  const dispatch = useAppDispatch();
  const chatMessages = useAppSelector((s) => s.game.chatMessages);
  const showChat = useAppSelector((s) => s.game.showChat);
  const localPlayer = useAppSelector((s) => s.game.localPlayer);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Listen for Enter key globally to toggle chat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !showChat) {
        e.preventDefault();
        dispatch(toggleChat());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showChat, dispatch]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg) return;
    sendChatMessage(msg);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent WASD from moving avatar while typing
    if (e.key === "Enter") {
      handleSend();
    }
    if (e.key === "Escape") {
      dispatch(toggleChat());
    }
  };

  const formatTime = (ts: number | undefined) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`hud-panel chat-panel ${showChat ? "open" : "collapsed"}`}>
      {!showChat ? (
        <button
          className="chat-toggle-btn"
          onClick={() => dispatch(toggleChat())}
        >
          💬 Chat <span className="chat-hint">(Enter)</span>
        </button>
      ) : (
        <>
          <div className="chat-header">
            <span className="panel-title">Chat</span>
            <button
              className="chat-close-btn"
              onClick={() => dispatch(toggleChat())}
            >
              ✕
            </button>
          </div>
          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="chat-empty">No messages yet. Say hello! 👋</div>
            ) : (
              chatMessages.map((msg) => {
                const isOwn = msg.playerId === localPlayer?.id;
                return (
                  <div
                    key={msg.id}
                    className={`chat-message ${isOwn ? "own" : ""}`}
                    style={{
                      padding: '8px 12px',
                      background: isOwn ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: isOwn ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      borderBottomRightRadius: isOwn ? '4px' : '12px',
                      borderBottomLeftRadius: !isOwn ? '4px' : '12px',
                      alignSelf: isOwn ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span className="chat-author" style={{ color: msg.color, fontSize: '11px' }}>
                        {msg.username}
                      </span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <span className="chat-text" style={{ fontSize: '13px', lineHeight: 1.4, color: '#e2e8f0' }}>{msg.message}</span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              maxLength={200}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              ↑
            </button>
          </div>
        </>
      )}
    </div>
  );
}
