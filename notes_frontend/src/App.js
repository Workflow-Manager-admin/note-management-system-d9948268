import React, { useEffect, useState } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";

// Top-level App to handle theme and authentication navigation
function AppMain() {
  const [theme, setTheme] = useState("light");
  const [showSignup, setShowSignup] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      {isAuthenticated ? (
        <Dashboard />
      ) : showSignup ? (
        <SignupPage onSwitch={() => setShowSignup(false)} />
      ) : (
        <LoginPage onSwitch={() => setShowSignup(true)} />
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <AppMain />
    </AuthProvider>
  );
}

export default App;
