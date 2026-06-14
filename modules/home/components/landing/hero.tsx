import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { GitBranch, Zap, ArrowRight, Terminal } from "lucide-react";
import { getC, mono, sans, Tag } from "./landing-theme";

const DEMO_MESSAGES = [
  { role: "user",  text: "Find all places where auth middleware can be bypassed",    delay: 0.6 },
  { role: "tool",  text: "grep_search  ·  skipAuth|bypassMiddleware",               delay: 1.4 },
  { role: "tool",  text: "read_file  ·  src/middleware/auth.ts",                    delay: 1.9 },
  { role: "agent", text: "Found 3 bypass paths. Line 47 has an undocumented `skipAuth` flag that skips JWT verification when NODE_ENV !== 'production'.", delay: 2.6 },
  { role: "code",  text: `if (process.env.NODE_ENV !== 'production'\n  && req.headers['x-skip-auth']) {\n  return next() // ⚠️ bypass\n}`, delay: 3.4 },
];

function HeroDemo({ isDark }: { isDark: boolean }) {
  const [count, setCount] = useState(0);
  const C = getC(isDark);

  useEffect(() => {
    setCount(0);
    const timers = DEMO_MESSAGES.map((msg, i) =>
      setTimeout(() => setCount(i + 1), msg.delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, [isDark]);

  return (
    <div style={{ background: C.SURFACE, borderRadius: 18, border: `1px solid ${C.BORDER}`, overflow: "hidden", boxShadow: isDark ? "0 32px 80px rgba(0,0,0,0.5)" : "0 24px 64px rgba(0,0,0,0.12)" }}>
      <div style={{ padding: "11px 16px", borderBottom: `1px solid ${C.BORDER}`, display: "flex", alignItems: "center", gap: 10, background: isDark ? "transparent" : "rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 12px", borderRadius: 6, background: C.DEEP, border: `1px solid ${C.BORDER}` }}>
            <GitBranch size={11} style={{ color: C.MUTED }} />
            <span style={{ ...mono, fontSize: 11, color: C.MUTED }}>vercel/next.js</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
          <span style={{ ...mono, fontSize: 10, color: C.MUTED }}>connected</span>
        </div>
      </div>

      <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 280 }}>
        {DEMO_MESSAGES.slice(0, count).map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {msg.role === "user" && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ background: C.ORANGE, color: "#fff", padding: "9px 14px", borderRadius: "14px 14px 4px 14px", fontSize: 13, maxWidth: "88%", lineHeight: 1.5 }}>{msg.text}</div>
              </div>
            )}
            {msg.role === "tool" && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: `${C.AMBER}20`, border: `1px solid ${C.AMBER}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Terminal size={10} style={{ color: C.AMBER }} />
                </div>
                <span style={{ ...mono, fontSize: 11, color: C.AMBER, background: `${C.AMBER}12`, border: `1px solid ${C.AMBER}30`, padding: "3px 10px", borderRadius: 999 }}>{msg.text}</span>
              </div>
            )}
            {msg.role === "agent" && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: isDark ? "#232326" : "#E5E7EB", border: `1px solid ${C.BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <span style={{ fontSize: 10 }}>🧠</span>
                </div>
                <div style={{ background: C.DEEP, border: `1px solid ${C.BORDER}`, padding: "9px 14px", borderRadius: "14px 14px 14px 4px", fontSize: 13, color: C.TEXT, lineHeight: 1.55, maxWidth: "88%" }}>{msg.text}</div>
              </div>
            )}
            {msg.role === "code" && (
              <div style={{ marginLeft: 30, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.BORDER}`, background: C.CODEBG }}>
                <div style={{ padding: "6px 12px", borderBottom: `1px solid ${C.BORDER}`, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ ...mono, fontSize: 10, color: C.MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>typescript</span>
                  <span style={{ ...mono, fontSize: 10, color: "#f472b6" }}>⚠ security</span>
                </div>
                <pre style={{ margin: 0, padding: "12px", ...mono, fontSize: 11, color: C.CODECLR, lineHeight: 1.65 }}><code>{msg.text}</code></pre>
              </div>
            )}
          </motion.div>
        ))}
        {count < DEMO_MESSAGES.length && count > 0 && (
          <div style={{ display: "flex", gap: 5, alignItems: "center", paddingLeft: 30 }}>
            {[0,1,2].map(i => (
              <motion.div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: C.MUTED }}
                animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Hero({ onEnterApp, isDark }: { onEnterApp: () => void; isDark: boolean }) {
  const C = getC(isDark);
  const stats = [
    { value: "12.4k", label: "Engineers" },
    { value: "2.8M",  label: "Analyses run" },
    { value: "<2s",   label: "Response time" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <section style={{ position: "relative", paddingTop: 140, paddingBottom: 100, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.022)" : "rgba(0,0,0,0.04)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.022)" : "rgba(0,0,0,0.04)"} 1px, transparent 1px)`, backgroundSize: "64px 64px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 800, height: 600, background: `radial-gradient(ellipse, ${C.ORANGE}${isDark ? "0e" : "07"} 0%, transparent 65%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="hero-grid">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Tag color={C.ORANGE}><Zap size={10} /> Now with Claude 3.5 Sonnet</Tag>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            style={{ ...sans, fontSize: "clamp(38px, 5vw, 68px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.03em", color: C.TEXT, margin: "22px 0 0" }}>
            Understand any<br />
            <span style={{ backgroundImage: `linear-gradient(135deg, ${C.ORANGE}, ${C.AMBER})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              GitHub repo
            </span><br />
            in minutes
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ ...sans, fontSize: 18, color: C.MUTED, lineHeight: 1.7, margin: "24px 0 0", maxWidth: 480 }}>
            RepoBrain connects to any repository and gives you an AI agent that navigates, explains, and analyzes your codebase in real time — using grep, AST analysis, and file reading.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
            <button onClick={onEnterApp}
              style={{ ...sans, padding: "14px 28px", borderRadius: 10, border: "none", background: C.ORANGE, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.ORANGE}38`, transition: "transform 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "none")}
            >Start for free <ArrowRight size={16} /></button>
            <button onClick={onEnterApp}
              style={{ ...sans, padding: "14px 24px", borderRadius: 10, border: `1px solid ${C.BORDER}`, background: "transparent", color: C.TEXT, fontSize: 15, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "border-color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = isDark ? "#555" : "#999")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.BORDER)}
            ><span>▶</span> Live demo</button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
            style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.BORDER}`, flexWrap: "wrap" }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ ...mono, fontSize: 22, fontWeight: 600, color: C.TEXT }}>{s.value}</div>
                <div style={{ ...sans, fontSize: 13, color: C.MUTED, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.25 }}>
          <HeroDemo isDark={isDark} />
        </motion.div>
      </div>
    </section>
  );
}
