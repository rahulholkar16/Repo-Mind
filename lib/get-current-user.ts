import { headers } from "next/headers";
import { auth } from "./auth";

/** Resolves the currently authenticated user from the request's session cookie. */
export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
