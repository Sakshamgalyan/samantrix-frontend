"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi, profileApi } from "@/utils/Apis/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth";
import Link from "next/link";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      setError("Please enter your email/mobile and password.");
      return;
    }

    setLoading(true);
    try {
      // 1. Login
      await loginApi(formData);
      
      // Wait a tiny bit for the cookie to be registered if the backend sets it
      // or we just fetch profile immediately
      // 2. Fetch Profile to populate Redux
      const user = await profileApi();
      const token = Cookies.get("access_token") || "mock_token"; // We just need a truthy value since the real token is httponly usually or managed securely

      dispatch(setCredentials({ user, token: token as string }));
      
      // 3. Redirect to Office Building
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
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

      <div className="modal-card">
        <div className="modal-logo">
          <div className="logo-icon">🏢</div>
          <h1 className="modal-title">Smart Office</h1>
          <div className="modal-subtitle">Welcome back</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {error && <div className="modal-error text-center">{error}</div>}

          <div className="modal-input-group">
            <label className="modal-label">Email or Mobile Number</label>
            <input
              type="text"
              name="identifier"
              className="modal-input"
              placeholder="user@example.com / 1234567890"
              value={formData.identifier}
              onChange={handleChange}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="modal-input-group">
            <label className="modal-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Password</span>
              <span style={{ color: '#8b5cf6', cursor: 'pointer', fontSize: '11px' }}>Forgot?</span>
            </label>
            <input
              type="password"
              name="password"
              className="modal-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button type="submit" className="modal-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Enter Office"}
            {!loading && <span className="btn-arrow">→</span>}
          </button>
        </form>

        <div className="modal-hint">
          Don't have a desk yet?{" "}
          <Link href="/register" style={{ color: "#818cf8", textDecoration: "none", fontWeight: 600 }}>
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
