import { useRef } from "react";
import { Send, Paperclip } from "lucide-react";

interface ChatInputProps {
  input: string;
  isTyping: boolean;
  isMobile: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ input, isTyping, isMobile, onChange, onSend }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, isMobile ? 100 : 120)}px`;
    }
  }

  function handleSend() {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onSend();
  }

  return (
    <div style={{ padding: isMobile ? "10px 12px 16px" : "10px 18px 16px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
      <div
        style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--rb-input-area-bg)", backdropFilter: "var(--rb-glass-backdrop-input)", WebkitBackdropFilter: "var(--rb-glass-backdrop-input)", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s" }}
        onFocusCapture={e => { e.currentTarget.style.borderColor = "rgba(255,107,53,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.08), 0 8px 32px rgba(0,0,0,0.3)"; }}
        onBlurCapture={e  => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask anything about this repository…"
          rows={1}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: isMobile ? "12px 12px 4px" : "13px 14px 4px",
            background: "transparent", color: "var(--foreground)",
            fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 15 : 14,
            border: "none", outline: "none", resize: "none",
            minHeight: 44, maxHeight: isMobile ? 100 : 120,
            WebkitAppearance: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "4px 8px 10px" : "4px 10px 10px" }}>
          <button style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Paperclip size={isMobile ? 17 : 15} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 10 }}>
            {!isMobile && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--muted-foreground)" }}>
                ↵ send · ⇧↵ newline
              </span>
            )}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              style={{
                width: isMobile ? 36 : 32, height: isMobile ? 36 : 32,
                borderRadius: 9, border: "none",
                background: (!input.trim() || isTyping) ? "var(--muted)" : "var(--primary)",
                color: "#fff", cursor: (!input.trim() || isTyping) ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s", flexShrink: 0,
              }}
            >
              <Send size={isMobile ? 15 : 13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
