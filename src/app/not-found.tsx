import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center bg-gradient-to-b from-sky to-white px-4 pt-24 text-center">
      <div>
        <p className="font-display text-[7rem] leading-none font-semibold text-brand-600 sm:text-[10rem]">404</p>
        <h1 className="mt-4 text-2xl font-semibold sm:text-4xl">
          This page went <span className="accent-serif text-brand-600">volunteering.</span>
        </h1>
        <p className="mt-3 text-ink-soft">We couldn&apos;t find what you were looking for.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/" variant="brand">
            Back home
          </ButtonLink>
          <ButtonLink href="/events" variant="outline">
            See events
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
