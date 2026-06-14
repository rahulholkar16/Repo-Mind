import { AnimatePresence, motion } from "motion/react";
import { Github, Zap, Star } from "lucide-react";
import type { RepoInfo  } from "@/lib/types";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a",
  Python: "#3572A5", Go: "#00ADD8", Rust: "#dea584",
};

function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n); }

interface RepoConnectProps {
  urlInput: string;
  setUrlInput: (v: string) => void;
  connecting: boolean;
  onConnect: () => void;
  connectedRepo: RepoInfo | null;
  isTablet: boolean;
}

export function RepoConnect({ urlInput, setUrlInput, connecting, onConnect, connectedRepo, isTablet }: RepoConnectProps) {
  return (
    <div style={{ padding: isTablet ? "12px 14px" : "16px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
        Repository
      </div>

      <div style={{ position: "relative", marginBottom: 8 }}>
        <Github size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)", pointerEvents: "none" }} />
        <input
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onConnect()}
          placeholder="github.com/owner/repo"
          style={{
            width: "100%", boxSizing: "border-box",
            paddingLeft: 30, paddingRight: 10, paddingTop: 9, paddingBottom: 9,
            borderRadius: 8, border: "1px solid var(--border)",
            background: "var(--rb-surface-deep)", color: "var(--foreground)",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            outline: "none", transition: "border-color 0.15s",
            WebkitAppearance: "none",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "var(--primary)")}
          onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
        />
      </div>

      <button
        onClick={onConnect}
        disabled={connecting}
        style={{
          width: "100%", padding: "10px 0", borderRadius: 8, border: "none",
          background: connecting ? "var(--muted)" : "var(--rb-cta-gradient)",
          color: connecting ? "var(--muted-foreground)" : "#fff",
          fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
          cursor: connecting ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          transition: "opacity 0.15s",
        }}
      >
        {connecting ? <><Zap size={12} className="animate-pulse" /> Connecting…</> : "Connect Repository"}
      </button>

      <AnimatePresence>
        {connectedRepo && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ marginTop: 10, borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)", padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>
                  {connectedRepo.owner}/{connectedRepo.name}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--accent-foreground)", fontWeight: 600, flexShrink: 0 }}>
                  <Star size={10} fill="var(--accent)" color="var(--accent)" /> {fmt(connectedRepo.stars)}
                </span>
              </div>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: "0 0 6px", lineHeight: 1.4 }}>{connectedRepo.description}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: LANG_COLORS[connectedRepo.language] ?? "#888", display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--muted-foreground)" }}>{connectedRepo.language}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
