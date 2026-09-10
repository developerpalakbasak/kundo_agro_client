"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser } from "../lib/api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getCurrentUser();
      if (res?.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    if (res?.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  const isAdmin = user?.role === "Admin" || user?.role === "Manager";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        fetchUser,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
