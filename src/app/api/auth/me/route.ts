import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";

export async function GET() {
  const user = await readSession();
  if (!user) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, ...user });
}
