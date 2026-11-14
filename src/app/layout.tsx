import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { getSettings } from "@/lib/content";
import { contactLinks } from "@/lib/links";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { HOME_DESCRIPTION } from "@/lib/seo";

const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], variable: "--font-unbounded", display: "swap" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { contacts } = getSettings();
  const links = contactLinks(contacts);
  return (
    <html lang="en" className={`${unbounded.variable} ${manrope.variable} ${instrument.variable}`}>
      <body>
        <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
          Skip to content
        </a>
        <MotionProvider>
          <Header instagram={links.instagram} telegram={links.telegram} />
          <main id="main">{children}</main>
          <Footer contacts={contacts} />
          <MobileCtaBar />
        </MotionProvider>
      </body>
    </html>
  );
}
