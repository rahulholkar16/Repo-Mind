"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getC, mono, sans, type LandingProps } from "./landing-theme";
import { RepoBrainMark } from "@/shared/components/RepoBrainMark";

export function Nav({ onEnterApp, isDark, setIsDark }: LandingProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const C = getC(isDark);
  const links = ["Features", "How it works", "Docs"];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const themeBtn = (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsDark(!isDark)}
      className="w-9 h-9 rounded-[9px] flex-shrink-0 hover:border-primary hover:text-primary"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      asChild={false}
    >
      <motion.span whileTap={{ scale: 0.92 }} className="flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">
          <motion.span key={isDark ? "moon" : "sun"} initial={{ rotate: -30, opacity: 0, scale: 0.7 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 30, opacity: 0, scale: 0.7 }} transition={{ duration: 0.18 }} className="flex items-center">
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </Button>
  );

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? C.NAVBG : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.BORDER}` : "1px solid transparent",
        transition: "all 0.35s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RepoBrainMark size={34} isDark={isDark} />
            <span style={{ ...mono, fontSize: 16, fontWeight: 600, color: C.ORANGE, letterSpacing: "-0.02em" }}>RepoBrain</span>
          </div>

          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden-mobile">
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                style={{ ...sans, fontSize: 14, color: C.MUTED, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.TEXT)}
                onMouseLeave={e => (e.currentTarget.style.color = C.MUTED)}
              >{l}</a>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }} className="hidden-mobile">
            {themeBtn}
            <Button
              onClick={onEnterApp}
              className="gap-1.5 rounded-lg"
              style={{ background: C.ORANGE, color: "#fff" }}
            >
              Get started <ArrowRight size={14} />
            </Button>
          </div>

          <div style={{ display: "none", alignItems: "center", gap: 8 }} className="show-mobile">
            {themeBtn}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOpen(o => !o)}
              className="w-9 h-9 rounded-lg"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </Button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 199, background: C.NAVMENU, backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.BORDER}`, padding: "20px 24px 28px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
              {links.map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setOpen(false)}
                  style={{ ...sans, fontSize: 16, color: C.MUTED, padding: "12px 0", textDecoration: "none", borderBottom: `1px solid ${C.BORDER}` }}>
                  {l}
                </a>
              ))}
            </div>
            <Button onClick={onEnterApp} className="w-full rounded-lg" style={{ background: C.ORANGE, color: "#fff" }}>
              Get started →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
