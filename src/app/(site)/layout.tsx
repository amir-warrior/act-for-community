import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { getSettings } from "@/lib/content";
import { contactLinks } from "@/lib/links";

/** Header, footer and mobile CTA bar for the main site (every page except /v2). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const { contacts } = getSettings();
  const links = contactLinks(contacts);
  return (
    <>
      <Header instagram={links.instagram} telegram={links.telegram} />
      <main id="main">{children}</main>
      <Footer contacts={contacts} />
      <MobileCtaBar />
    </>
  );
}
