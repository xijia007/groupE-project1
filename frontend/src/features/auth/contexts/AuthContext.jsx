/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";

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
  const [user, setUser] = useState(null);

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

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    try {
      localStorage.removeItem("accessToken");
    } catch {
      // ignore storage write errors
    }
  }, []);

  const refreshFromStorage = () => {
    setAccessToken(getInitialToken());
  };

  const fetchUser = useCallback(async () => {
    if (!accessToken) {
        setUser(null);
        return;
    }
    try {
        const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
            const data = await res.json();
            setUser(data.user);
        } else {
            // 如果 token 失效，自动 logout
            if (res.status === 401) {
                logout();
            }
        }
    } catch (err) {
        console.error("Failed to fetch user:", err);
    }
  }, [accessToken, logout]);

  // 当 token 变化时，自动 fetch user
  useEffect(() => {
    if (accessToken) {
        fetchUser();
    } else {
        setUser(null);
    }
  }, [accessToken, fetchUser]);

  const value = useMemo(
    () => ({
      accessToken,
      isLoggedIn,
      user,
      fetchUser,
      login,
      logout,
      refreshFromStorage,
    }),
    [accessToken, isLoggedIn, user, fetchUser, logout],
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
