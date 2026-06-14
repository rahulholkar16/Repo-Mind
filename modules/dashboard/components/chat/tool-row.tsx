import { motion } from "motion/react";
import { Terminal } from "lucide-react";
import type { ToolCall  } from "@/lib/types";

export const TOOL_META: Record<string, { color: string }> = {
  list_directory:  { color: "#F59E0B" },
  search_file:     { color: "#8B5CF6" },
  read_file:       { color: "#10B981" },
  grep_search:     { color: "#3B82F6" },
  find_function:   { color: "#EC4899" },
  analyze_imports: { color: "#F97316" },
};

export function ToolRow({ tool, delay }: { tool: ToolCall; delay: number }) {
  const meta = TOOL_META[tool.name] ?? { color: "#6B7280" };
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.82, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.22 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "4px 10px", borderRadius: 999,
        background: `${meta.color}18`, border: `1px solid ${meta.color}38`,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: meta.color,
        whiteSpace: "nowrap",
      }}
    >
      <Terminal size={9} />
      {tool.name}
      {tool.args && <span style={{ opacity: 0.5, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis" }}>({tool.args})</span>}
    </motion.span>
  );
}
