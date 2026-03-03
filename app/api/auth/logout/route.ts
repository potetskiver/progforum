import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession, getSessionCookieName } from "@/app/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const sessionName = getSessionCookieName();
  const sessionId = cookieStore.get(sessionName)?.value;

  if (sessionId) {
    deleteSession(sessionId); // Slett sessionen fra databasen, sånn at tokenet ikke lenger er gyldig
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set(sessionName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  return res;
}