"use client";

import { motion } from "motion/react";
import { Clock, MessageSquare, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import type { Session } from "@/lib/types";

interface SessionHistoryProps {
  sessions: Session[];
  activeSession: string;
  setActiveSession: (id: string) => void;
  onClose?: () => void;
  isMobile: boolean;
}

export function SessionHistory({ sessions, activeSession, setActiveSession, onClose, isMobile }: SessionHistoryProps) {
  return (
    <ScrollArea className="flex-1 px-2 py-2.5">
      <div className="flex items-center gap-1.5 px-1.5 mb-1.5">
        <Clock size={11} className="text-muted-foreground" />
        <span className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          History
        </span>
      </div>

      <div className="flex flex-col gap-px">
        {sessions.map((session, i) => {
          const active = activeSession === session.id;
          return (
            <motion.button
              key={session.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 + 0.1 }}
              onClick={() => { setActiveSession(session.id); onClose?.(); }}
              className={`flex items-start gap-2 rounded-[10px] border-none cursor-pointer text-left w-full transition-all ${
                isMobile ? "px-2.5 py-2.5" : "px-2.5 py-2"
              } ${active ? "outline outline-1" : "outline outline-1 outline-transparent hover:bg-[var(--rb-hover-surface)]"}`}
              style={{
                background: active ? "var(--rb-session-active-bg)" : "transparent",
                outlineColor: active ? "var(--rb-session-active-border)" : "transparent",
              }}
            >
              <MessageSquare
                size={12}
                className="mt-px flex-shrink-0"
                style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground truncate">
                  {session.title}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground mt-px truncate">
                  {session.repoName}
                </div>
              </div>
              <ChevronRight size={11} className="text-muted-foreground flex-shrink-0" style={{ opacity: active ? 1 : 0.4 }} />
            </motion.button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
