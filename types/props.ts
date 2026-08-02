import type { RepoInfo } from "./repo";
import type { Session } from "./session";
import type { ToolCall } from "./chat";

export interface ChatHeaderProps {
  repo: RepoInfo | null;
  isMobile: boolean;
  onOpenSidebar?: () => void;
  onOpenRightPanel?: () => void;
  showRightToggle: boolean;
  isDark: boolean;
  setIsDark?: (v: boolean) => void;
}

export interface ChatInputProps {
  input: string;
  isTyping: boolean;
  isMobile: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
}

export interface ChatAreaProps {
  isMobile?: boolean;
  isTablet?: boolean;
  onOpenSidebar?: () => void;
  onOpenRightPanel?: () => void;
  showRightToggle?: boolean;
  isDark?: boolean;
  setIsDark?: (v: boolean) => void;
}

export interface LeftSidebarProps {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  isMobile?: boolean;
  isTablet?: boolean;
  onClose?: () => void;
}

export interface RightPanelProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export interface SessionHistoryProps {
  sessions: Session[];
  activeSession: string;
  setActiveSession: (id: string) => void;
  onClose?: () => void;
  isMobile: boolean;
}

export interface RepoConnectProps {
  urlInput: string;
  setUrlInput: (v: string) => void;
  connecting: boolean;
  onConnect: () => void;
  connectedRepo: RepoInfo | null;
  isTablet: boolean;
}

export interface AgentActivityProps {
  liveTools: ToolCall[];
  isMobile: boolean;
  onClose?: () => void;
}

export interface MarkdownRendererProps {
  content: string;
}

export interface LandingProps {
  onEnterApp: () => void;
  isDark: boolean;
  setIsDark: (v: boolean) => void;
}
