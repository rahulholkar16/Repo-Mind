import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import type { Message } from "@/lib/types";
import { ChatHeader } from "./chat/chat-header";
import { MessageBubble } from "./chat/message-bubble";
import { TypingIndicator } from "./chat/typing-indicator";
import { ChatInput } from "./chat/chat-input";
import { streamAgent } from "@/lib/api";
import { useDashboardStore } from "@/modules/dashboard/store/use-dashboard-store";

let messageIdCounter = 0;

function nextMessageId(): string {
  messageIdCounter += 1;
  return `${Date.now()}-${messageIdCounter}`;
}

interface ChatAreaProps {
  isMobile?: boolean;
  isTablet?: boolean;
  onOpenSidebar?: () => void;
  onOpenRightPanel?: () => void;
  showRightToggle?: boolean;
  isDark?: boolean;
  setIsDark?: (v: boolean) => void;
}

export function ChatArea({ isMobile = false, isTablet = false, onOpenSidebar, onOpenRightPanel, showRightToggle = false, isDark = false, setIsDark }: ChatAreaProps) {
  const repo            = useDashboardStore((s) => s.connectedRepo);
  const activeSession    = useDashboardStore((s) => s.activeSession);
  const pushToolStatus   = useDashboardStore((s) => s.pushToolStatus);
  const resetLiveTools   = useDashboardStore((s) => s.resetLiveTools);

  const [messages,      setMessages]      = useState<Message[]>([]);
  const [input,         setInput]         = useState("");
  const [isTyping,      setIsTyping]      = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversationKey = `${repo ? `${repo.owner}/${repo.name}` : "none"}::${activeSession ?? ""}`;
  const [renderedKey, setRenderedKey] = useState(conversationKey);

  
  if (conversationKey !== renderedKey) {
    setRenderedKey(conversationKey);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(
      repo
        ? [{
            id: "welcome",
            role: "agent",
            timestamp: now,
            content: `Connected to **${repo.owner}/${repo.name}** — **${repo.language}** codebase. Ask me anything about this repository and I'll analyze it in real time.`,
          }]
        : [{
            id: "welcome-default",
            role: "agent",
            timestamp: now,
            content: "Welcome to **RepoBrain**! Please connect a GitHub repository in the sidebar to start the analysis.",
          }]
    );
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleScroll() {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  }

  const submitMessage = useCallback(async (text: string) => {
    if (isTyping) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages(prev => [...prev, { id: nextMessageId(), role: "user", content: text, timestamp: now }]);
    setIsTyping(true);

    // Fresh turn — clear the right panel's activity log and the bubble's
    // local tool tracker together so both views start from zero.
    resetLiveTools();

    const agentMsgId = nextMessageId();
    setMessages(prev => [...prev, {
      id: agentMsgId,
      role: "agent",
      content: "",
      timestamp: now,
      toolCalls: [{ name: "thinking", args: "Reading the repo and planning a response..." }],
    }]);

    let receivedAnyChunk = false;
    // Live-updated list of tool activity (call -> result) shown in the
    // bubble's tool-row area while the agent is working.
    const activeTools = new Map<string, { name: string; args?: string }>();

    const updateAgentMessage = (partial: Partial<Pick<Message, "content" | "toolCalls">>) => {
      setMessages(prev => prev.map(m => (m.id === agentMsgId ? { ...m, ...partial } : m)));
    };

    const pushLocalToolStatus = (name: string, status: "calling" | "done") => {
      activeTools.set(name, { name, args: status === "calling" ? "running..." : "done" });
      updateAgentMessage({ toolCalls: Array.from(activeTools.values()) });
      // Mirror the same event into the shared store so the right-panel
      // "Agent Activity" card reflects exactly what's happening live.
      pushToolStatus(name, status);
    };

    try {
      const repoUrl = repo ? `https://github.com/${repo.owner}/${repo.name}` : "";
      if (!repoUrl) {
        throw new Error("No repository connected. Please connect a repository first.");
      }

      const threadId = activeSession || "default";
      const repoId = repo ? `${repo.owner}/${repo.name}` : "unknown";

      await streamAgent(repoUrl, text, threadId, repoId, {
        onToolCall: (toolName) => {
          // Model just decided to call this tool — show it as active.
          pushLocalToolStatus(toolName, "calling");
        },
        onToolResult: (toolName) => {
          // Tool finished — mark it done, but keep the row visible so the
          // user can see everything the agent looked at.
          pushLocalToolStatus(toolName, "done");
        },
        onChunk: (chunk) => {
          // This is the final answer text — clear tool activity and show it.
          receivedAnyChunk = true;
          updateAgentMessage({ content: chunk, toolCalls: undefined });
        },
        onDone: () => {
          // Nothing more to do here — typing indicator stops in `finally`.
        },
        onError: (message) => {
          // Show the error as a toast instead of a permanent chat bubble,
          // and drop the empty "thinking" placeholder message.
          toast.error(message);
          setMessages(prev => prev.filter(m => m.id !== agentMsgId));
        },
      });

      if (!receivedAnyChunk) {
        updateAgentMessage({ content: "The agent didn't return a response. Please try again.", toolCalls: undefined });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to communicate with the AI services. Please ensure the backend is running on http://localhost:8000.";
      toast.error(message);
      setMessages(prev => prev.filter(m => m.id !== agentMsgId));
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, repo, activeSession, pushToolStatus, resetLiveTools]);

  async function handleSend() {
    if (!input.trim() || isTyping) return;
    const text = input.trim();
    setInput("");
    await submitMessage(text);
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        submitMessage(customEvent.detail);
      }
    };
    window.addEventListener("rb-send-message", handler);
    return () => window.removeEventListener("rb-send-message", handler);
  }, [repo, activeSession, isTyping, submitMessage]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", fontFamily: "'Inter', sans-serif", background: "transparent", position: "relative" }}>

      <ChatHeader
        repo={repo}
        isMobile={isMobile}
        onOpenSidebar={onOpenSidebar}
        onOpenRightPanel={onOpenRightPanel}
        showRightToggle={showRightToggle}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: "auto", padding: isMobile ? "14px 14px" : "22px 24px", display: "flex", flexDirection: "column", gap: isMobile ? 14 : 18 }}
      >
        {messages.map((msg, i) => <MessageBubble key={msg.id} msg={msg} index={i} isMobile={isMobile} />)}
        {isTyping && <TypingIndicator />}
      </div>

      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })}
            style={{
              position: "absolute", bottom: isMobile ? 100 : 92, left: "50%", transform: "translateX(-50%)",
              width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)",
              background: "var(--card)", color: "var(--muted-foreground)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            }}
          >
            <ChevronDown size={15} />
          </motion.button>
        )}
      </AnimatePresence>

      <ChatInput
        input={input}
        isTyping={isTyping}
        isMobile={isMobile}
        onChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
}
