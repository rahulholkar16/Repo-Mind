export interface ParsedRepoUrl {
  owner: string;
  name: string;
  repoUrl: string;
}

/**
 * Normalizes a pasted GitHub URL/path (with or without scheme, trailing
 * slash, or .git suffix) into { owner, name, repoUrl }. Returns null if
 * it doesn't look like a valid owner/repo path.
 */
export function parseRepoUrl(input: string): ParsedRepoUrl | null {
  const cleaned = input
    .trim()
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/^github\.com\//, "")
    .replace(/\.git$/, "")
    .replace(/\/$/, "");

  const [owner, name] = cleaned.split("/");
  if (!owner || !name) return null;

  return { owner, name, repoUrl: `https://github.com/${owner}/${name}` };
}
