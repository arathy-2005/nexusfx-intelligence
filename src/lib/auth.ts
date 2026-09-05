import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
};

const COOKIE = "nfx_session";

function secret() {
  const value = process.env.JWT_SECRET || "dev-only-nexusfx-secret-change-in-production-32";
  return new TextEncoder().encode(value);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role === "ADMIN" ? "ADMIN" : "USER",
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

let cachedDemo: Array<SessionUser & { passwordHash: string }> | null = null;

export function demoUsers(): Array<SessionUser & { passwordHash: string }> {
  if (cachedDemo) return cachedDemo;
  cachedDemo = [
    {
      id: "user_demo",
      email: "analyst@nexusfx.local",
      name: "Demo Analyst",
      role: "USER",
      passwordHash: bcrypt.hashSync("analyst123", 8),
    },
    {
      id: "admin_demo",
      email: "admin@nexusfx.local",
      name: "Demo Admin",
      role: "ADMIN",
      passwordHash: bcrypt.hashSync("admin123", 8),
    },
  ];
  return cachedDemo;
}
