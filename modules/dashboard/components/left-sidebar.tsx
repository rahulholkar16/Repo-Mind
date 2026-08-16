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
import { BranchSelectDialog } from "./sidebar/branch-select-dialog";
import { SessionHistory } from "./sidebar/session-history";
import { useDashboardStore } from "@/modules/dashboard/store/use-dashboard-store";
import { getRepositoryTree, getSessions, connectRepoRecord, createNewSession } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import pollIndexJob from "@/modules/dashboard/utils/poll-index-job";
import { parseRepoUrl } from "@/modules/dashboard/utils/parse-repo-url";
import type { RepoBranch, RepoInfoResponse } from "@/types";

interface PendingRepo {
  url: string;
  owner: string;
  name: string;
  repoInfo: RepoInfoResponse | null;
}

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
  const setSelectedBranch = useDashboardStore((s) => s.setSelectedBranch);

  const [urlInput,   setUrlInput]   = useState("");
  const [connecting, setConnecting] = useState(false);
  const [reindexing, setReindexing] = useState(false);

  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [branches, setBranches]           = useState<RepoBranch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [pendingRepo, setPendingRepo] = useState<PendingRepo | null>(null);

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch((e) => console.warn("Could not load session history:", e));
  }, [setSessions]);

  // Step 1: user submits a repo URL — fetch its branches and open the
  // picker. The actual connect (indexing, DB record, etc.) only happens
  // once they pick a branch, in finalizeConnect below.
  async function openBranchPicker() {
    if (connecting || !urlInput.trim()) return;

    const parsed = parseRepoUrl(urlInput);
    if (!parsed) {
      toast.error("Invalid repository path. Use format: owner/name");
      return;
    }
    const { owner, name, repoUrl } = parsed;

    setPendingRepo({ url: repoUrl, owner, name, repoInfo: null });
    setBranches([]);
    setBranchesLoading(true);
    setBranchDialogOpen(true);

    try {
      const res = await fetch(`/api/github/branches?repo_url=${encodeURIComponent(repoUrl)}`);
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.detail || "Failed to fetch branches");
      }
      setBranches(data.branches);
      // Reuse the repo info fetched alongside branches — avoids fetching
      // it again once the branch is picked.
      setPendingRepo((prev) => (prev ? { ...prev, repoInfo: data.repoInfo ?? null } : prev));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch branches";
      toast.error(message);
      setBranchDialogOpen(false);
      setPendingRepo(null);
    } finally {
      setBranchesLoading(false);
    }
  }

  // Fetch Repo Tree 
  async function fetchFileTree(repoUrl: string) {
    try {
      const treeRes = await getRepositoryTree(repoUrl);
      return treeRes.tree;
    } catch (e) {
      console.error("Failed to fetch file tree:", e);
      return undefined;
    }
  }

  // Queues indexing and waits for it to finish, returning the chunk count.
  async function indexAndWait(repoUrl: string): Promise<number | undefined> {
    const enqueueRes = await fetch("/api/index-repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_url: repoUrl }),
    });
    if (!enqueueRes.ok) {
      throw new Error("Failed to queue repository indexing");
    }

    const { jobId } = await enqueueRes.json();
    const indexRes = await pollIndexJob(jobId);
    return typeof indexRes?.total_chunks === "number" ? indexRes.total_chunks : undefined;
  }

  // Step 2: user picked a branch — actually connect the repo (index it,
  // fetch its tree, persist the record, start the first chat session).
  async function finalizeConnect(branchName: string) {
    if (!pendingRepo) return;
    const { url: repoUrl, owner, name, repoInfo } = pendingRepo;
    setSelectedBranch(branchName);
    setPendingRepo(null);
    setConnecting(true);

    try {
      const repoData: RepoInfo = {
        owner,
        name,
        language: repoInfo?.language ?? "Unknown",
        stars: repoInfo?.stars ?? 0,
        description: repoInfo?.description ?? "",
      };

      repoData.fileTree = await fetchFileTree(repoUrl);
      repoData.indexedChunks = await indexAndWait(repoUrl);

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
          onConnect={openBranchPicker}
          connectedRepo={connectedRepo}
          isTablet={isTablet}
          reindexing={reindexing}
          onReindex={handleReindex}
        />

        <BranchSelectDialog
          open={branchDialogOpen}
          onOpenChange={(open) => {
            setBranchDialogOpen(open);
            if (!open) setPendingRepo(null);
          }}
          branches={branches}
          loading={branchesLoading}
          onSelect={finalizeConnect}
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

        <div className="text-center font-mono text-[10px] text-muted-foreground pt-1">
          Made by Rahul
        </div>
      </div>
    </div>
  );
}
