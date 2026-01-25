/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
  const [isAdmin, setIsAdmin] = useState(false);

  const isLoggedIn = Boolean(accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/auth/check", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });
        setIsAdmin(res.ok);
      } catch {
        // network error / aborted request
        setIsAdmin(false);
      }
    })();

    return () => controller.abort();
  }, [accessToken]);

  const login = (token, adminStatus = false) => {
    if (!token) return;
    setAccessToken(token);
    setIsAdmin(adminStatus);
    try {
      localStorage.setItem("accessToken", token);
    } catch {
      // ignore storage write errors
    }
  };

  const logout = () => {
    setAccessToken(null);
    setIsAdmin(false);
    try {
      localStorage.removeItem("accessToken");
    } catch {
      // ignore storage write errors
    }
  };

  const refreshFromStorage = () => {
    const token = getInitialToken();
    setAccessToken(token);
    if (!token) setIsAdmin(false);
  };

  const value = useMemo(
    () => ({
      accessToken,
      isLoggedIn,
      isAdmin,
      login,
      logout,
      refreshFromStorage,
    }),
    [accessToken, isLoggedIn, isAdmin],
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
