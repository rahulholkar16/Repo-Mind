"use client";

import { Menu, Activity, Sun, Moon, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { RepoBrainMark } from "@/shared/components/RepoBrainMark";
import type { ChatHeaderProps } from "@/types";

export function ChatHeader({
  repo, isMobile, onOpenSidebar, onOpenRightPanel, showRightToggle, isDark, setIsDark,
  showLeftCollapseToggle, leftCollapsed, onToggleLeftPanel,
  showRightCollapseToggle, rightCollapsed, onToggleRightPanel,
}: ChatHeaderProps) {
  return (
    <div
      className={`border-b border-border flex items-center gap-2.5 flex-shrink-0 ${isMobile ? "px-3.5 py-3 min-h-14" : "px-[22px] py-[13px] min-h-[52px]"}`}
      style={{
        backdropFilter: "var(--rb-glass-backdrop)",
        WebkitBackdropFilter: "var(--rb-glass-backdrop)",
        background: "var(--rb-glass-bg-sidebar)",
      }}
    >
      {isMobile && (
        <Button variant="outline" size="icon" onClick={onOpenSidebar} className="w-9 h-9 flex-shrink-0">
          <Menu size={17} />
        </Button>
      )}

      {showLeftCollapseToggle && leftCollapsed && (
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleLeftPanel}
          title="Show sidebar"
          className="w-8 h-8 flex-shrink-0 hover:border-primary hover:text-primary"
        >
          <PanelLeftOpen size={15} />
        </Button>
      )}

      {isMobile && (
        <div className="flex-shrink-0 flex items-center">
          <RepoBrainMark size={28} isDark={isDark} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h1 className={`${isMobile ? "text-[13px]" : "text-sm"} font-semibold text-foreground m-0 truncate`}>
          {repo ? `${repo.owner}/${repo.name}` : (isMobile ? "RepoBrain" : "RepoBrain Chat")}
        </h1>
        {!isMobile && (
          <p className="text-[11px] text-muted-foreground m-0 mt-px truncate">
            {repo ? repo.description : "Connect a repository to begin"}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          {!isMobile && <span className="font-mono text-[10px] text-muted-foreground">online</span>}
        </div>

        {isMobile && setIsDark && (
          <Button variant="outline" size="icon" onClick={() => setIsDark(!isDark)} className="w-[34px] h-[34px]">
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </Button>
        )}

        {showRightToggle && (
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenRightPanel}
            title="Agent Activity"
            className={`${isMobile ? "w-9 h-9" : "w-8 h-8"} hover:border-primary hover:text-primary`}
          >
            <Activity size={15} />
          </Button>
        )}

        {showRightCollapseToggle && (
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleRightPanel}
            title={rightCollapsed ? "Show agent panel" : "Hide agent panel"}
            className="w-8 h-8 hover:border-primary hover:text-primary"
          >
            {rightCollapsed ? <PanelRightOpen size={15} /> : <PanelRightClose size={15} />}
          </Button>
        )}
      </div>
    </div>
  );
}
