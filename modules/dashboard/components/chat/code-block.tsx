export function CodeBlock({ language, code, isMobile }: { language: string; code: string; isMobile?: boolean }) {
  return (
    <div style={{ marginTop: 10, borderRadius: 12, overflow: "hidden", border: "1px solid var(--rb-code-border)", background: "var(--rb-code-bg)", backdropFilter: "var(--rb-glass-backdrop)", WebkitBackdropFilter: "var(--rb-glass-backdrop)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", borderBottom: "1px solid var(--rb-code-border)" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{language}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.75 }} />)}
        </div>
      </div>
      <pre style={{
        margin: 0, padding: isMobile ? "10px 12px" : "13px 16px",
        overflowX: "auto", fontFamily: "'JetBrains Mono', monospace",
        fontSize: isMobile ? 11 : 12, lineHeight: 1.65, color: "var(--rb-code-text)",
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
