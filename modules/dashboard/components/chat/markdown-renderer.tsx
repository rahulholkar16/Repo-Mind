import React from "react";
import { CodeBlock } from "./code-block";

interface MarkdownRendererProps {
  content: string;
}

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const pattern = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  const splitParts = text.split(pattern);

  return splitParts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} style={{ fontWeight: 600, color: "var(--foreground)" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            background: "rgba(255, 107, 53, 0.08)",
            color: "var(--primary)",
            padding: "2px 6px",
            borderRadius: "5px",
            border: "1px solid rgba(255, 107, 53, 0.15)",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a
            key={index}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: 500 }}
          >
            {match[1]}
          </a>
        );
      }
    }
    return <span key={index}>{part}</span>;
  });
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];

  let currentTable: string[][] = [];
  let currentList: string[] = [];
  let inTable = false;
  let inList = false;

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      blocks.push(
        <ul
          key={`list-${key}`}
          style={{
            margin: "4px 0 12px 18px",
            padding: 0,
            listStyleType: "disc",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          {currentList.map((item, idx) => (
            <li key={idx} style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--foreground)" }}>
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
      inList = false;
    }
  };

  const flushTable = (key: number) => {
    if (currentTable.length > 0) {
      const headers = currentTable[0];
      const rows = currentTable.slice(1).filter((row) => {
        return !row.every((cell) => cell.trim().match(/^-+$/));
      });

      blocks.push(
        <div
          key={`table-container-${key}`}
          style={{
            overflowX: "auto",
            margin: "14px 0 16px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--card)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--rb-hover-surface)", borderBottom: "1px solid var(--border)" }}>
                {headers.map((header, idx) => (
                  <th key={idx} style={{ padding: "10px 12px", fontWeight: 600, color: "var(--foreground)" }}>
                    {parseInline(header.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={{
                    borderBottom: rowIdx === rows.length - 1 ? "none" : "1px solid var(--border)",
                    transition: "background 0.15s",
                  }}
                >
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} style={{ padding: "10px 12px", color: "var(--foreground)", opacity: 0.9 }}>
                      {parseInline(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Fenced code block: ```lang ... ```
    if (trimmed.startsWith("```")) {
      flushList(i);
      flushTable(i);
      const language = trimmed.slice(3).trim() || "text";
      const codeLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== "```") {
        codeLines.push(lines[j]);
        j++;
      }
      blocks.push(
        <CodeBlock key={`code-${i}`} language={language} code={codeLines.join("\n")} />
      );
      i = j; // skip past the closing fence (loop's i++ moves past it)
      continue;
    }

    // Check if line is a table row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList(i);
      inTable = true;
      const cells = trimmed.split("|").slice(1, -1);
      currentTable.push(cells);
      continue;
    } else if (inTable) {
      flushTable(i);
    }

    // Check if line is a list item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushTable(i);
      inList = true;
      currentList.push(trimmed.slice(2));
      continue;
    } else if (inList && trimmed.match(/^\d+\.\s/)) {
      flushTable(i);
      inList = true;
      currentList.push(trimmed.replace(/^\d+\.\s/, ""));
      continue;
    } else if (inList && trimmed !== "") {
      // Sublist or nested text, keep in list
      currentList[currentList.length - 1] += "\n" + trimmed;
      continue;
    } else if (trimmed === "") {
      flushList(i);
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h3 key={i} style={{ fontSize: "14.5px", fontWeight: 600, color: "var(--foreground)", margin: "16px 0 8px" }}>
          {parseInline(trimmed.slice(4))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push(
        <h2 key={i} style={{ fontSize: "16.5px", fontWeight: 600, color: "var(--foreground)", margin: "20px 0 10px" }}>
          {parseInline(trimmed.slice(3))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith("# ")) {
      blocks.push(
        <h1 key={i} style={{ fontSize: "19px", fontWeight: 700, color: "var(--foreground)", margin: "24px 0 12px" }}>
          {parseInline(trimmed.slice(2))}
        </h1>
      );
      continue;
    }

    // Horizontal rule
    if (trimmed === "---" || trimmed === "___" || trimmed === "***") {
      blocks.push(<hr key={i} style={{ border: 0, borderTop: "1px solid var(--border)", margin: "16px 0" }} />);
      continue;
    }

    // Standard paragraph
    blocks.push(
      <p key={i} style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--foreground)", margin: "0 0 10px" }}>
        {parseInline(trimmed)}
      </p>
    );
  }

  flushList(lines.length);
  flushTable(lines.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, maxWidth: "100%", overflowWrap: "break-word", wordBreak: "break-word" }}>
      {blocks}
    </div>
  );
}
