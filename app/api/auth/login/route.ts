import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { createSession, getSessionCookieName, verifyPassword } from "@/app/lib/auth";
// importere drit

type UserRow = {
  id: number;
  password_hash: string;
}; //Lage en type for UserRow for å få bedre type-sikkerhet

export async function POST(req: Request) { //Definere hva som skjer når en POST request blir gjort til denne routen
  const body = await req.json().catch(() => ({})); //Prøver å parse bodyen som JSON, hvis det feiler så returnerer den en tom object
  const username = typeof body.username === "string" ? body.username.trim() : ""; //Sjekker om body.username er en string, hvis det er det så trimmer den den (fjerner whitespace), hvis ikke så setter den username til en tom string
  const password = typeof body.password === "string" ? body.password : ""; //Same shit bare for passord

  if (!username || !password) { // hvis username eller passord er tomt så returnerer den en feil.
    return NextResponse.json({ error: "Missing username or password" }, { status: 400 }); // gi error
  }

  const row = db 
    .prepare(`SELECT id, password_hash FROM users WHERE username = ?`) //database forspørsel
    .get(username) as UserRow | undefined; // sett svaret som vår type

  if (!row) { // hvis row failer
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 }); // gi error
  }

  const ok = await verifyPassword(password, row.password_hash); // test passord
  if (!ok) { //hvis feil passord
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 }); //gi error
  }

  const session = createSession(row.id); //lag sessiontoken fra iden til brukeren

  const res = NextResponse.json({ ok: true }); // yes

  res.cookies.set(getSessionCookieName(), session.id, { //sett innloggings token
    httpOnly: true, // stopper javascript fra å lese cookien
    sameSite: "lax", // Stopper csrf
    secure: process.env.NODE_ENV === "production",
    path: "/", // cookie er tilgjengelig på hele siden
    expires: new Date(session.expiresAt), // setter utløpsdato for cookie til det samme som sessionen i databasen
  });

  return res; // returnerer responsen
}