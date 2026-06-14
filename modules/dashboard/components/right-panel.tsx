import { useState } from "react";
import type { RepoInfo  } from "@/lib/types";
import { AgentActivity } from "./panel/agent-activity";
import { FileTree } from "./panel/file-tree";
import { QuickActions } from "./panel/quick-actions";

interface RightPanelProps {
  repo: RepoInfo | null;
  isMobile?: boolean;
  onClose?: () => void;
}

export function RightPanel({ repo, isMobile = false, onClose }: RightPanelProps) {
  const [activeToolIdx, setActiveToolIdx] = useState(2);

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden",
      background: "var(--rb-glass-bg-sidebar)",
      backdropFilter: "var(--rb-glass-backdrop-sidebar)",
      WebkitBackdropFilter: "var(--rb-glass-backdrop-sidebar)",
      borderLeft: "1px solid var(--rb-glass-border-sidebar)",
      fontFamily: "'Inter', sans-serif",
      boxShadow: isMobile ? "-4px 0 32px rgba(0,0,0,0.4)" : "none",
    }}>
      <AgentActivity
        activeToolIdx={activeToolIdx}
        setActiveToolIdx={setActiveToolIdx}
        isMobile={isMobile}
        onClose={onClose}
      />
      <FileTree tree={repo?.fileTree} isMobile={isMobile} />
      <QuickActions repo={repo} />
    </div>
  );
}
