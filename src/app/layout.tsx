import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DISCLAIMER, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const url = process.env.NEXT_PUBLIC_APP_URL || "https://nexusfx.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${SITE_NAME} — Forex Analysis Platform`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  keywords: ["forex analysis", "market education", "risk calculator", "economic calendar", "not financial advice"],
  openGraph: {
    title: `${SITE_NAME} — Educational Forex Analysis`,
    description: `${SITE_TAGLINE} ${DISCLAIMER}`,
    type: "website",
    url,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DISCLAIMER,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: `${SITE_TAGLINE} ${DISCLAIMER}`,
    disambiguatingDescription: DISCLAIMER,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <DisclaimerBanner />
          <SiteHeader />
          <main className="min-h-[70vh]">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
