import { NextRequest, NextResponse } from "next/server";
import { NEWS } from "@/lib/demo-data";
import { DISCLAIMER } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase() || "";
  const category = request.nextUrl.searchParams.get("category");
  const articles = NEWS.filter((n) => {
    const hitQ = !q || n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q);
    const hitC = !category || category === "ALL" || n.category === category;
    return hitQ && hitC;
  });
  return NextResponse.json({ articles, disclaimer: DISCLAIMER });
}
