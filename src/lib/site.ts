/**
 * Public URL of the site, used for canonical links, the sitemap and share previews.
 * Priority: NEXT_PUBLIC_SITE_URL (set it once you have a custom domain) →
 * URL (set automatically by Netlify during builds) → localhost for development.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "http://localhost:3000").replace(/\/$/, "");

export const SITE_NAME = "Act for Community";
