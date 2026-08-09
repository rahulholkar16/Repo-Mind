import { headers } from "next/headers";
import { auth } from "./auth";

/**
 * Resolves the current session's signed JWT (from the jwt() plugin) so
 * server-side code (API routes, background workers passed a captured token)
 * can authenticate to ai-services without exposing the token to the browser.
 * Returns null if there's no valid session.
 */
export async function getAuthToken(): Promise<string | null> {
  const hdrs = await headers();
  const sessionResponse = await auth.api.getSession({ headers: hdrs, asResponse: true });

  if (!sessionResponse || sessionResponse.status !== 200) {
    return null;
  }

  return sessionResponse.headers.get("set-auth-jwt");
}
