// app/api/auth/changepassword/route.ts

import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { cookies } from "next/headers";
import { getSessionCookieName, verifyPassword, hashPassword } from "@/app/lib/auth";

type UserRow = {
  id: number;
  password_hash: string;
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const oldPassword = typeof body.oldPassword === "string" ? body.oldPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!oldPassword || !newPassword) {
    return NextResponse.json(
      { error: "Missing old or new password" },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "New password must be at least 6 characters long" },
      { status: 400 }
    );
  }

  if (newPassword.length > 50) {
    return NextResponse.json(
      { error: "New password must be less than 50 characters long" },
      { status: 400 }
    );
  }

  if (oldPassword === newPassword) {
    return NextResponse.json(
      { error: "New password must be different from current password" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(getSessionCookieName())?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const user = db
    .prepare(`
      SELECT u.id, u.password_hash
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
        AND s.expires_at > datetime('now')
    `)
    .get(sessionId) as UserRow | undefined;

  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const passwordMatches = await verifyPassword(
    oldPassword,
    user.password_hash
  );

  if (!passwordMatches) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }

  const newPasswordHash = await hashPassword(newPassword);

  db.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`).run(
    newPasswordHash,
    user.id
 );

  db.prepare(`DELETE FROM sessions WHERE user_id = ?`).run(user.id);
  return NextResponse.json({ ok: true });
}