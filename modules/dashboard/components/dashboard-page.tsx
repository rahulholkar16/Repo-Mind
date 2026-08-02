"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { Group, Panel, Separator, useDefaultLayout } from "react-resizable-panels";

import { LeftSidebar } from "../components/left-sidebar";
import { ChatArea } from "../components/chat-area";
import { RightPanel } from "../components/right-panel";
import { useWindowSize } from "@/shared/hooks/use-window-size";
import { useDashboardStore } from "@/modules/dashboard/store/use-dashboard-store";
import { ssrSafeStorage } from "@/shared/lib/ssr-safe-storage";
import { safeRandomUUID } from "@/shared/lib/safe-random-uuid";

/** Thin draggable divider between panels — highlights on hover/drag. */
function ResizeHandle() {
  return (
    <Separator className="group relative w-[3px] flex-shrink-0 outline-none">
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border transition-colors group-hover:bg-primary group-data-[state=drag]:bg-primary" />
    </Separator>
  );
}

export function DashboardPage() {

  const { resolvedTheme, setTheme } = useTheme();
  // resolvedTheme is undefined until next-themes has resolved on the client;
  // default to dark (matches ThemeProvider's defaultTheme) until then.
  const isDark = resolvedTheme ? resolvedTheme === "dark" : true;
  const setIsDark = (v: boolean) => setTheme(v ? "dark" : "light");

  const { width } = useWindowSize();

  const isMobile  = width < 768;
  const isTablet  = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  // Dashboard-wide state (connected repo, active session, live tool
  // activity) now lives in Zustand — components read/write it directly
  // instead of receiving it via props.
  const activeSession    = useDashboardStore((s) => s.activeSession);
  const setActiveSession = useDashboardStore((s) => s.setActiveSession);

  useEffect(() => {
    // Seed the first session id once we're on the client.
    if (!activeSession) setActiveSession(safeRandomUUID());
  }, [activeSession, setActiveSession]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightOpen,   setRightOpen]   = useState(false);

  /* Close drawers when resizing to desktop */
  useEffect(() => {
    if (isDesktop) { setSidebarOpen(false); setRightOpen(false); }
  }, [isDesktop]);

  /* Lock body scroll when a drawer is open on mobile/tablet */
  useEffect(() => {
    document.body.style.overflow =
      (isMobile || isTablet) && (sidebarOpen || rightOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, isTablet, sidebarOpen, rightOpen]);

  const sidebarWidth = isMobile ? 280 : isTablet ? 256 : 280;
  const rightWidth   = isDesktop ? 304 : 300;

  // Persists panel sizes to localStorage between sessions.
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "repobrain-dashboard-layout",
    panelIds: isDesktop ? ["left-sidebar", "chat-area", "right-panel"] : ["left-sidebar", "chat-area"],
    storage: ssrSafeStorage,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        width: "100vw", height: "100vh",
        background: "var(--background)",
        display: "flex", overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Background glows — orange top-right, warm accent bottom-left — CSS vars auto-adapt to theme */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 680, height: 680, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, var(--rb-glow-primary) 0%, transparent 68%)" }} />
      <div style={{ position: "absolute", bottom: "-18%", left: "-8%",  width: 560, height: 560, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, var(--rb-glow-accent) 0%, transparent 65%)" }} />
      {/* Subtle center warmth */}
      <div style={{ position: "absolute", top: "35%", left: "38%", width: 400, height: 300, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse, var(--rb-glow-primary) 0%, transparent 65%)", opacity: 0.35 }} />

      {/* Grain overlay */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.028, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      {/* Drawer backdrop */}
      <AnimatePresence>
        {(sidebarOpen || rightOpen) && (
          <motion.div
            key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => { setSidebarOpen(false); setRightOpen(false); }}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
          />
        )}
      </AnimatePresence>

      {/* ── 3-column layout, resizable on tablet + desktop ── */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", width: "100%", height: "100%" }}>
        {isMobile ? (
          <div style={{ flex: 1, height: "100%", overflow: "hidden", minWidth: 0 }}>
            <ChatArea
              isMobile isTablet={isTablet}
              onOpenSidebar={() => setSidebarOpen(true)}
              onOpenRightPanel={() => setRightOpen(true)}
              showRightToggle={!isDesktop}
              isDark={isDark} setIsDark={setIsDark}
            />
          </div>
        ) : (
          <Group
            orientation="horizontal"
            style={{ width: "100%", height: "100%" }}
            defaultLayout={defaultLayout}
            onLayoutChanged={onLayoutChanged}
          >
            <Panel id="left-sidebar" defaultSize="19%" minSize="14%" maxSize="34%">
              <LeftSidebar
                isDark={isDark} setIsDark={setIsDark}
                isMobile={false} isTablet={isTablet}
              />
            </Panel>

            <ResizeHandle />

            <Panel id="chat-area" minSize="30%">
              <ChatArea
                isMobile={false} isTablet={isTablet}
                onOpenSidebar={() => setSidebarOpen(true)}
                onOpenRightPanel={() => setRightOpen(true)}
                showRightToggle={!isDesktop}
                isDark={isDark} setIsDark={setIsDark}
              />
            </Panel>

            {isDesktop && (
              <>
                <ResizeHandle />
                <Panel id="right-panel" defaultSize="21%" minSize="14%" maxSize="34%">
                  <RightPanel isMobile={false} />
                </Panel>
              </>
            )}
          </Group>
        )}
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            key="sd"
            initial={{ x: -sidebarWidth }} animate={{ x: 0 }} exit={{ x: -sidebarWidth }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            style={{ position: "fixed", left: 0, top: 0, height: "100%", width: sidebarWidth, zIndex: 60 }}
          >
            <LeftSidebar
              isDark={isDark} setIsDark={setIsDark}
              isMobile onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right panel drawer — tablet + mobile */}
      <AnimatePresence>
        {!isDesktop && rightOpen && (
          <motion.div
            key="rd"
            initial={{ x: rightWidth }} animate={{ x: 0 }} exit={{ x: rightWidth }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            style={{ position: "fixed", right: 0, top: 0, height: "100%", width: rightWidth, zIndex: 60 }}
          >
            <RightPanel isMobile onClose={() => setRightOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
