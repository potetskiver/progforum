import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { createSession, getSessionCookieName, hashPassword } from "@/app/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (username.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const existing = db.prepare(`SELECT id FROM users WHERE username = ?`).get(username) as
    | { id: number }
    | undefined;

  if (existing) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const result = db
    .prepare(`INSERT INTO users (username, password_hash) VALUES (?, ?)`)
    .run(username, passwordHash);

  const userId = Number(result.lastInsertRowid);

  const session = createSession(userId);

  const res = NextResponse.json({ ok: true });

  res.cookies.set(getSessionCookieName(), session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt),
  });

  return res;
}