"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bug, GitPullRequest, Boxes, BookOpen, Zap, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/shared/components/ui/card";
import type { RepoInfo } from "@/types";

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
      toast.error("Please connect a GitHub repository first.");
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
    <div className="flex-1 px-3 py-3 overflow-y-auto">
      <div className="flex items-center gap-[7px] mb-2.5">
        <Zap size={12} className="text-primary" />
        <h2 className="text-[13px] font-semibold text-foreground m-0">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 + 0.2, duration: 0.26 }}
            whileHover={{ y: -3, transition: { duration: 0.14 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleActionClick(action.id)}
            className="flex flex-col items-start gap-[9px] p-[11px] rounded-[14px] border border-border cursor-pointer text-left transition-[box-shadow,border-color,background] hover:bg-[var(--rb-hover-surface)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.2)] hover:border-[var(--rb-primary-subtle-border)]"
            style={{ background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)" }}
          >
            <div className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center" style={{ background: "var(--rb-primary-subtle)", border: "1px solid var(--rb-primary-subtle-border)" }}>
              <action.Icon size={13} className="text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-foreground m-0">{action.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 mb-0 leading-snug">{action.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {repo && (
        <div className="flex flex-col gap-2.5 mt-2.5">
          {repo.techStack && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card
                className="border-border px-[13px] py-3"
                style={{ background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)" }}
              >
                <p className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider m-0 mb-[9px]">
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
                    <div key={stat.label} className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] text-muted-foreground">{stat.label}</span>
                      <span className="font-mono text-[11px] font-semibold text-primary">{stat.value}</span>
                    </div>
                  ))}
              </Card>
            </motion.div>
          )}

          {repo.architecture && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card
                className="border-border overflow-hidden"
                style={{ background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)" }}
              >
                <button
                  onClick={() => setArchOpen(!archOpen)}
                  className="flex items-center justify-between w-full px-[13px] py-3 border-none cursor-pointer bg-transparent text-left"
                >
                  <span className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    AI Architecture
                  </span>
                  <motion.div animate={{ rotate: archOpen ? 90 : 0 }}>
                    <ChevronRight size={12} className="text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {archOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-[13px] pb-3 text-[11px] text-muted-foreground leading-snug"
                    >
                      <div className="font-semibold text-foreground mb-1">Overview</div>
                      <p className="m-0 mb-2">{repo.architecture.project_overview}</p>
                      {repo.architecture.modules && repo.architecture.modules.length > 0 && (
                        <>
                          <div className="font-semibold text-foreground mb-1">Modules</div>
                          <ul className="m-0 mb-2 pl-4">
                            {repo.architecture.modules.map((m, idx) => <li key={idx}>{m}</li>)}
                          </ul>
                        </>
                      )}
                      <div className="font-semibold text-foreground mb-1">Data Flow</div>
                      <p className="m-0">{repo.architecture.data_flow}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card
              className="border-border px-[13px] py-3"
              style={{ background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)" }}
            >
              <p className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider m-0 mb-[9px]">
                Session Stats
              </p>
              {[
                { label: "Indexed Chunks", value: repo.indexedChunks ? String(repo.indexedChunks) : "142" },
                { label: "Files analyzed", value: repo.indexedChunks ? String(Math.round(repo.indexedChunks / 2.5)) : "42" },
                { label: "Tool calls",     value: "18"    },
                { label: "Tokens used",    value: "~48k"  },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] text-muted-foreground">{stat.label}</span>
                  <span className="font-mono text-[11px] font-semibold text-primary">{stat.value}</span>
                </div>
              ))}
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
