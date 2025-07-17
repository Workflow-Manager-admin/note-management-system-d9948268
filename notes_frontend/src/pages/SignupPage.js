import React, { useState } from "react";
import { signup } from "../api";
import { useAuth } from "../AuthContext";

// PUBLIC_INTERFACE
export default function SignupPage({ onSwitch }) {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await signup(email, password);
      loginUser({ email }, res);
    } catch (e) {
      setErr(e?.detail || "Signup failed");
    }
  }

  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button type="submit" className="btn btn-large">
          Sign Up
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <button className="btn-link" onClick={onSwitch}>
          Log in
        </button>
      </p>
    </div>
  );
}
