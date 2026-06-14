import { Menu, Activity, Sun, Moon } from "lucide-react";
import type { RepoInfo  } from "@/lib/types";
import { RepoBrainMark } from "@/components/RepoBrainMark";

interface ChatHeaderProps {
  repo: RepoInfo | null;
  isMobile: boolean;
  onOpenSidebar?: () => void;
  onOpenRightPanel?: () => void;
  showRightToggle: boolean;
  isDark: boolean;
  setIsDark?: (v: boolean) => void;
}

export function ChatHeader({ repo, isMobile, onOpenSidebar, onOpenRightPanel, showRightToggle, isDark, setIsDark }: ChatHeaderProps) {
  const padding = isMobile ? "12px 14px" : "13px 22px";

  return (
    <div style={{ padding, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, minHeight: isMobile ? 56 : 52, backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)", background: "var(--rb-glass-bg-sidebar)" }}>

      {isMobile && (
        <button
          onClick={onOpenSidebar}
          style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-foreground)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        >
          <Menu size={17} />
        </button>
      )}

      {isMobile && (
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          <RepoBrainMark size={28} isDark={isDark} />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontSize: isMobile ? 13 : 14, fontWeight: 600, color: "var(--foreground)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {repo ? `${repo.owner}/${repo.name}` : (isMobile ? "RepoBrain" : "RepoBrain Chat")}
        </h1>
        {!isMobile && (
          <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: "1px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {repo ? repo.description : "Connect a repository to begin"}
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} className="animate-pulse" />
          {!isMobile && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--muted-foreground)" }}>online</span>}
        </div>

        {isMobile && setIsDark && (
          <button
            onClick={() => setIsDark(!isDark)}
            style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-foreground)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        )}

        {showRightToggle && (
          <button
            onClick={onOpenRightPanel}
            style={{ width: isMobile ? 36 : 32, height: isMobile ? 36 : 32, borderRadius: 9, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-foreground)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
            title="Agent Activity"
          >
            <Activity size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
