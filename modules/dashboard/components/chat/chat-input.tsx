"use client";

import { useRef } from "react";
import { Send, Paperclip, Square } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { ChatInputProps } from "@/types";

export function ChatInput({ input, isTyping, isMobile, onChange, onSend, onStop }: ChatInputProps) {
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
    <div className={`border-t border-border flex-shrink-0 ${isMobile ? "px-3 pt-2.5 pb-4" : "px-[18px] pt-2.5 pb-4"}`}>
      <div
        className="rounded-[14px] border border-border overflow-hidden transition-[border-color,box-shadow] duration-200 focus-within:shadow-[0_0_0_3px_rgba(255,107,53,0.08),0_8px_32px_rgba(0,0,0,0.3)] focus-within:border-[rgba(255,107,53,0.5)]"
        style={{
          background: "var(--rb-input-area-bg)",
          backdropFilter: "var(--rb-glass-backdrop-input)",
          WebkitBackdropFilter: "var(--rb-glass-backdrop-input)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            else if (e.key === "Escape" && isTyping) { e.preventDefault(); onStop(); }
          }}
          placeholder="Ask anything about this repository…"
          rows={1}
          className={`w-full box-border bg-transparent text-foreground font-sans border-none outline-none resize-none ${
            isMobile ? "text-[15px] px-3 pt-3 pb-1" : "text-sm px-3.5 pt-[13px] pb-1"
          }`}
          style={{ minHeight: 44, maxHeight: isMobile ? 100 : 120, WebkitAppearance: "none" }}
        />
        <div className={`flex items-center justify-between ${isMobile ? "px-2 pt-1 pb-2.5" : "px-2.5 pt-1 pb-2.5"}`}>
          <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground">
            <Paperclip size={isMobile ? 17 : 15} />
          </Button>
          <div className={`flex items-center ${isMobile ? "gap-2" : "gap-2.5"}`}>
            {!isMobile && (
              <span className="font-mono text-[10px] text-muted-foreground">
                {isTyping ? "esc to stop" : "↵ send · ⇧↵ newline"}
              </span>
            )}
            {isTyping ? (
              <Button
                size="icon"
                onClick={onStop}
                title="Stop generating"
                className={isMobile ? "w-9 h-9" : "w-8 h-8"}
              >
                <Square size={isMobile ? 13 : 11} fill="currentColor" />
              </Button>
            ) : (
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim()}
                className={isMobile ? "w-9 h-9" : "w-8 h-8"}
              >
                <Send size={isMobile ? 15 : 13} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
