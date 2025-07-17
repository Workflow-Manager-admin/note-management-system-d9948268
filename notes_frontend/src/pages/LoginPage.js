import React, { useState } from "react";
import { login } from "../api";
import { useAuth } from "../AuthContext";

// PUBLIC_INTERFACE
export default function LoginPage({ onSwitch }) {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await login(email, password);
      loginUser({ email }, res);
    } catch (e) {
      setErr(e?.detail || "Login failed");
    }
  }

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-large">
          Login
        </button>
      </form>
      <p>
        Don&apos;t have an account?{" "}
        <button className="btn-link" onClick={onSwitch}>
          Sign up
        </button>
      </p>
    </div>
  );
}
