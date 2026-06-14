import { getC, mono, sans } from "./landing-theme";
import { RepoBrainMark } from "@/components/RepoBrainMark";

const FOOTER_COLS = [
  { heading: "Product", links: ["Features", "How it works", "Changelog", "Roadmap"] },
  { heading: "Docs",    links: ["Getting started", "API reference", "Tool catalog", "Examples"] },
  { heading: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { heading: "Legal",   links: ["Privacy", "Terms", "Security"] },
];

export function Footer({ isDark }: { isDark: boolean }) {
  const C = getC(isDark);
  return (
    <footer style={{ borderTop: `1px solid ${C.BORDER}`, padding: "64px 24px 40px", background: isDark ? "transparent" : "rgba(0,0,0,0.015)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 52 }} className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <RepoBrainMark size={32} isDark={isDark} />
              <span style={{ ...mono, fontSize: 15, fontWeight: 600, color: C.ORANGE }}>RepoBrain</span>
            </div>
            <p style={{ ...sans, fontSize: 13, color: C.MUTED, lineHeight: 1.65, margin: "0 0 20px", maxWidth: 230 }}>
              The AI agent that understands your codebase so your team doesn&apos;t have to start from scratch.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["𝕏", "GH", "Li"].map(s => (
                <div key={s} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = isDark ? "#555" : "#999")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.BORDER)}>
                  <span style={{ ...mono, fontSize: 11, color: C.MUTED }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <div style={{ ...mono, fontSize: 11, fontWeight: 600, color: C.MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>{col.heading}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ ...sans, fontSize: 13, color: C.MUTED, textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.TEXT)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.MUTED)}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${C.BORDER}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ ...sans, fontSize: 13, color: C.MUTED }}>© 2025 RepoBrain, Inc. All rights reserved.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
            <span style={{ ...mono, fontSize: 11, color: C.MUTED }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
