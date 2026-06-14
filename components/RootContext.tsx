"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface RootContextType {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
}

const RootContext = createContext<RootContextType | undefined>(undefined);

export function RootContextProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <RootContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </RootContext.Provider>
  );
}

export function useRootContext() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error("useRootContext must be used within a RootContextProvider");
  }
  return context;
}
