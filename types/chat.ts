export interface ToolCall {
  name: string;
  args?: string;
}

export interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  codeBlock?: { language: string; code: string };
}

export interface AgentRequest {
  repo_url: string;
  question: string;
  thread_id: string;
  repo_id: string;
}

export interface AgentChatResponse {
  answer: string;
  codeBlock?: { language: string; code: string };
  toolCalls?: ToolCall[];
  thread_id: string;
}

export interface StreamHandlers {
  /** Called every time the final answer text chunk arrives. */
  onChunk: (text: string) => void;
  /** Called when the model decides to call a tool (name only, no args). */
  onToolCall: (toolName: string) => void;
  /** Called when a tool finishes and returns a result (name only, no raw content). */
  onToolResult: (toolName: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
}
