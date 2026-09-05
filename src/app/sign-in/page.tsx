"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DISCLAIMER } from "@/lib/constants";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("analyst@nexusfx.local");
  const [password, setPassword] = useState("analyst123");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError("Invalid credentials.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold">Sign in</h1>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <Card className="mt-6 p-6">
        <form className="grid gap-3" onSubmit={onSubmit}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <Button type="submit">Continue</Button>
        </form>
        <p className="mt-4 text-sm text-white/60">
          No account? <Link href="/sign-up">Create one</Link>
        </p>
        <p className="mt-2 text-xs text-white/40">Demo analyst: analyst@nexusfx.local / analyst123</p>
      </Card>
    </div>
  );
}
