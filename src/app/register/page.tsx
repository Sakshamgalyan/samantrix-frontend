"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerApi } from "@/utils/Apis/auth";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    post: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.mobileNo || !formData.post) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await registerApi(formData);
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
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
          <div className="logo-icon">✨</div>
          <h1 className="modal-title">Join Office</h1>
          <div className="modal-subtitle">Create your virtual ID</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {error && <div className="modal-error text-center">{error}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="modal-input-group">
              <label className="modal-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="modal-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="modal-input-group">
              <label className="modal-label">Role / Post</label>
              <input
                type="text"
                name="post"
                className="modal-input"
                placeholder="Developer"
                value={formData.post}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="modal-input-group">
            <label className="modal-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="modal-input"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="modal-input-group">
            <label className="modal-label">Mobile Number</label>
            <input
              type="tel"
              name="mobileNo"
              className="modal-input"
              placeholder="+1234567890"
              value={formData.mobileNo}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="modal-input-group">
            <label className="modal-label">Password</label>
            <input
              type="password"
              name="password"
              className="modal-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              minLength={6}
            />
          </div>

          <button type="submit" className="modal-btn" disabled={loading}>
            {loading ? "Creating Profile..." : "Register"}
            {!loading && <span className="btn-arrow">→</span>}
          </button>
        </form>

        <div className="modal-hint">
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#818cf8", textDecoration: "none", fontWeight: 600 }}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
