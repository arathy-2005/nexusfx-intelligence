import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { DISCLAIMER } from "@/lib/constants";

const watch = new Map<string, string[]>();

export async function GET() {
  const user = await readSession();
  if (!user) return NextResponse.json({ items: [], disclaimer: DISCLAIMER });
  return NextResponse.json({ items: watch.get(user.id) ?? ["EURUSD", "XAUUSD"], disclaimer: DISCLAIMER });
}

export async function POST(request: NextRequest) {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = z.object({ symbol: z.string().min(3).max(12) }).safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const current = new Set(watch.get(user.id) ?? []);
  if (current.has(body.data.symbol)) current.delete(body.data.symbol);
  else current.add(body.data.symbol);
  watch.set(user.id, [...current]);
  return NextResponse.json({ items: [...current], disclaimer: DISCLAIMER });
}
