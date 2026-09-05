import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, hashPassword, setSessionCookie } from "@/lib/auth";
import { addUser, findUserByEmail } from "@/lib/user-store";
import { assertSameOrigin, clientKey, rateLimit } from "@/lib/security";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const limited = rateLimit(clientKey(request, "register"), 8);
  if (!limited.ok) return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  if (findUserByEmail(body.data.email)) return NextResponse.json({ error: "Email in use" }, { status: 409 });
  const user = addUser({
    id: `user_${Date.now()}`,
    email: body.data.email,
    name: body.data.name.replace(/[<>]/g, ""),
    role: "USER",
    passwordHash: await hashPassword(body.data.password),
  });
  const token = await createSessionToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
