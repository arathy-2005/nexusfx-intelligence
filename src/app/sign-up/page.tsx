"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DISCLAIMER } from "@/lib/constants";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      setError("Could not register. Try another email.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold">Create account</h1>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <Card className="mt-6 p-6">
        <form className="grid gap-3" onSubmit={onSubmit}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" required />
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" required />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" required minLength={8} />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <Button type="submit">Create account</Button>
        </form>
      </Card>
    </div>
  );
}
