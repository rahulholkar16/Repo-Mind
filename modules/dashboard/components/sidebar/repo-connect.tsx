"use client";

import { AnimatePresence, motion } from "motion/react";
import { Github, Zap, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import type { RepoConnectProps } from "@/types";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a",
  Python: "#3572A5", Go: "#00ADD8", Rust: "#dea584",
};

function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n); }

export function RepoConnect({ urlInput, setUrlInput, connecting, onConnect, connectedRepo, isTablet }: RepoConnectProps) {
  return (
    <div className={`flex-shrink-0 border-b border-border ${isTablet ? "px-3.5 py-3" : "px-4 py-4"}`}>
      <div className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Repository
      </div>

      <div className="relative mb-2">
        <Github size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onConnect()}
          placeholder="github.com/owner/repo"
          className="pl-[30px] font-mono text-[11px]"
        />
      </div>

      <Button
        onClick={onConnect}
        disabled={connecting}
        className="w-full gap-1.5"
        style={!connecting ? { background: "var(--rb-cta-gradient)", color: "#fff" } : undefined}
      >
        {connecting ? <><Zap size={12} className="animate-pulse" /> Connecting…</> : "Connect Repository"}
      </Button>

      <AnimatePresence>
        {connectedRepo && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <Card
              className="mt-2.5 p-3 border-border"
              style={{
                background: "var(--card)",
                backdropFilter: "var(--rb-glass-backdrop)",
                WebkitBackdropFilter: "var(--rb-glass-backdrop)",
              }}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-semibold text-foreground">
                  {connectedRepo.owner}/{connectedRepo.name}
                </span>
                <Badge variant="outline" className="gap-1 text-[11px] font-semibold text-accent-foreground border-none px-0">
                  <Star size={10} fill="var(--accent)" color="var(--accent)" /> {fmt(connectedRepo.stars)}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mb-1.5 leading-relaxed">{connectedRepo.description}</p>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                  style={{ background: LANG_COLORS[connectedRepo.language] ?? "#888" }}
                />
                <span className="font-mono text-[10px] text-muted-foreground">{connectedRepo.language}</span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
