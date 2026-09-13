"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GitBranch, Check, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { confirmBranch, rejectBranch } from "@/lib/api";
import { toast } from "sonner";
import type { BranchProposal } from "@/types";

interface BranchProposalCardProps {
  proposal: BranchProposal;
  threadId: string;
  status: "pending" | "confirmed" | "rejected";
  initialResult?: { branch?: string; html_url?: string };
  onStatusChange: (status: "confirmed" | "rejected", result?: { branch?: string; html_url?: string }) => void;
}

export function BranchProposalCard({ proposal, threadId, status, initialResult, onStatusChange }: BranchProposalCardProps) {
  const [loading, setLoading] = useState<"confirm" | "reject" | null>(null);
  const [result, setResult] = useState<{ branch?: string; html_url?: string } | null>(initialResult ?? null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleConfirm() {
    if (loading) return;
    setLoading("confirm");
    setErrorMessage(null);
    try {
      const res = await confirmBranch(threadId);
      if (!res.success) {
        const message = res.error || "Failed to create the branch.";
        toast.error(message);
        if (res.retryable === false) {
          setErrorMessage(message);
          onStatusChange("rejected");
          return;
        }
        setErrorMessage(message);
        return;
      }
      setResult({ branch: res.branch, html_url: res.html_url });
      onStatusChange("confirmed", res);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to confirm branch.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(null);
    }
  }

  async function handleReject() {
    if (loading) return;
    setLoading("reject");
    try {
      await rejectBranch(threadId);
      onStatusChange("rejected");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to cancel branch proposal.";
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
          <GitBranch size={15} style={{ color: "var(--primary)" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600 }}>
            Branch creation proposal
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
        <div><strong>Repo:</strong> {proposal.repo_full_name}</div>
        <div><strong>New branch:</strong> {proposal.new_branch}</div>
        <div><strong>From:</strong> {proposal.source_branch}</div>
      </div>

      {status === "pending" && errorMessage && (
        <div
          style={{
            marginTop: 10,
            padding: "8px 10px",
            borderRadius: 8,
            background: "color-mix(in srgb, red 10%, transparent)",
            border: "1px solid color-mix(in srgb, red 30%, transparent)",
            color: "var(--destructive, #e5484d)",
            fontSize: 12.5,
            lineHeight: 1.4,
          }}
        >
          {errorMessage}
        </div>
      )}

      {status === "pending" && (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Button size="sm" onClick={handleConfirm} disabled={loading !== null} className="gap-1.5">
            <Check size={13} /> {loading === "confirm" ? "Creating..." : "Confirm"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleReject} disabled={loading !== null} className="gap-1.5">
            <X size={13} /> Cancel
          </Button>
        </div>
      )}

      {status === "confirmed" && (
        <div style={{ marginTop: 12, fontSize: 13, color: "var(--primary)" }}>
          ✅ Branch created
          {result?.html_url && (
            <>
              {" — "}
              <a href={result.html_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                {result.branch}
              </a>
            </>
          )}
        </div>
      )}

      {status === "rejected" && (
        <div style={{ marginTop: 12, fontSize: 13, color: "var(--muted-foreground)" }}>
          {errorMessage ? `❌ ${errorMessage}` : "❌ Proposal cancelled"}
        </div>
      )}
    </motion.div>
  );
}
