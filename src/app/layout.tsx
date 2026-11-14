import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { HOME_DESCRIPTION } from "@/lib/seo";

const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], variable: "--font-unbounded", display: "swap" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
/** Condensed display face for the giant words on /v2. */
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Act for Community — student-led charity in Bishkek",
    template: "%s · Act for Community",
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#1f52d8",
  width: "device-width",
  initialScale: 1,
};

/** Root shell only (fonts, <html>, <body>). Header/footer live in app/(site)/layout.tsx; /v2 has its own. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${unbounded.variable} ${manrope.variable} ${instrument.variable} ${anton.variable}`}>
      <body>
        <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
