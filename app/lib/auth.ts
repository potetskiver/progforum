// app/lib/auth.ts

import bcrypt from "bcrypt";
import crypto from "crypto";
import db from "./db";

const SESSION_COOKIE = "pf_session";

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function newSessionId() {
  return crypto.randomUUID();
}

export function sessionExpiryISO(days = 7) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function createSession(userId: number) {
  const id = newSessionId();
  const expiresAt = sessionExpiryISO(7);

  db.prepare(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`
  ).run(id, userId, expiresAt);

  return { id, expiresAt };
}

export function deleteSession(sessionId: string) {
  db.prepare(`DELETE FROM sessions WHERE id = ?`).run(sessionId);
}

type SessionUserRow = {
  id: number;
  username: string;
  admin: boolean;
};

export function getUserBySession(sessionId: string) {
  db.prepare(`DELETE FROM sessions WHERE expires_at <= datetime('now')`).run();

  const row = db
    .prepare(`
      SELECT u.id as id, u.username as username, u.admin as admin
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
        AND s.expires_at > datetime('now')
    `)
    .get(sessionId) as SessionUserRow | undefined;

  if (!row) return null;

  return {
    id: row.id,
    name: row.username,
    admin: !!row.admin
  };
}