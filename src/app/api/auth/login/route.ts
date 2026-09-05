import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user-store";
import { assertSameOrigin, clientKey, rateLimit } from "@/lib/security";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const limited = rateLimit(clientKey(request, "login"), 10, 60_000);
  if (!limited.ok) return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const user = findUserByEmail(body.data.email);
  if (!user || !(await verifyPassword(body.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = await createSessionToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}
