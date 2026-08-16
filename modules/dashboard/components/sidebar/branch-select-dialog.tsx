"use client";

import { useState } from "react";
import { GitBranch } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/shared/components/ui/command";
import type { BranchSelectDialogProps } from "@/types";

export function BranchSelectDialog({ open, onOpenChange, branches, loading, onSelect }: BranchSelectDialogProps) {
  const [search, setSearch] = useState("");
  
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Select a branch"
      description="Choose which branch to index and chat against"
    >
      <CommandInput
        placeholder={loading ? "Loading branches…" : "Search branches…"}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? "Loading branches…" : "No branches found."}
        </CommandEmpty>
        <CommandGroup heading="Branches">
          {branches.map((branch) => (
            <CommandItem
              key={branch.name}
              value={branch.name}
              onSelect={() => {
                onSelect(branch.name);
                onOpenChange(false);
              }}
              className="gap-2"
            >
              <GitBranch size={14} className="text-muted-foreground" />
              <span className="flex-1 font-mono text-xs">{branch.name}</span>
              {branch.isDefault && (
                <span className="text-[10px] font-mono text-muted-foreground">default</span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
