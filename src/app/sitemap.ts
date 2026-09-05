import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://nexusfx.vercel.app";
  const paths = [
    "",
    "/market",
    "/charts",
    "/analysis",
    "/signals",
    "/calendar",
    "/news",
    "/calculators",
    "/calculators/lot-size",
    "/calculators/pip",
    "/dashboard",
    "/sign-in",
    "/docs",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: path === "" ? 1 : 0.7,
  }));
}
