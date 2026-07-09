import { MetadataRoute } from "next";
import { getProperties } from "@/lib/properties";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const properties = await getProperties();
  return ["", "/properties", "/about", "/contact"].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })).concat(properties.map((property) => ({ url: `${base}/properties/${property.id}`, lastModified: new Date() })));
}
