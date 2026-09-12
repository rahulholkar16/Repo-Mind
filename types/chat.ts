export interface ToolCall {
  name: string;
  args?: string;
}

export interface PrProposal {
  repo_full_name: string;
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  codeBlock?: { language: string; code: string };
  prProposal?: PrProposal;
  prStatus?: "pending" | "confirmed" | "rejected";
  prResult?: { pr_url?: string; pr_number?: number };
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
  /** Called when the agent stages a PR proposal awaiting user confirmation. */
  onPrProposal: (proposal: PrProposal) => void;
  onDone: () => void;
  onError: (message: string) => void;
}
