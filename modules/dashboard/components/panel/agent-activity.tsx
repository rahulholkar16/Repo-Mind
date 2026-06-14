import { motion } from "motion/react";
import { Activity, Zap, X } from "lucide-react";

const TOOLS = [
  { name: "list_directory",  color: "#F59E0B", label: "Listing structure"  },
  { name: "search_file",     color: "#8B5CF6", label: "Searching patterns" },
  { name: "read_file",       color: "#10B981", label: "Reading source"     },
  { name: "grep_search",     color: "#3B82F6", label: "Grep references"    },
  { name: "analyze_imports", color: "#F97316", label: "Mapping imports"    },
];

interface AgentActivityProps {
  activeToolIdx: number;
  setActiveToolIdx: (i: number) => void;
  isMobile: boolean;
  onClose?: () => void;
}

export function AgentActivity({ activeToolIdx, setActiveToolIdx, isMobile, onClose }: AgentActivityProps) {
  const activeTool = TOOLS[activeToolIdx];

  return (
    <div style={{ padding: "16px 16px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0, background: "transparent" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Activity size={13} style={{ color: "var(--primary)" }} />
          <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", margin: 0 }}>Agent Activity</h2>
        </div>

        {isMobile && onClose && (
          <button
            onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-foreground)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div style={{ borderRadius: 12, border: "1px solid var(--border)", padding: "11px 13px", background: "var(--card)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
          <div style={{ position: "relative", width: 9, height: 9, flexShrink: 0 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: activeTool.color }} />
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: activeTool.color, position: "absolute", inset: 0, opacity: 0.45 }} className="animate-ping" />
          </div>
          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{activeTool.label}</span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 8, background: `${activeTool.color}1A`, border: `1px solid ${activeTool.color}40` }}>
          <Zap size={10} style={{ color: activeTool.color }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: activeTool.color }}>{activeTool.name}</span>
        </div>
      </div>

      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 1 }}>
        {TOOLS.slice(0, activeToolIdx + 1).map((tool, i) => (
          <motion.button
            key={tool.name}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setActiveToolIdx(i)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 7px", borderRadius: 7, border: "none", cursor: "pointer", background: "transparent", textAlign: "left", width: "100%", transition: "background 0.1s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--rb-hover-surface)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: i === activeToolIdx ? tool.color : "var(--border)", boxShadow: i === activeToolIdx ? `0 0 7px ${tool.color}` : "none", transition: "all 0.2s" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: i === activeToolIdx ? tool.color : "var(--muted-foreground)", fontWeight: i === activeToolIdx ? 600 : 400 }}>
              {tool.name}
            </span>
            {i === activeToolIdx && <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--muted-foreground)" }}>active</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
