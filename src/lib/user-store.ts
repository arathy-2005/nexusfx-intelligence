import { demoUsers } from "@/lib/auth";
import type { SessionUser } from "@/lib/auth";

const extra: Array<SessionUser & { passwordHash: string }> = [];

export function findUserByEmail(email: string) {
  return [...demoUsers(), ...extra].find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function addUser(user: SessionUser & { passwordHash: string }) {
  extra.push(user);
  return user;
}
