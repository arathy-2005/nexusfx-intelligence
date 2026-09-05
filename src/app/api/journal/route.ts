import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { DISCLAIMER } from "@/lib/constants";

const journal = new Map<string, Array<{ pair: string; side: string; notes: string; createdAt: string }>>();

export async function GET() {
  const user = await readSession();
  if (!user) return NextResponse.json({ entries: [], disclaimer: DISCLAIMER });
  return NextResponse.json({ entries: journal.get(user.id) ?? [], disclaimer: DISCLAIMER });
}

export async function POST(request: NextRequest) {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = z
    .object({ pair: z.string().max(16), side: z.string().max(8), notes: z.string().max(2000) })
    .safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const entry = { ...body.data, notes: body.data.notes.replace(/[<>]/g, ""), createdAt: new Date().toISOString() };
  const list = [entry, ...(journal.get(user.id) ?? [])];
  journal.set(user.id, list);
  return NextResponse.json({ entries: list, disclaimer: DISCLAIMER });
}
