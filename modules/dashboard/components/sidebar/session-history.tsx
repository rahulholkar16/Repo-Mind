import { motion } from "motion/react";
import { Clock, MessageSquare, ChevronRight } from "lucide-react";
import type { Session  } from "@/lib/types";

interface SessionHistoryProps {
  sessions: Session[];
  activeSession: string;
  setActiveSession: (id: string) => void;
  onClose?: () => void;
  isMobile: boolean;
}

export function SessionHistory({ sessions, activeSession, setActiveSession, onClose, isMobile }: SessionHistoryProps) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 6px", marginBottom: 6 }}>
        <Clock size={11} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          History
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {sessions.map((session, i) => {
          const active = activeSession === session.id;
          return (
            <motion.button
              key={session.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 + 0.1 }}
              onClick={() => { setActiveSession(session.id); onClose?.(); }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 8,
                padding: isMobile ? "10px 10px" : "8px 10px",
                borderRadius: 10, border: "none", cursor: "pointer",
                background: active ? "var(--rb-session-active-bg)" : "transparent",
                outline: active ? "1px solid var(--rb-session-active-border)" : "1px solid transparent",
                textAlign: "left", width: "100%", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--rb-hover-surface)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <MessageSquare size={12} style={{ color: active ? "var(--primary)" : "var(--muted-foreground)", marginTop: 1, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {session.title}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--muted-foreground)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {session.repoName}
                </div>
              </div>
              <ChevronRight size={11} style={{ color: "var(--muted-foreground)", flexShrink: 0, opacity: active ? 1 : 0.4 }} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
