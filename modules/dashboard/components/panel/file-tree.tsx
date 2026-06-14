import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Folder, FolderOpen, FileCode2 } from "lucide-react";

export interface FileNode { name: string; type: "dir" | "file"; ext?: string; children?: FileNode[]; }

const EXT_COLORS: Record<string, string> = {
  ts: "#3178c6", tsx: "#61dafb", js: "#f1e05a", json: "#ffe066", py: "#3572A5", md: "#083fa1", yml: "#cb171e", yaml: "#cb171e"
};

export function TreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isDir = node.type === "dir";
  const indent = 8 + depth * 13;

  return (
    <div>
      <button
        onClick={() => isDir && setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          width: "100%", paddingLeft: indent, paddingRight: 8,
          paddingTop: 3.5, paddingBottom: 3.5,
          background: "none", border: "none", cursor: isDir ? "pointer" : "default",
          borderRadius: 6, transition: "background 0.1s", textAlign: "left",
        }}
        onMouseEnter={e => isDir && (e.currentTarget.style.background = "var(--rb-hover-surface)")}
        onMouseLeave={e => (e.currentTarget.style.background = "none")}
      >
        {isDir
          ? <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.14 }} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}><ChevronRight size={10} style={{ color: "var(--muted-foreground)" }} /></motion.span>
          : <span style={{ width: 10, flexShrink: 0 }} />}

        {isDir
          ? (open
              ? <FolderOpen size={12} style={{ color: "var(--accent-foreground)", flexShrink: 0 }} />
              : <Folder     size={12} style={{ color: "var(--accent-foreground)", flexShrink: 0 }} />)
          : <FileCode2 size={12} style={{ color: EXT_COLORS[node.ext ?? ""] ?? "var(--muted-foreground)", flexShrink: 0 }} />}

        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: isDir ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: isDir ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {node.name}
        </span>
      </button>

      <AnimatePresence>
        {isDir && open && node.children?.length ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.16 }} style={{ overflow: "hidden" }}>
            {node.children.map((c, i) => <TreeNode key={c.name + i} node={c} depth={depth + 1} />)}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function FileTree({ tree, isMobile }: { tree?: FileNode[]; isMobile?: boolean }) {
  const [treeOpen, setTreeOpen] = useState(true);

  return (
    <div style={{ borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <button
        onClick={() => setTreeOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "11px 16px", border: "none", cursor: "pointer", background: "transparent", transition: "background 0.1s" }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--rb-hover-surface)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Folder size={13} style={{ color: "var(--accent-foreground)" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>File Tree</span>
        </div>
        <motion.div animate={{ rotate: treeOpen ? 90 : 0 }} transition={{ duration: 0.16 }}>
          <ChevronRight size={13} style={{ color: "var(--muted-foreground)" }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {treeOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.18 }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "3px 5px 10px", maxHeight: isMobile ? 180 : 210, overflowY: "auto" }}>
              {tree && tree.length > 0 ? (
                tree.map((n, i) => <TreeNode key={n.name + i} node={n} />)
              ) : (
                <div style={{ padding: "8px 12px", fontSize: 11, color: "var(--muted-foreground)", fontStyle: "italic" }}>
                  Connect a repository to load the file tree...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
