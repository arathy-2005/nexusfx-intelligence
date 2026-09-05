"use client";

import { useEffect, useState } from "react";
import { DISCLAIMER } from "@/lib/constants";
import { NEWS, buildSignals } from "@/lib/demo-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [me, setMe] = useState<{ role?: string; email?: string } | null>(null);
  const [email, setEmail] = useState("admin@nexusfx.local");
  const [password, setPassword] = useState("admin123");

  async function refresh() {
    const res = await fetch("/api/auth/me");
    setMe(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    refresh();
  }

  const isAdmin = me?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Admin panel</h1>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      {!isAdmin ? (
        <Card className="mt-8 max-w-md p-6">
          <p className="text-sm text-white/70">Admin login (demo: admin@nexusfx.local / admin123)</p>
          <form className="mt-4 grid gap-3" onSubmit={login}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" />
            <Button type="submit">Sign in</Button>
          </form>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="font-semibold">Users</h2>
            <ul className="mt-3 text-sm text-white/70">
              <li>analyst@nexusfx.local · USER</li>
              <li>admin@nexusfx.local · ADMIN</li>
            </ul>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Analytics</h2>
            <ul className="mt-3 text-sm text-white/70">
              <li>Signals published: {buildSignals().length}</li>
              <li>News items: {NEWS.length}</li>
              <li>Instruments: 11</li>
            </ul>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Manage signals</h2>
            <ul className="mt-3 grid gap-2 text-sm">
              {buildSignals().map((s) => (
                <li key={s.id}>
                  {s.pair} {s.side} · {s.confidence}%
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Manage news</h2>
            <ul className="mt-3 grid gap-2 text-sm">
              {NEWS.map((n) => (
                <li key={n.id}>{n.title}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
