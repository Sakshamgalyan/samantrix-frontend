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
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${
                    msg.playerId === localPlayer?.id ? "own" : ""
                  }`}
                >
                  <span className="chat-author" style={{ color: msg.color }}>
                    {msg.username}
                  </span>
                  <span className="chat-text">{msg.message}</span>
                </div>
              ))
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
