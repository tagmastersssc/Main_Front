import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const envPath = resolve(projectRoot, ".env");
const publicDir = resolve(projectRoot, "public");

const parseDotEnv = (content) => {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .reduce((accumulator, line) => {
      const separatorIndex = line.indexOf("=");
      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();

      const isWrappedInDoubleQuotes = value.startsWith('"') && value.endsWith('"');
      const isWrappedInSingleQuotes = value.startsWith("'") && value.endsWith("'");
      if (isWrappedInDoubleQuotes || isWrappedInSingleQuotes) {
        value = value.slice(1, -1);
      }

      accumulator[key] = value;
      return accumulator;
    }, {});
};

const envFromFile = existsSync(envPath) ? parseDotEnv(readFileSync(envPath, "utf8")) : {};
const siteUrlRaw = (process.env.VITE_SITE_URL || envFromFile.VITE_SITE_URL || "https://example.com")
  .trim()
  .replace(/\/+$/, "");
const today = new Date().toISOString().slice(0, 10);
const sitemapEntries = [
  {
    loc: `${siteUrlRaw}/`,
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    loc: `${siteUrlRaw}/facturacion-electronica-colombia/`,
    changefreq: "weekly",
    priority: "0.9",
  },
];

const robotsContent = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrlRaw}/sitemap.xml\n`;
const sitemapXmlEntries = sitemapEntries
  .map(
    (entry) =>
      `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
  )
  .join("\n");
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapXmlEntries}\n</urlset>\n`;

writeFileSync(resolve(publicDir, "robots.txt"), robotsContent, "utf8");
writeFileSync(resolve(publicDir, "sitemap.xml"), sitemapContent, "utf8");

console.log(`[seo] robots.txt and sitemap.xml generated for ${siteUrlRaw}`);
