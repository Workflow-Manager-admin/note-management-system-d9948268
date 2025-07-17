import React from "react";
import { useAuth } from "../AuthContext";

// PUBLIC_INTERFACE
export default function Navbar({ onLogout }) {
  const { user, isAuthenticated } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="brand">NotesApp</span>
      </div>
      <div className="navbar-center">
        <span className="subtitle">Your Notes, Anywhere</span>
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span className="user-email">{user.email}</span>
            <button className="btn btn-small" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
