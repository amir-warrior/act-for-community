/**
 * Public URL of the site, used for canonical links, the sitemap and share previews.
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL — set it in the hosting dashboard once you have a custom domain
 *   2. VERCEL_PROJECT_PRODUCTION_URL — set automatically by Vercel (e.g. act-for-community.vercel.app)
 *   3. URL — set automatically by Netlify
 *   4. localhost for development
 */
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || vercel || process.env.URL || "http://localhost:3000").replace(/\/$/, "");

export const SITE_NAME = "Act for Community";
