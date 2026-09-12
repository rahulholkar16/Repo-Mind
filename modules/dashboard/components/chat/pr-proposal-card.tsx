"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GitPullRequest, Check, X, Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { confirmPr, rejectPr } from "@/lib/api";
import { toast } from "sonner";
import type { PrProposal } from "@/types";

interface PrProposalCardProps {
  proposal: PrProposal;
  threadId: string;
  status: "pending" | "confirmed" | "rejected";
  initialResult?: { pr_url?: string; pr_number?: number };
  onStatusChange: (status: "confirmed" | "rejected", result?: { pr_url?: string; pr_number?: number }) => void;
}

export function PrProposalCard({ proposal, threadId, status, initialResult, onStatusChange }: PrProposalCardProps) {
  const [loading, setLoading] = useState<"confirm" | "reject" | null>(null);
  const [result, setResult] = useState<{ pr_url?: string; pr_number?: number } | null>(initialResult ?? null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(proposal.title);
  const [body, setBody] = useState(proposal.body ?? "");

  async function handleConfirm() {
    if (loading) return;
    setLoading("confirm");
    try {
      const res = await confirmPr(threadId, { title, body });
      if (!res.success) {
        toast.error(res.error || "Failed to create the PR.");
        return;
      }
      setResult({ pr_url: res.pr_url, pr_number: res.pr_number });
      onStatusChange("confirmed", res);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to confirm PR.";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  }

  async function handleReject() {
    if (loading) return;
    setLoading("reject");
    try {
      await rejectPr(threadId);
      onStatusChange("rejected");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to cancel PR proposal.";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 14,
        background: "var(--rb-agent-bubble-bg)",
        maxWidth: 480,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GitPullRequest size={15} style={{ color: "var(--primary)" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600 }}>
            Pull request proposal
          </span>
        </div>
        {status === "pending" && !isEditing && (
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="gap-1.5 h-7 px-2">
            <Pencil size={12} /> Edit
          </Button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
        <div><strong>Repo:</strong> {proposal.repo_full_name}</div>

        {isEditing ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
              <label style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-8 text-sm" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
              <label style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Description</label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} className="text-sm resize-none" />
            </div>
          </>
        ) : (
          <>
            <div><strong>Title:</strong> {title}</div>
            <div><strong>Branch:</strong> {proposal.head} → {proposal.base}</div>
            {body && (
              <div style={{ color: "var(--muted-foreground)", whiteSpace: "pre-wrap" }}>{body}</div>
            )}
          </>
        )}
      </div>

      {status === "pending" && (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {isEditing ? (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="gap-1.5">
              Done editing
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={handleConfirm} disabled={loading !== null} className="gap-1.5">
                <Check size={13} /> {loading === "confirm" ? "Creating..." : "Confirm"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleReject} disabled={loading !== null} className="gap-1.5">
                <X size={13} /> Cancel
              </Button>
            </>
          )}
        </div>
      )}

      {status === "confirmed" && (
        <div style={{ marginTop: 12, fontSize: 13, color: "var(--primary)" }}>
          ✅ PR created
          {result?.pr_url && (
            <>
              {" — "}
              <a href={result.pr_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                #{result.pr_number}
              </a>
            </>
          )}
        </div>
      )}

      {status === "rejected" && (
        <div style={{ marginTop: 12, fontSize: 13, color: "var(--muted-foreground)" }}>
          ❌ Proposal cancelled
        </div>
      )}
    </motion.div>
  );
}
