import { Globe, MessageSquare, Cpu, ChevronRight } from "lucide-react";
import { getC, mono, sans, Tag, FadeUp } from "./landing-theme";

const STEPS = [
  { num: "01", icon: Globe,         color: "#FF6B35", title: "Connect a repository",  desc: "Paste any GitHub URL — public or private. RepoBrain indexes the repo in seconds, building a searchable model of the entire codebase.", detail: "github.com/vercel/next.js → indexed in 3.2s" },
  { num: "02", icon: MessageSquare, color: "#3B82F6", title: "Ask in plain English",  desc: "No query language needed. Ask like you'd ask a senior teammate: \"Why does this crash?\" or \"Explain the data access layer.\"",       detail: "Natural language → tool calls → answer" },
  { num: "03", icon: Cpu,           color: "#10B981", title: "Get grounded analysis", desc: "Every answer cites exact file paths and line numbers. RepoBrain shows its work — you can see every tool call it made.",                 detail: "Cited: auth/middleware.ts:47, session.ts:112" },
];

export function HowItWorks({ isDark }: { isDark: boolean }) {
  const C = getC(isDark);
  return (
    <section id="how-it-works" style={{ padding: "100px 24px", background: isDark ? `${C.SURFACE}80` : `${C.SURFACE}cc`, borderTop: `1px solid ${C.BORDER}`, borderBottom: `1px solid ${C.BORDER}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeUp>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <Tag color={C.ORANGE}><ChevronRight size={10} /> How it works</Tag>
            <h2 style={{ ...sans, fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, letterSpacing: "-0.025em", color: C.TEXT, margin: "20px 0 16px" }}>
              From URL to insight in seconds
            </h2>
            <p style={{ ...sans, fontSize: 17, color: C.MUTED, maxWidth: 440, margin: "0 auto", lineHeight: 1.65 }}>
              No setup, no config, no waiting. Just paste and ask.
            </p>
          </div>
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, position: "relative" }} className="steps-grid">
          <div style={{ position: "absolute", top: 56, left: "16.5%", right: "16.5%", height: 1, background: `linear-gradient(to right, ${C.BORDER}, ${C.ORANGE}60, ${C.BORDER})`, pointerEvents: "none" }} className="hide-on-small" />

          {STEPS.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.12}>
              <div style={{ padding: "0 20px", textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-flex", marginBottom: 28 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${step.color}18`, border: `1px solid ${step.color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <step.icon size={26} style={{ color: step.color }} />
                  </div>
                  <div style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: C.BG, border: `1px solid ${step.color}60`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ ...mono, fontSize: 9, fontWeight: 600, color: step.color }}>{step.num}</span>
                  </div>
                </div>
                <h3 style={{ ...sans, fontSize: 19, fontWeight: 700, color: C.TEXT, margin: "0 0 12px", letterSpacing: "-0.02em" }}>{step.title}</h3>
                <p style={{ ...sans, fontSize: 14, color: C.MUTED, lineHeight: 1.65, margin: "0 0 16px" }}>{step.desc}</p>
                <div style={{ display: "inline-block", padding: "6px 12px", borderRadius: 8, background: C.DEEP, border: `1px solid ${C.BORDER}` }}>
                  <span style={{ ...mono, fontSize: 11, color: step.color }}>{step.detail}</span>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
