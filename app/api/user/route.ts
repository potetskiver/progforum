// app/api/user/route.ts

import { getUser } from "../../lib/user-server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  return NextResponse.json(user);
}