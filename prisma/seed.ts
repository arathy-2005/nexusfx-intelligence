import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NEWS, CALENDAR, buildSignals } from "../src/lib/demo-data";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@nexusfx.local";
  const password = process.env.ADMIN_PASSWORD || "ChangeMeNow!23";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Administrator",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 12),
      settings: { create: {} },
    },
  });

  await prisma.signal.deleteMany();
  await prisma.signal.createMany({
    data: buildSignals().map((s) => ({
      pair: s.pair,
      side: s.side,
      entry: s.entry,
      stopLoss: s.stopLoss,
      takeProfit: s.takeProfit,
      confidence: s.confidence,
      riskPercent: s.riskPercent,
      trend: s.trend,
      timeframe: s.timeframe,
      reason: s.reason,
      expiresAt: new Date(s.expiresAt),
    })),
  });

  await prisma.newsArticle.deleteMany();
  await prisma.newsArticle.createMany({
    data: NEWS.map((n) => ({
      title: n.title,
      summary: n.summary,
      source: n.source,
      category: n.category,
      url: n.url,
      publishedAt: new Date(n.publishedAt),
    })),
  });

  await prisma.calendarEvent.deleteMany();
  await prisma.calendarEvent.createMany({
    data: CALENDAR.map((e) => ({
      title: e.title,
      country: e.country,
      currency: e.currency,
      impact: e.impact,
      forecast: e.forecast,
      previous: e.previous,
      actual: e.actual,
      eventTime: new Date(e.eventTime),
    })),
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
