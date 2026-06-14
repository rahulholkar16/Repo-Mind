import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bug, GitPullRequest, Boxes, BookOpen, Zap, ChevronRight } from "lucide-react";
import type { RepoInfo  } from "@/lib/types";

const ACTIONS = [
  { id: "bugs", Icon: Bug,            label: "Find Bugs",       desc: "Static + logic review" },
  { id: "pr",   Icon: GitPullRequest, label: "PR Review",       desc: "Diff analysis & tips"  },
  { id: "arch", Icon: Boxes,          label: "Architecture",    desc: "Component flow map"    },
  { id: "docs", Icon: BookOpen,       label: "Onboarding Docs", desc: "Auto-gen README"       },
];

export function QuickActions({ repo }: { repo: RepoInfo | null }) {
  const [archOpen, setArchOpen] = useState(false);

  function handleActionClick(actionId: string) {
    if (!repo) {
      alert("Please connect a GitHub repository first.");
      return;
    }
    let promptText = "";
    if (actionId === "bugs") {
      promptText = "Find any bugs or potential improvements in this codebase.";
    } else if (actionId === "pr") {
      promptText = "Review this codebase as a PR reviewer and give me a summary of recommendations.";
    } else if (actionId === "arch") {
      promptText = "Explain the system architecture, modules, and component flow map of this codebase.";
    } else if (actionId === "docs") {
      promptText = "Generate comprehensive onboarding documentation and a setup guide for this repository.";
    }

    if (promptText) {
      window.dispatchEvent(new CustomEvent("rb-send-message", { detail: promptText }));
    }
  }

  return (
    <div style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <Zap size={12} style={{ color: "var(--primary)" }} />
        <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", margin: 0 }}>Quick Actions</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {ACTIONS.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 + 0.2, duration: 0.26 }}
            whileHover={{ y: -3, transition: { duration: 0.14 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleActionClick(action.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 9,
              padding: "12px 11px", borderRadius: 14, border: "1px solid var(--border)",
              background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)",
              cursor: "pointer", textAlign: "left",
              transition: "box-shadow 0.18s, border-color 0.18s, background 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--rb-hover-surface)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.2)"; e.currentTarget.style.borderColor = "var(--rb-primary-subtle-border)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--card)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--rb-primary-subtle)", border: "1px solid var(--rb-primary-subtle-border)" }}>
              <action.Icon size={13} style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground)", margin: 0 }}>{action.label}</p>
              <p style={{ fontSize: 10, color: "var(--muted-foreground)", margin: "2px 0 0", lineHeight: 1.35 }}>{action.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {repo && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
          {/* AI Tech Stack */}
          {repo.techStack && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ borderRadius: 14, border: "1px solid var(--border)", padding: "12px 13px", background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)" }}
            >
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 9px" }}>
                AI Tech Stack
              </p>
              {[
                { label: "Frontend", value: repo.techStack.frontend },
                { label: "Backend", value: repo.techStack.backend },
                { label: "Database", value: repo.techStack.database },
                { label: "ORM", value: repo.techStack.orm },
                { label: "Styling", value: repo.techStack.styling },
                { label: "Auth", value: repo.techStack.authentication },
                { label: "State Management", value: repo.techStack.state_management },
              ]
                .filter(item => item.value)
                .map(stat => (
                  <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{stat.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: "var(--primary)" }}>{stat.value}</span>
                  </div>
                ))}
            </motion.div>
          )}

          {/* AI Architecture Overview */}
          {repo.architecture && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)", overflow: "hidden" }}
            >
              <button
                onClick={() => setArchOpen(!archOpen)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "12px 13px", border: "none", cursor: "pointer", background: "transparent", textAlign: "left" }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  AI Architecture
                </span>
                <motion.div animate={{ rotate: archOpen ? 90 : 0 }}>
                  <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
                </motion.div>
              </button>
              <AnimatePresence>
                {archOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ padding: "0 13px 12px 13px", fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.4 }}
                  >
                    <div style={{ fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>Overview</div>
                    <p style={{ margin: "0 0 8px 0" }}>{repo.architecture.project_overview}</p>
                    {repo.architecture.modules && repo.architecture.modules.length > 0 && (
                      <>
                        <div style={{ fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>Modules</div>
                        <ul style={{ margin: "0 0 8px 0", paddingLeft: 16 }}>
                          {repo.architecture.modules.map((m, idx) => <li key={idx}>{m}</li>)}
                        </ul>
                      </>
                    )}
                    <div style={{ fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>Data Flow</div>
                    <p style={{ margin: 0 }}>{repo.architecture.data_flow}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Session Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ borderRadius: 14, border: "1px solid var(--border)", padding: "12px 13px", background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)" }}
          >
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 9px" }}>
              Session Stats
            </p>
            {[
              { label: "Indexed Chunks", value: repo.indexedChunks ? String(repo.indexedChunks) : "142" },
              { label: "Files analyzed", value: repo.indexedChunks ? String(Math.round(repo.indexedChunks / 2.5)) : "42" },
              { label: "Tool calls",     value: "18"    },
              { label: "Tokens used",    value: "~48k"  },
            ].map(stat => (
              <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{stat.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: "var(--primary)" }}>{stat.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
