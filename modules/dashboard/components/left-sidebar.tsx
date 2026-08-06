"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sun, Moon, X, LogOut, PanelLeftClose } from "lucide-react";
import { toast } from "sonner";
import { RepoBrainMark } from "@/shared/components/RepoBrainMark";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import type { RepoInfo, LeftSidebarProps } from "@/types";
import { RepoConnect } from "./sidebar/repo-connect";
import { SessionHistory } from "./sidebar/session-history";
import { useDashboardStore } from "@/modules/dashboard/store/use-dashboard-store";
import { getRepoInfo, indexRepository, getRepositoryTree, getSessions, connectRepoRecord, createNewSession } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import pollIndexJob from "@/modules/dashboard/utils/poll-index-job";

export function LeftSidebar({ isDark, setIsDark, isMobile = false, isTablet = false, onClose, showCollapseToggle = false, onToggleCollapse }: LeftSidebarProps) {
  const router = useRouter();
  const connectedRepo    = useDashboardStore((s) => s.connectedRepo);
  const setConnectedRepo = useDashboardStore((s) => s.setConnectedRepo);
  const activeSession    = useDashboardStore((s) => s.activeSession);
  const setActiveSession = useDashboardStore((s) => s.setActiveSession);
  const sessions         = useDashboardStore((s) => s.sessions);
  const addSession       = useDashboardStore((s) => s.addSession);
  const setSessions      = useDashboardStore((s) => s.setSessions);
  const resetLiveTools   = useDashboardStore((s) => s.resetLiveTools);

  const [urlInput,   setUrlInput]   = useState("");
  const [connecting, setConnecting] = useState(false);
  const [reindexing, setReindexing] = useState(false);

  // Hydrate session history from Postgres (via Prisma) on load, so past
  // conversations are still there after a refresh.
  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch((e) => console.warn("Could not load session history:", e));
  }, [setSessions]);

  async function handleConnect() {
    if (connecting || !urlInput.trim()) return;
    setConnecting(true);

    try {
      // Normalize URL and extract owner/repo
      let cleaned = urlInput.trim()
        .replace(/^https?:\/\/github\.com\//, "")
        .replace(/^github\.com\//, "");
      // Remove trailing slash or .git
      cleaned = cleaned.replace(/\.git$/, "").replace(/\/$/, "");

      const parts = cleaned.split("/");
      if (parts.length < 2) {
        throw new Error("Invalid repository path. Use format: owner/name");
      }
      const owner = parts[0];
      const name = parts[1];
      const repoUrl = `https://github.com/${owner}/${name}`;

      // 1. Fetch repo metadata via our backend (uses a GitHub token, avoids
      //    the frontend hitting GitHub's public rate limit directly)
      let repoData: RepoInfo = {
        owner,
        name,
        language: "Unknown",
        stars: 0,
        description: "",
      };

      try {
        const info = await getRepoInfo(repoUrl);
        repoData = { ...repoData, ...info };
      } catch (e) {
        console.warn("Could not fetch repo info, using fallbacks:", e);
      }

      // 2. Fetch the file tree for the right panel
      try {
        const treeRes = await getRepositoryTree(repoUrl);
        repoData.fileTree = treeRes.tree;
      } catch (e) {
        console.error("Failed to fetch file tree:", e);
      }

      // 3. Index the repository (RepoBrain V2 reads files via the GitHub
      //    API directly — there is no separate clone step)
      const enqueRes = await fetch("/api/index-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl })
      });

      if (!enqueRes.ok) {
          throw new Error("Failed to queue repository indexing");
      }

      const { jobId } = await enqueRes.json();
      const indexRes = await pollIndexJob(jobId);
      if (indexRes && typeof indexRes.total_chunks === "number") {
          repoData.indexedChunks = indexRes.total_chunks;
      }

      // 4. Persist the repo + its first chat session to Postgres (Prisma),
      //    scoped to the logged-in user, and use the server-issued
      //    threadId — this is the same id ai-services will save messages
      //    under, so history round-trips correctly.
      const { repo, session } = await connectRepoRecord({
        repoUrl,
        owner,
        name,
        language: repoData.language,
        stars: repoData.stars,
        description: repoData.description,
      });
      repoData.id = repo.id;

      setConnectedRepo(repoData);
      // Force a fresh conversation thread whenever a (new) repo is connected —
      // otherwise the agent keeps the old repo's messages/tool results in
      // context and answers about the wrong repository.
      resetLiveTools();
      addSession({ id: session.threadId, repoName: `${owner}/${name}`, title: session.title, timestamp: "Now" });
      setActiveSession(session.threadId);
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Failed to connect to the repository. Make sure the AI backend is running on http://localhost:8000";
      toast.error(message);
    } finally {
      setConnecting(false);
    }
  }

  async function handleReindex() {
    if (reindexing || !connectedRepo) return;
    setReindexing(true);
    const repoUrl = `https://github.com/${connectedRepo.owner}/${connectedRepo.name}`;

    try {
      const enqueRes = await fetch("/api/index-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl, force: true }),
      });

      if (!enqueRes.ok) {
        throw new Error("Failed to queue re-indexing");
      }

      const { jobId } = await enqueRes.json();
      toast.info("Re-indexing started — this can take a few minutes for large repos.");
      const indexRes = await pollIndexJob(jobId);

      if (indexRes && typeof indexRes.total_chunks === "number") {
        setConnectedRepo({ ...connectedRepo, indexedChunks: indexRes.total_chunks });
      }
      toast.success("Repository re-indexed — the agent now sees the latest code.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to re-index repository.";
      toast.error(message);
    } finally {
      setReindexing(false);
    }
  }

  async function handleNewChat() {
    if (!connectedRepo?.id) {
      toast.error("Connect a repository first.");
      return;
    }
    resetLiveTools();
    try {
      const { session } = await createNewSession(connectedRepo.id);
      addSession({
        id: session.threadId,
        repoName: `${connectedRepo.owner}/${connectedRepo.name}`,
        title: session.title,
        timestamp: "Now",
      });
      setActiveSession(session.threadId);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to start a new chat.";
      toast.error(message);
    } finally {
      onClose?.();
    }
  }

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden font-sans"
      style={{
        background: "var(--rb-glass-bg-sidebar)",
        backdropFilter: "var(--rb-glass-backdrop-sidebar)",
        WebkitBackdropFilter: "var(--rb-glass-backdrop-sidebar)",
        borderRight: isMobile ? "none" : "1px solid var(--rb-glass-border-sidebar)",
        boxShadow: isMobile ? "4px 0 32px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className={`relative flex-shrink-0 border-b border-border ${isMobile ? "px-[18px] pt-4 pb-3.5" : "px-5 pt-5 pb-4"}`}>
        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0 flex items-center">
            <RepoBrainMark size={34} isDark={isDark} />
          </div>
          <div>
            <div className={`font-mono ${isTablet ? "text-[13px]" : "text-[15px]"} font-semibold text-primary tracking-tight leading-none`}>
              RepoBrain
            </div>
            <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
              AI Repo Analysis
            </div>
          </div>
        </div>

        {isMobile && onClose && (
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8"
          >
            <X size={15} />
          </Button>
        )}

        {!isMobile && showCollapseToggle && (
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleCollapse}
            title="Hide sidebar"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 hover:border-primary hover:text-primary"
          >
            <PanelLeftClose size={15} />
          </Button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <RepoConnect
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          connecting={connecting}
          onConnect={handleConnect}
          connectedRepo={connectedRepo}
          isTablet={isTablet}
          reindexing={reindexing}
          onReindex={handleReindex}
        />

        <SessionHistory
          sessions={connectedRepo ? sessions.filter(s => s.repoName === `${connectedRepo.owner}/${connectedRepo.name}`) : []}
          activeSession={activeSession}
          setActiveSession={setActiveSession}
          onClose={onClose}
          isMobile={isMobile}
        />
      </div>

      <div className={`flex-shrink-0 border-t border-border flex flex-col gap-2 px-3.5 ${isMobile ? "pt-3 pb-6" : "pt-3 pb-[18px]"}`}>
        <Button
          onClick={handleNewChat}
          className="w-full rounded-full text-white gap-1.5 hover:opacity-90 transition-opacity"
          style={{ background: "var(--rb-cta-gradient)" }}
        >
          <Plus size={14} /> New Chat
        </Button>

        <Separator />

        <Button
          variant="outline"
          onClick={() => setIsDark(!isDark)}
          className="w-full font-mono text-[11px] gap-1.5 hover:border-primary hover:text-primary"
        >
          {isDark ? <Sun size={12} /> : <Moon size={12} />}
          {isDark ? "Switch to Light" : "Switch to Dark"}
        </Button>

        <Button
          variant="outline"
          onClick={handleSignOut}
          className="w-full font-mono text-[11px] gap-1.5 hover:border-destructive hover:text-destructive"
        >
          <LogOut size={12} /> Sign Out
        </Button>
      </div>
    </div>
  );
}
