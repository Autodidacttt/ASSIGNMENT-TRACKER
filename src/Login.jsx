import React, { useState } from "react";
import { authAPI } from "./api";

function Login({ setUser }) {
  const [mode, setMode]         = useState("login");   // "login" | "signup"
  const [role, setRole]         = useState("student"); // "student" | "admin"
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let data;
      if (mode === "signup") {
        data = await authAPI.register({ name, email, password });
      } else {
        data = await authAPI.login({ email, password });
      }
      // Check role matches selected tab
      if (role === "admin" && data.user.role !== "admin") {
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }
      setUser(data.user);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-brand">
          <div className="login-logo">AT</div>
          <div className="login-brand-name">Assignment Tracker</div>
        </div>

        {/* Role toggle */}
        <div className="role-toggle">
          <button
            className={`role-btn ${role === "student" ? "active" : ""}`}
            onClick={() => { setRole("student"); setError(""); }}
          >🎓 Student</button>
          <button
            className={`role-btn ${role === "admin" ? "active" : ""}`}
            onClick={() => { setRole("admin"); setMode("login"); setError(""); }}
          >🛡 Admin</button>
        </div>

        {/* Sign in / Sign up tabs (students only) */}
        {role === "student" && (
          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => { setMode("login"); setError(""); }}
            >Sign In</button>
            <button
              className={`mode-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => { setMode("signup"); setError(""); }}
            >Sign Up</button>
          </div>
        )}

        <h1 className="title">
          {role === "admin" ? "Admin Login" : mode === "signup" ? "Create Account" : "Welcome Back"}
        </h1>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && role === "student" && (
            <div className="inputBox">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="inputBox">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="inputBox">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="loginBtn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : role === "admin"
              ? "Login as Admin"
              : mode === "signup"
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        {role === "admin" && (
          <div className="login-hint">
            Admin accounts are created by the system administrator.
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
