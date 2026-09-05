import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { DISCLAIMER } from "@/lib/constants";

export async function GET() {
  const user = await readSession();
  if (!user) return NextResponse.json({ notifications: [], disclaimer: DISCLAIMER });
  return NextResponse.json({
    notifications: [
      { id: "1", title: "Calendar", body: "High-impact US event approaching.", read: false },
      { id: "2", title: "Signals", body: "EURUSD educational idea nearing expiry.", read: false },
    ],
    disclaimer: DISCLAIMER,
  });
}
