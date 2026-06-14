import { motion } from "motion/react";
import { getC, mono, sans } from "./landing-theme";

const LOGOS = ["Stripe","Vercel","Linear","Anthropic","GitHub","Figma","Shopify","Cloudflare","PlanetScale","Turso"];

export function LogoStrip({ isDark }: { isDark: boolean }) {
  const C = getC(isDark);
  return (
    <section style={{ padding: "44px 0", borderTop: `1px solid ${C.BORDER}`, borderBottom: `1px solid ${C.BORDER}`, overflow: "hidden", position: "relative", background: isDark ? "transparent" : "rgba(0,0,0,0.015)" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <span style={{ ...mono, fontSize: 11, color: C.MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>Trusted by engineers at</span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to right, ${C.BG}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to left, ${C.BG}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: 56, alignItems: "center", whiteSpace: "nowrap", paddingLeft: 40 }}>
          {[...LOGOS, ...LOGOS].map((name, i) => (
            <span key={i} style={{ ...sans, fontSize: 15, fontWeight: 700, color: C.LOGOCLR, userSelect: "none", letterSpacing: "-0.01em" }}>{name}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
