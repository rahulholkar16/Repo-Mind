import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sun, Moon, Menu, X } from "lucide-react";
import { getC, mono, sans, type LandingProps } from "./landing-theme";
import { RepoBrainMark } from "@/components/RepoBrainMark";

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
    <motion.button
      onClick={() => setIsDark(!isDark)}
      whileTap={{ scale: 0.92 }}
      style={{
        width: 36, height: 36, borderRadius: 9,
        border: `1px solid ${C.BORDER}`,
        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
        color: C.MUTED, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s", flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.ORANGE; e.currentTarget.style.color = C.ORANGE; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.BORDER; e.currentTarget.style.color = C.MUTED; }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait">
        <motion.span key={isDark ? "moon" : "sun"} initial={{ rotate: -30, opacity: 0, scale: 0.7 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 30, opacity: 0, scale: 0.7 }} transition={{ duration: 0.18 }} style={{ display: "flex", alignItems: "center" }}>
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
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
            <button onClick={onEnterApp}
              style={{ ...sans, padding: "8px 20px", borderRadius: 8, border: "none", background: C.ORANGE, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >Get started <ArrowRight size={14} /></button>
          </div>

          <div style={{ display: "none", alignItems: "center", gap: 8 }} className="show-mobile">
            {themeBtn}
            <button onClick={() => setOpen(o => !o)}
              style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.BORDER}`, background: "transparent", color: C.MUTED, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
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
            <button onClick={onEnterApp} style={{ ...sans, padding: "13px", borderRadius: 8, border: "none", background: C.ORANGE, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }}>
              Get started →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
