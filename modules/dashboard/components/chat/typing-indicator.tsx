import { motion } from "motion/react";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
      <div style={{ width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--rb-agent-avatar-bg)", border: "1px solid var(--rb-agent-avatar-border)", flexShrink: 0, marginTop: 2 }}>
        <Bot size={12} style={{ color: "var(--muted-foreground)" }} />
      </div>
      <div style={{ padding: "11px 15px", borderRadius: "16px 16px 16px 4px", background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {[0, 1, 2].map(i => (
            <motion.div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--muted-foreground)" }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ repeat: Infinity, duration: 1.3, delay: i * 0.22 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
