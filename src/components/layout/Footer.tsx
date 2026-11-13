import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, TelegramIcon } from "@/components/ui/BrandIcons";
import type { SiteSettings } from "@/lib/content";
import { contactLinks } from "@/lib/links";

export function Footer({ contacts }: { contacts: SiteSettings["contacts"] }) {
  const links = contactLinks(contacts);
  const socials = [
    links.instagram && { ...links.instagram, Icon: InstagramIcon, name: "Instagram" },
    links.telegram && { ...links.telegram, Icon: TelegramIcon, name: "Telegram" },
    links.email && { ...links.email, Icon: Mail, name: "Email" },
    links.phone && { ...links.phone, Icon: Phone, name: "Phone" },
  ].filter(Boolean) as { label: string; href: string; name: string; Icon: typeof Mail }[];

  return (
    <footer className="relative overflow-hidden bg-brand-950 pt-20 pb-28 text-white md:pb-10">
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo light />
            <p className="mt-6 max-w-sm leading-relaxed text-white/65">
              A student-led charity initiative from Bishkek, Kyrgyzstan. We turn sport, music and community events into real support for people who need it.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map(({ href, name, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid size-11 place-items-center rounded-full bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-sun hover:text-ink"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Explore" links={[["About us", "/about"], ["Events & stories", "/events"], ["Leadership team", "/team"], ["Contact", "/contact"]]} />
          <FooterCol title="Get involved" links={[["Ask for help", "/help"], ["Become a volunteer", "/volunteer"], ["What you gain", "/what-you-gain"]]} />

          <div className="md:col-span-3">
            <h2 className="font-sans text-xs font-bold tracking-[0.18em] text-white/45 uppercase">Follow us</h2>
            {links.instagram && (
              <a href={links.instagram.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-display text-xl font-medium hover:text-sun">
                {links.instagram.label}
              </a>
            )}
            <p className="mt-2 text-sm text-white/55">Photos, announcements and results from every event.</p>
          </div>
        </div>

        <p className="mt-16 font-display text-[13vw] leading-[0.85] font-semibold tracking-tighter text-white/[0.06] select-none md:text-[9.5rem]" aria-hidden>
          act for community
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Act for Community · Bishkek, Kyrgyzstan</p>
          <p>Made with care by student volunteers.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="md:col-span-2">
      <h2 className="font-sans text-xs font-bold tracking-[0.18em] text-white/45 uppercase">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-white/80 transition-colors hover:text-sun">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
