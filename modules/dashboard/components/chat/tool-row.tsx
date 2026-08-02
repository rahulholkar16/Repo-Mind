"use client";

import { motion } from "motion/react";
import { Terminal } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import type { ToolCall } from "@/types";

export const TOOL_META: Record<string, { color: string }> = {
  list_directory:   { color: "#F59E0B" },  // amber
  search_file:      { color: "#8B5CF6" },  // purple
  read_file:        { color: "#10B981" },  // green
  search_code:      { color: "#3B82F6" },  // blue
  search_codebase:  { color: "#EC4899" },  // pink
};

export function ToolRow({ tool, delay }: { tool: ToolCall; delay: number }) {
  const meta = TOOL_META[tool.name] ?? { color: "#6B7280" };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.22 }}
      className="inline-block"
    >
      <Badge
        variant="outline"
        className="gap-[5px] rounded-full font-mono text-[11px] font-semibold border whitespace-nowrap py-1 px-2.5"
        style={{ color: meta.color, background: `${meta.color}18`, borderColor: `${meta.color}38` }}
      >
        <Terminal size={9} />
        {tool.name}
        {tool.args && <span className="opacity-50 max-w-[90px] overflow-hidden text-ellipsis">({tool.args})</span>}
      </Badge>
    </motion.div>
  );
}
