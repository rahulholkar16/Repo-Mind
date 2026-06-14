import { motion } from "motion/react";
import React from "react";

export function getC(isDark: boolean) {
  return {
    BG:      isDark ? "#09090B" : "#FDFBF7",
    SURFACE: isDark ? "#151518" : "#F7F4EB",
    DEEP:    isDark ? "#09090B" : "#EEEbe0",
    BORDER:  isDark ? "#232326" : "#E5E7EB",
    TEXT:    isDark ? "#FFFFFF" : "#111827",
    MUTED:   isDark ? "#A1A1AA" : "#6B7280",
    ORANGE:  isDark ? "#FF6B35" : "#E65C00",
    AMBER:   isDark ? "#FCA311" : "#D97706",
    NAVBG:   isDark ? "rgba(9,9,11,0.90)"  : "rgba(253,251,247,0.92)",
    NAVMENU: isDark ? "rgba(9,9,11,0.98)"  : "rgba(253,251,247,0.98)",
    LOGOCLR: isDark ? "#3D3D3D" : "#B0B0B0",
    CODEBG:  isDark ? "#09090B" : "#EEEADE",
    CODECLR: isDark ? "#CBD5E1" : "#374151",
  };
}

export const mono = { fontFamily: "'JetBrains Mono', monospace" } as const;
export const sans = { fontFamily: "'Inter', sans-serif" } as const;

export interface LandingProps {
  onEnterApp: () => void;
  isDark: boolean;
  setIsDark: (v: boolean) => void;
}

export function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{ ...mono, display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", background: `${color}18`, border: `1px solid ${color}38`, color }}>
      {children}
    </span>
  );
}

export function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
