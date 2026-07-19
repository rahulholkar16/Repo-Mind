import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { Message, RepoInfo  } from "@/lib/types";
import { ChatHeader } from "./chat/chat-header";
import { MessageBubble } from "./chat/message-bubble";
import { TypingIndicator } from "./chat/typing-indicator";
import { ChatInput } from "./chat/chat-input";
import { askAgent } from "@/lib/api";

interface ChatAreaProps {
  repo: RepoInfo | null;
  isMobile?: boolean;
  isTablet?: boolean;
  onOpenSidebar?: () => void;
  onOpenRightPanel?: () => void;
  showRightToggle?: boolean;
  isDark?: boolean;
  setIsDark?: (v: boolean) => void;
  activeSession?: string;
}

export function ChatArea({ repo, isMobile = false, isTablet = false, onOpenSidebar, onOpenRightPanel, showRightToggle = false, isDark = false, setIsDark, activeSession }: ChatAreaProps) {
  const [messages,      setMessages]      = useState<Message[]>([]);
  const [input,         setInput]         = useState("");
  const [isTyping,      setIsTyping]      = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (repo) {
      setMessages([
        {
          id: "welcome",
          role: "agent",
          timestamp: now,
          content: `Connected to **${repo.owner}/${repo.name}** — **${repo.language}** codebase. Ask me anything about this repository and I'll analyze it in real time.`,
        }
      ]);
    } else {
      setMessages([
        {
          id: "welcome-default",
          role: "agent",
          timestamp: now,
          content: "Welcome to **RepoBrain**! Please connect a GitHub repository in the sidebar to start the analysis.",
        }
      ]);
    }
  }, [repo, activeSession]);

  function handleScroll() {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  }

  async function submitMessage(text: string) {
    if (isTyping) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages(prev => [...prev, { id: String(Date.now()), role: "user", content: text, timestamp: now }]);
    setIsTyping(true);

    try {
      const repoUrl = repo ? `https://github.com/${repo.owner}/${repo.name}` : "";
      if (!repoUrl) {
        throw new Error("No repository connected. Please connect a repository first.");
      }

      setMessages(prev => [...prev, {
        id: String(Date.now() + 1),
        role: "agent",
        content: "",
        timestamp: now,
        toolCalls: [
          { name: "search_codebase", args: text.slice(0, 32) },
          { name: "read_file", args: "Analyzing repository..." }
        ]
      }]);

      // thread_id keeps conversation memory in Postgres; repo_id is just a
      // stable identifier for the current repo (owner/name works fine here).
      const threadId = activeSession || "default";
      const repoId = repo ? `${repo.owner}/${repo.name}` : "unknown";

      const response = await askAgent(repoUrl, text, threadId, repoId);

      setMessages(prev => {
        const filtered = prev.filter(m => !m.toolCalls);
        const newMessages = [...filtered];

        // Display actual tool calls if the agent invoked tools
        if (response.toolCalls && response.toolCalls.length > 0) {
          newMessages.push({
            id: String(Date.now() + 1),
            role: "agent",
            content: "",
            timestamp: now,
            toolCalls: response.toolCalls,
          });
        }

        // Display final answer
        newMessages.push({
          id: String(Date.now() + 2),
          role: "agent",
          timestamp: now,
          content: response.answer, 
          codeBlock: response.codeBlock,
        });

        return newMessages;
      });
    } catch (err: any) {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.toolCalls);
        return [...filtered, {
          id: String(Date.now() + 3),
          role: "agent",
          timestamp: now,
          content: `❌ **Backend Error:** ${err.message || "Failed to communicate with the AI services. Please ensure the backend is running on http://localhost:8000."}`,
        }];
      });
    } finally {
      setIsTyping(false);
    }
  }

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
  }, [repo, activeSession, isTyping]);

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
