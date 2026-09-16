"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser, registerSeller as apiRegisterSeller } from "../lib/api/auth";

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
    (async () => await fetchUser())();
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    if (res?.user) {
      setUser(res.user);
    }
    return res;
  };

  const registerSeller = async (sellerData) => {
    const res = await apiRegisterSeller(sellerData);
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

  const isAdmin = user?.role === "Admin";
  const isSeller = user?.role === "Seller" || user?.role === "Admin";
  const isVerifiedSeller = Boolean(user?.isVerifiedSeller);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerSeller,
        logout,
        fetchUser,
        isAdmin,
        isSeller,
        isVerifiedSeller,
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
