import { cookies } from "next/headers";
import { getSessionCookieName, getUserBySession } from "./auth";

export type CurrentUser = { id: number; name: string } | null;

export async function getUser(): Promise<CurrentUser> {
  const cookieStore = await cookies(); // cookies() is async in your Next version
  const sessionId = cookieStore.get(getSessionCookieName())?.value;
  if (!sessionId) return null;

  return getUserBySession(sessionId);
}