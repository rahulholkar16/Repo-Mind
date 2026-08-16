import { getAuthToken } from "@/lib/get-auth-token";
import { parseRepoUrl } from "@/modules/dashboard/utils/parse-repo-url";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://0.0.0.0:8000";

/**
 * Lists branches for a public GitHub repo, so the frontend can show a
 * branch-picker before indexing. The default branch comes from our own
 * ai-services /api/repo/info (already fetched with a GitHub token, higher
 * rate limit) — we only hit GitHub directly for the branches list itself,
 * since ai-services doesn't expose that yet.
 */
export async function GET(req: Request) {
  const token = await getAuthToken();
  if (!token) {
    return new Response(JSON.stringify({ detail: "Not authenticated" }), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const repoUrlParam = searchParams.get("repo_url");
  if (!repoUrlParam) {
    return new Response(JSON.stringify({ detail: "repo_url is required" }), { status: 400 });
  }

  const parsed = parseRepoUrl(repoUrlParam);
  if (!parsed) {
    return new Response(JSON.stringify({ detail: "Invalid repository URL" }), { status: 400 });
  }
  const { owner, name, repoUrl } = parsed;

  try {
    const [infoRes, branchesRes] = await Promise.all([
      fetch(`${AI_SERVICE_URL}/api/repo/info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ repo_url: repoUrl }),
      }),
      fetch(`https://api.github.com/repos/${owner}/${name}/branches?per_page=100`, {
        headers: { Accept: "application/vnd.github+json" },
      }),
    ]);

    if (!infoRes.ok || !branchesRes.ok) {
      return new Response(
        JSON.stringify({ detail: "Could not fetch branches. Check the repo URL." }),
        { status: infoRes.status === 404 || branchesRes.status === 404 ? 404 : 502 }
      );
    }

    const infoData = await infoRes.json();
    const branchesData = await branchesRes.json();

    const defaultBranch: string = infoData.default_branch;
    const branches = (branchesData as Array<{ name: string }>).map((b) => ({
      name: b.name,
      isDefault: b.name === defaultBranch,
    }));

    return Response.json({ branches, defaultBranch, repoInfo: infoData });
  } catch {
    return new Response(JSON.stringify({ detail: "Failed to reach GitHub" }), { status: 502 });
  }
}
