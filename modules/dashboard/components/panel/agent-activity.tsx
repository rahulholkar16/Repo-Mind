"use client";

import { motion, AnimatePresence } from "motion/react";
import { Activity, X, Radio } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { AgentActivityProps } from "@/types";
import { TOOL_META } from "../chat/tool-row";

export function AgentActivity({ liveTools, isMobile, onClose }: AgentActivityProps) {
  const hasActivity = liveTools.length > 0;
  const latest = hasActivity ? liveTools[liveTools.length - 1] : null;
  const latestMeta = latest ? (TOOL_META[latest.name] ?? { color: "#6B7280" }) : null;
  const isRunning = latest?.args === "running...";

  return (
    <div className="px-4 pt-4 pb-3.5 border-b border-border flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-[7px]">
          <Activity size={13} className="text-primary" />
          <h2 className="text-[13px] font-semibold text-foreground m-0">Agent Activity</h2>
        </div>

        {isMobile && onClose && (
          <Button variant="outline" size="icon" onClick={onClose} className="w-[30px] h-[30px]">
            <X size={14} />
          </Button>
        )}
      </div>

      {!hasActivity ? (
        <div className="rounded-xl border border-dashed border-border px-[13px] py-4 flex flex-col items-center gap-1.5 text-center">
          <Radio size={16} className="text-muted-foreground opacity-50" />
          <span className="text-[11px] text-muted-foreground leading-snug">
            No activity yet — ask a question to see the agent work in real time.
          </span>
        </div>
      ) : (
        <>
          <Card
            className="border-border px-[13px] py-[11px]"
            style={{ background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)" }}
          >
            <div className="flex items-center gap-2 mb-[9px]">
              <div className="relative w-[9px] h-[9px] flex-shrink-0">
                <div className="w-[9px] h-[9px] rounded-full" style={{ background: latestMeta!.color }} />
                {isRunning && (
                  <div className="w-[9px] h-[9px] rounded-full absolute inset-0 opacity-45 animate-ping" style={{ background: latestMeta!.color }} />
                )}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {isRunning ? "Running…" : "Last completed"}
              </span>
            </div>
            <Badge
              variant="outline"
              className="font-mono text-[11px] font-semibold border"
              style={{ color: latestMeta!.color, background: `${latestMeta!.color}1A`, borderColor: `${latestMeta!.color}40` }}
            >
              {latest!.name}
            </Badge>
          </Card>

          <div className="mt-2 flex flex-col gap-px">
            <AnimatePresence initial={false}>
              {liveTools.map((tool, i) => {
                const meta = TOOL_META[tool.name] ?? { color: "#6B7280" };
                const running = tool.args === "running...";
                const isLast = i === liveTools.length - 1;
                return (
                  <motion.div
                    key={`${tool.name}-${i}`}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-2 px-[7px] py-[5px] rounded-[7px]"
                  >
                    <div
                      className="w-[7px] h-[7px] rounded-full flex-shrink-0 transition-all"
                      style={{
                        background: isLast ? meta.color : "var(--border)",
                        boxShadow: isLast ? `0 0 7px ${meta.color}` : "none",
                      }}
                    />
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: isLast ? meta.color : "var(--muted-foreground)", fontWeight: isLast ? 600 : 400 }}
                    >
                      {tool.name}
                    </span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {running ? "running…" : "done"}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
