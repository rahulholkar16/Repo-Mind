import { motion } from "motion/react";
import { Terminal, Bot, User } from "lucide-react";
import type { Message  } from "@/lib/types";
import { ToolRow } from "./tool-row";
import { CodeBlock } from "./code-block";
import { MarkdownRenderer } from "./markdown-renderer";

export function MessageBubble({ msg, index, isMobile }: { msg: Message; index: number; isMobile?: boolean }) {
  const isUser = msg.role === "user";

  if (msg.role === "agent" && msg.toolCalls?.length && !msg.content) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.045, duration: 0.25 }}
        style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
      >
        <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--rb-accent-subtle)", border: "1px solid var(--rb-accent-subtle-border)" }}>
          <Terminal size={11} style={{ color: "var(--accent-foreground)", opacity: 0.75 }} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 3 }}>
          {msg.toolCalls.map((t, ti) => <ToolRow key={`${t.name}-${ti}`} tool={t} delay={ti * 0.09} />)}
        </div>
      </motion.div>
    );
  }

  const maxWidth = isMobile ? "90%" : "78%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 9, alignItems: "flex-start" }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 2,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: isUser ? "var(--rb-user-avatar-bg)" : "var(--rb-agent-avatar-bg)",
        border: `1px solid ${isUser ? "var(--rb-user-avatar-border)" : "var(--rb-agent-avatar-border)"}`,
      }}>
        {isUser ? <User size={12} style={{ color: "var(--primary)" }} /> : <Bot size={12} style={{ color: "var(--muted-foreground)" }} />}
      </div>

      <div style={{ maxWidth, display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 4 }}>
        <div style={{
          padding: isMobile ? "10px 13px" : "11px 14px",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          background: isUser ? "var(--primary)" : "var(--rb-agent-bubble-bg)",
          backdropFilter: isUser ? "none" : "var(--rb-glass-backdrop)",
          WebkitBackdropFilter: isUser ? "none" : "var(--rb-glass-backdrop)",
          border: isUser ? "none" : "1px solid var(--border)",
          color: isUser ? "#fff" : "var(--foreground)",
          boxShadow: isUser ? "0 4px 24px rgba(255,107,53,0.25)" : "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <MarkdownRenderer content={msg.content} />
          {msg.codeBlock && <CodeBlock language={msg.codeBlock.language} code={msg.codeBlock.code} isMobile={isMobile} />}
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--muted-foreground)" }}>{msg.timestamp}</span>
      </div>
    </motion.div>
  );
}
