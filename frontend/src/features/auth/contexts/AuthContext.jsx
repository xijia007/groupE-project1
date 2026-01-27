/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function getInitialToken() {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(getInitialToken);

  const isLoggedIn = Boolean(accessToken);

  const login = (token) => {
    if (!token) return;
    setAccessToken(token);
    try {
      localStorage.setItem("accessToken", token);
    } catch {
      // ignore storage write errors
    }
  };

  const logout = () => {
    setAccessToken(null);
    try {
      localStorage.removeItem("accessToken");
    } catch {
      // ignore storage write errors
    }
  };

  const refreshFromStorage = () => {
    setAccessToken(getInitialToken());
  };

  const value = useMemo(
    () => ({
      accessToken,
      isLoggedIn,
      login,
      logout,
      refreshFromStorage,
    }),
    [accessToken, isLoggedIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}
