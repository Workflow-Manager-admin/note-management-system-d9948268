import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser") || "null")
  );
  const [token, setToken] = useState(
    localStorage.getItem("authToken") || ""
  );

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
    }
  }, [user, token]);

  // PUBLIC_INTERFACE
  function loginUser(userObj, tokenObj) {
    setUser(userObj);
    setToken(tokenObj.access_token);
  }
  // PUBLIC_INTERFACE
  function logout() {
    setUser(null);
    setToken("");
  }

  const value = { user, token, loginUser, logout, isAuthenticated: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
