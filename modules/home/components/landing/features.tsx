import { Terminal, Lock, Layers, GitMerge, MessageSquare, BookOpen, Activity } from "lucide-react";
import { getC, mono, sans, Tag, FadeUp } from "./landing-theme";

const TOOL_BADGES = [
  { name: "list_directory",  color: "#F59E0B" },
  { name: "grep_search",     color: "#3B82F6" },
  { name: "read_file",       color: "#10B981" },
  { name: "find_function",   color: "#EC4899" },
  { name: "analyze_imports", color: "#F97316" },
  { name: "git_history",     color: "#8B5CF6" },
];

export function Features({ isDark }: { isDark: boolean }) {
  const C = getC(isDark);

  const card = (style: React.CSSProperties = {}) => ({
    background: C.SURFACE, border: `1px solid ${C.BORDER}`, borderRadius: 20,
    padding: "28px", height: "100%", position: "relative" as const, overflow: "hidden" as const, transition: "border-color 0.2s",
    ...style,
  });

  const hoverBorder = isDark ? "#3a3a3a" : "#ccc";

  return (
    <section id="features" style={{ padding: "110px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <FadeUp>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <Tag color={C.AMBER}><Activity size={10} /> Capabilities</Tag>
          <h2 style={{ ...sans, fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.025em", color: C.TEXT, margin: "20px 0 16px" }}>
            Everything you need to<br />master any codebase
          </h2>
          <p style={{ ...sans, fontSize: 18, color: C.MUTED, maxWidth: 540, margin: "0 auto", lineHeight: 1.65 }}>
            RepoBrain uses specialized tools grounded in real source code — not hallucinations.
          </p>
        </div>
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="bento-grid">

        <FadeUp delay={0} className="bento-wide">
          <div style={{ ...card({ padding: "32px" }), gridColumn: "span 2" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = hoverBorder)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.BORDER)}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${C.ORANGE}15, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.ORANGE}18`, border: `1px solid ${C.ORANGE}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Terminal size={20} style={{ color: C.ORANGE }} />
            </div>
            <h3 style={{ ...sans, fontSize: 22, fontWeight: 700, color: C.TEXT, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Real-time tool-powered analysis</h3>
            <p style={{ ...sans, fontSize: 15, color: C.MUTED, lineHeight: 1.65, margin: "0 0 24px" }}>The agent doesn&apos;t guess — it calls real tools to navigate directories, read files, grep for patterns, and trace function calls before answering.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TOOL_BADGES.map(t => (
                <span key={t.name} style={{ ...mono, fontSize: 11, fontWeight: 600, color: t.color, background: `${t.color}14`, border: `1px solid ${t.color}30`, padding: "4px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 5 }}>
                  <Terminal size={9} /> {t.name}
                </span>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.06}>
          <div style={card()}
            onMouseEnter={e => (e.currentTarget.style.borderColor = hoverBorder)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.BORDER)}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.AMBER}18`, border: `1px solid ${C.AMBER}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Lock size={20} style={{ color: C.AMBER }} />
            </div>
            <h3 style={{ ...sans, fontSize: 19, fontWeight: 700, color: C.TEXT, margin: "0 0 10px", letterSpacing: "-0.02em" }}>Private repo support</h3>
            <p style={{ ...sans, fontSize: 14, color: C.MUTED, lineHeight: 1.6, margin: "0 0 20px" }}>Connect private repos with a GitHub token. Credentials are never stored — only used for the current session.</p>
            <div style={{ padding: "10px 14px", borderRadius: 10, background: C.DEEP, border: `1px solid ${C.BORDER}` }}>
              <div style={{ ...mono, fontSize: 11, color: C.MUTED, marginBottom: 5 }}>$ repo connect</div>
              <div style={{ ...mono, fontSize: 11, color: "#10B981" }}>✓ github.com/acme/internal-api</div>
              <div style={{ ...mono, fontSize: 11, color: C.MUTED, opacity: 0.6 }}>✓ Token verified · Read-only</div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.04}>
          <div style={card()}
            onMouseEnter={e => (e.currentTarget.style.borderColor = hoverBorder)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.BORDER)}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#8B5CF618", border: "1px solid #8B5CF630", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Layers size={20} style={{ color: "#8B5CF6" }} />
            </div>
            <h3 style={{ ...sans, fontSize: 19, fontWeight: 700, color: C.TEXT, margin: "0 0 10px", letterSpacing: "-0.02em" }}>Multi-file reasoning</h3>
            <p style={{ ...sans, fontSize: 14, color: C.MUTED, lineHeight: 1.6, margin: "0 0 20px" }}>Trace data flow across dozens of files. RepoBrain builds a mental model of your entire codebase, not just the file you&apos;re viewing.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {["auth/middleware.ts", "lib/session.ts", "api/user/route.ts"].map((f, i) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: i === 1 ? C.ORANGE : C.BORDER, flexShrink: 0 }} />
                  <span style={{ ...mono, fontSize: 11, color: i === 1 ? C.TEXT : C.MUTED }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <div style={card()}
            onMouseEnter={e => (e.currentTarget.style.borderColor = hoverBorder)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.BORDER)}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#10B98118", border: "1px solid #10B98130", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <GitMerge size={20} style={{ color: "#10B981" }} />
            </div>
            <h3 style={{ ...sans, fontSize: 19, fontWeight: 700, color: C.TEXT, margin: "0 0 10px", letterSpacing: "-0.02em" }}>Instant PR reviews</h3>
            <p style={{ ...sans, fontSize: 14, color: C.MUTED, lineHeight: 1.6, margin: 0 }}>Paste a PR URL and get a thorough review: logic errors, missing tests, security issues, and architectural feedback — in seconds.</p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1} className="bento-wide">
          <div style={{ ...card({ padding: "32px" }), display: "flex", gap: 28, alignItems: "flex-start" }} className="feature-card-inner"
            onMouseEnter={e => (e.currentTarget.style.borderColor = hoverBorder)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.BORDER)}>
            <div style={{ flex: 1 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#3B82F618", border: "1px solid #3B82F630", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <MessageSquare size={20} style={{ color: "#3B82F6" }} />
              </div>
              <h3 style={{ ...sans, fontSize: 22, fontWeight: 700, color: C.TEXT, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Code-aware conversations</h3>
              <p style={{ ...sans, fontSize: 15, color: C.MUTED, lineHeight: 1.65, margin: 0 }}>Ask the same way you&apos;d ask a senior engineer who memorized the entire codebase. Get answers with line-level citations and working code examples.</p>
            </div>
            <div style={{ width: 190, flexShrink: 0 }} className="hide-on-small">
              {[
                { q: "Why is this slow?",     a: "Missing index on users.email — line 47" },
                { q: "How does auth work?",   a: "JWT + refresh tokens, see auth/session.ts" },
              ].map((item, i) => (
                <div key={i} style={{ background: C.DEEP, border: `1px solid ${C.BORDER}`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ ...sans, fontSize: 12, color: C.MUTED, marginBottom: 4 }}>{item.q}</div>
                  <div style={{ ...sans, fontSize: 12, color: C.TEXT }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.06}>
          <div style={card()}
            onMouseEnter={e => (e.currentTarget.style.borderColor = hoverBorder)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.BORDER)}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.ORANGE}18`, border: `1px solid ${C.ORANGE}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <BookOpen size={20} style={{ color: C.ORANGE }} />
            </div>
            <h3 style={{ ...sans, fontSize: 19, fontWeight: 700, color: C.TEXT, margin: "0 0 10px", letterSpacing: "-0.02em" }}>Auto-generate docs</h3>
            <p style={{ ...sans, fontSize: 14, color: C.MUTED, lineHeight: 1.6, margin: 0 }}>Generate onboarding guides, architecture docs, and API references from real source code — always accurate, never stale.</p>
          </div>
        </FadeUp>

      </div>
    </section>
  );
}
