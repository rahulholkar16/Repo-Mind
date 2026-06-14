import { Zap, ArrowRight } from "lucide-react";
import { getC, mono, sans, Tag, FadeUp } from "./landing-theme";

export function FinalCTA({ onEnterApp, isDark }: { onEnterApp: () => void; isDark: boolean }) {
  const C = getC(isDark);
  return (
    <section style={{ padding: "120px 24px", textAlign: "center", position: "relative", overflow: "hidden", borderTop: `1px solid ${C.BORDER}` }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, background: `radial-gradient(ellipse, ${C.ORANGE}${isDark ? "12" : "08"} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
        <FadeUp>
          <Tag color={C.ORANGE}><Zap size={10} /> Get started now</Tag>
          <h2 style={{ ...sans, fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em", color: C.TEXT, margin: "24px 0 20px", lineHeight: 1.08 }}>
            Ready to understand<br />your codebase?
          </h2>
          <p style={{ ...sans, fontSize: 18, color: C.MUTED, lineHeight: 1.65, margin: "0 0 40px" }}>
            Join 12,400+ engineers who use RepoBrain to navigate unfamiliar code, catch bugs early, and onboard in days instead of months.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onEnterApp}
              style={{ ...sans, padding: "16px 36px", borderRadius: 12, border: "none", background: C.ORANGE, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 12px 40px ${C.ORANGE}38`, transition: "transform 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "none")}
            >Start for free <ArrowRight size={16} /></button>
            <button onClick={onEnterApp}
              style={{ ...sans, padding: "16px 30px", borderRadius: 12, border: `1px solid ${C.BORDER}`, background: "transparent", color: C.TEXT, fontSize: 16, fontWeight: 500, cursor: "pointer", transition: "border-color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = isDark ? "#555" : "#999")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.BORDER)}
            >Book a demo</button>
          </div>
          <p style={{ ...mono, fontSize: 12, color: C.MUTED, marginTop: 20, opacity: 0.7 }}>No credit card required · Cancel anytime · SOC 2 Type II</p>
        </FadeUp>
      </div>
    </section>
  );
}
