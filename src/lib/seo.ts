import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./site";

export const HOME_TITLE = "Act for Community — student-led charity in Bishkek";
export const HOME_DESCRIPTION =
  "Student-led charity in Bishkek, Kyrgyzstan. We run charity tournaments, fairs, concerts and drives that support people and causes in our city.";

interface PageMetaInput {
  /** Short page title; the layout template appends "· Act for Community". */
  title: string;
  /** 120–160 characters works best for search snippets. */
  description: string;
  /** Path of the page, e.g. "/events". Becomes the canonical URL. */
  path: string;
  /** Share image path; defaults to the site-wide card. */
  image?: string;
}

/**
 * Consistent metadata for every page: title, description, canonical URL,
 * Open Graph and Twitter cards. Share images come from the
 * opengraph-image files (app/opengraph-image.tsx and per-event images).
 */
export function pageMeta({ title, description, path, image }: PageMetaInput): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`;
  const ogImage = image ? { ...DEFAULT_OG_IMAGE, url: image, alt: fullTitle } : DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [ogImage.url] },
  };
}

/** Site-wide share card (app/opengraph-image.tsx). Event pages override it with their own card. */
const DEFAULT_OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME} — student-led charity in Bishkek` };

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Serialises JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
